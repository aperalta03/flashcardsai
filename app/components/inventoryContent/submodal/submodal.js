import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import styles from './submodal.module.css';
import StripeButton from './stripeBtn/stripeBtn';

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
        <StripeButton />
        
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;
