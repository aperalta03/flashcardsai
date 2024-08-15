import React from 'react';
import getStripe from '../../../../../utils/get-stripe';
import { Button } from '@mui/material';
import { auth } from '../../../../../firebase'; // Import the auth instance

const StripeBtn = ({ priceId }) => {

    const handleClick = async () => {
        const stripe = await getStripe();
        const user = auth.currentUser;

        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        const idToken = await user.getIdToken(); // Get the ID token

        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`, // Send the token in the header
          },
          body: JSON.stringify({ priceId }), // Pass priceId only
        });
      
        if (!response.ok) {
          console.error('Error creating Stripe session:', response.statusText);
          return;
        }
      
        try {
          const session = await response.json();
          await stripe.redirectToCheckout({ sessionId: session.id });
        } catch (err) {
          console.error('Failed to parse response JSON:', err);
        }
    };

  return (
    <Button onClick={handleClick} style={{ width: '100%' }}>
      Subscribe Now
    </Button>
  );
};

export default StripeBtn;
