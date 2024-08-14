import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import styles from './submodal.module.css';
import GooglePayButton from '@/app/api/googlepay/googlePayButton'; // Ensure path is correct
import StripeButton from '../../../api/checkout_sessions/stripeBtn';
import CheckoutButton from '../../../api/checkout_sessions/checkoutButton';

const SubscriptionModal = ({ open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    console.log(`Processing payment for the ${selectedPlan} plan.`);
    onClose(); 
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <Typography variant="h6" className={styles.modalTitle}>
          Choose Your Plan
        </Typography>
        <Button
          className={`${styles.planButton} ${selectedPlan === 'basic' ? styles.active : ''}`}
          onClick={() => handlePlanSelect('basic')}
        >
          Basic Plan - $5/month
        </Button>
        <Button
          className={`${styles.planButton} ${selectedPlan === 'pro' ? styles.active : ''}`}
          onClick={() => handlePlanSelect('pro')}
        >
          Pro Plan - $10/month
        </Button>
        <Button
          className={`${styles.planButton} ${selectedPlan === 'trial' ? styles.active : ''}`}
          onClick={() => handlePlanSelect('trial')}
        >
          1-Day Free Trial
        </Button>
        {/* <GooglePayButton /> */}
        < StripeButton />
        <CheckoutButton />
        <Button
          className={styles.paymentButton}
          onClick={handlePayment}
          disabled={!selectedPlan}
        >
          Confirm Payment
        </Button>
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;
