import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '../../../config/firebaseadmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            await request.text(), // use text() here since it's raw JSON
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const subscriptionId = session.subscription;
        const userId = session.client_reference_id;
        
        console.log('Subscription ID at webhook:', subscriptionId);

        if (subscriptionId && userId) {
            await adminDb.collection('users').doc(userId).set(
                { subscriptionId }, 
                { merge: true }
            );
            console.log('Subscription ID stored in Firestore');
        }
        
    }

    return NextResponse.json({ received: true });
}
