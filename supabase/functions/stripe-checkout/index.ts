import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const { creatorId, amount, productTitle, returnUrl, extraMetadata } = await req.json();

    if (!creatorId || !amount) {
      return new Response("Missing parameters", { status: 400, headers: corsHeaders });
    }

    // 1. Fetch Creator's Stripe Connection and Fee %
    const { data: creator } = await supabase
      .from("profiles")
      .select("stripe_account_id, platform_fee_percentage, whitelabel_id")
      .eq("id", creatorId)
      .single();

    if (!creator || !creator.stripe_account_id) {
      return new Response(JSON.stringify({ error: "Creator cannot receive payments yet." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Fetch Global Settings as fallback
    const { data: globalSettings } = await supabase.from('platform_settings').select('*').limit(1).maybeSingle();
    const globalVibeFee = globalSettings ? Number(globalSettings.global_vibe_fee) : 15;
    const globalWlFee = globalSettings ? Number(globalSettings.global_whitelabel_fee) : 15;

    // 2. Calculate Total Platform Fee (Vibe Base + Potential Whitelabel)
    let totalFeePercent = Number(creator.platform_fee_percentage ?? globalVibeFee);
    
    // If they belong to an Enterprise Whitelabel, pull that fee too
    if (creator.whitelabel_id) {
       const { data: wl } = await supabase.from('whitelabel_configs').select('platform_fee_percentage').eq('id', creator.whitelabel_id).single();
       totalFeePercent += Number(wl?.platform_fee_percentage ?? globalWlFee);
    }

    // Amount is in cents
    const amountInCents = Math.round(Number(amount) * 100);
    const applicationFeeInCents = Math.round(amountInCents * (totalFeePercent / 100));

    // 3. Create Stripe Checkout Session with Destination Charge
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productTitle || "Vibe Network Purchase",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeInCents,
        transfer_data: {
          destination: creator.stripe_account_id,
        },
        metadata: {
           buyer_id: user.id,
           creator_id: creatorId,
           product_title: productTitle,
           ...(extraMetadata || {})
        }
      },
      success_url: returnUrl ? `${returnUrl}?success=true` : "http://localhost:5174/profile?success=true",
      cancel_url: returnUrl ? `${returnUrl}?canceled=true` : "http://localhost:5174/profile?canceled=true",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
