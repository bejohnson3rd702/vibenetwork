import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

// Initialize Stripe with the Secret Key from Supabase Environment Variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

// Configure CORS headers for the frontend to communicate with the Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse the payload sent from the frontend
    const { itemName, amount, creatorId } = await req.json();

    if (!itemName || !amount) {
      throw new Error('Item name and amount are required.');
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: itemName,
              description: `Purchase from Vibe Network Creator: ${creatorId}`,
            },
            unit_amount: amount, // Amount is expected in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Redirect URLs after Stripe processes the payment
      success_url: `${req.headers.get('origin') || `${req.headers.get('origin') || 'https://vibenetwork.tv'}`}?checkout=success`,
      cancel_url: `${req.headers.get('origin') || `${req.headers.get('origin') || 'https://vibenetwork.tv'}`}?checkout=canceled`,
      metadata: {
        creatorId: creatorId,
        itemName: itemName
      }
    });

    // Return the generated Session ID and URL to the frontend
    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
