// components/StripeBtn.js
import React from 'react';
import getStripe from '../../../utils/get-stripe';

const StripeBtn = ({ priceId }) => {

    const handleClick = async () => {
        const stripe = await getStripe();
        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
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
    <button onClick={handleClick} style={{ width: '100%' }}>
      Subscribe Now
    </button>
  );
};

export default StripeBtn;
