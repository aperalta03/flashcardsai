import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '../../../config/firebaseadmin'; // Import from your Firebase Admin SDK initialization

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the ID token and extract the userId
        const decodedToken = await adminAuth.verifyIdToken(idToken); // Use adminAuth from Firebase Admin SDK
        const userId = decodedToken.uid;

        const origin = request.headers.get('origin') || 'http://localhost:3000';
        const requestData = await request.json();
        const { priceId } = requestData || {};

        if (!userId) {
            console.error('User ID is missing or invalid');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const params = {
            payment_method_types: ['card'],
            mode: 'subscription',
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
            success_url: `${origin}/flashcards`,
            cancel_url: `${origin}/subscription-failed`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);

        // Write subscription data to Firestore using adminDb from Firebase Admin SDK
        await adminDb.collection('users').doc(userId).set(
            { isSubscribed: true },
            { merge: true }
        );

        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
