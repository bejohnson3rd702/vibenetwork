import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Initialize Stripe Client with secret key (SDK manages API version automatically)
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // Initialize Supabase Client with Service Role to bypass RLS for profile updates
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // Fetch user profile from Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id, username, email")
      .eq("id", user.id)
      .single();

    const body = await req.json().catch(() => ({}));
    const returnUrl = body.return_url || body.returnUrl || `${req.headers.get('origin') || 'https://vibenetwork.tv'}`;

    // If request asks for status check only:
    if (body.action === 'get_status' && profile?.stripe_account_id) {
      try {
        const account = await (stripe as any).v2.core.accounts.retrieve(profile.stripe_account_id, {
          include: ["configuration.merchant", "requirements"],
        });
        const readyToProcessPayments = account?.configuration?.merchant?.capabilities?.card_payments?.status === "active";
        const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;
        const onboardingComplete = requirementsStatus !== "currently_due" && requirementsStatus !== "past_due";

        return new Response(JSON.stringify({
          accountId: profile.stripe_account_id,
          readyToProcessPayments,
          requirementsStatus: requirementsStatus || "complete",
          onboardingComplete
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (statusErr: any) {
        console.warn("V2 Account status retrieve fallback:", statusErr.message);
      }
    }

    let accountId = profile?.stripe_account_id;

    // 1. Create Connected Account using V2 API if it does not exist
    if (!accountId) {
      const displayName = profile?.username ? `@${profile.username}` : (user.email || "Vibe Creator");
      const contactEmail = user.email || profile?.email || "creator@vibenetwork.tv";

      // V2 Account Creation: No top-level 'type' parameter
      const account = await (stripe as any).v2.core.accounts.create({
        display_name: displayName,
        contact_email: contactEmail,
        identity: {
          country: "us",
        },
        dashboard: "full",
        defaults: {
          responsibilities: {
            fees_collector: "stripe",
            losses_collector: "stripe",
          },
        },
        configuration: {
          customer: {},
          merchant: {
            capabilities: {
              card_payments: {
                requested: true,
              },
            },
          },
        },
      });

      accountId = account.id;

      // Save mapping in Supabase profiles
      await supabase
        .from("profiles")
        .update({ stripe_account_id: accountId })
        .eq("id", user.id);
    }

    // 2. Generate Onboarding Link using V2 Account Links API
    const accountLink = await (stripe as any).v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["merchant", "customer"],
          refresh_url: returnUrl,
          return_url: `${returnUrl}?accountId=${accountId}&onboarded=true`,
        },
      },
    });

    return new Response(JSON.stringify({ url: accountLink.url, accountId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Stripe V2 Onboard Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
