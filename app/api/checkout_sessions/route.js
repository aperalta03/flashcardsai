import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const origin = request.headers.origin || 'http://localhost:3000'; // Fallback to localhost if origin is undefined
    const params = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Subscription',
            },
            unit_amount: 1000, // Amount in cents
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return new Response(JSON.stringify(checkoutSession), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(JSON.stringify({ error: 'Failed to create session' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
