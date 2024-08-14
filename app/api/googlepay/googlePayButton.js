import { useEffect } from 'react';

const GooglePayButton = () => {
  useEffect(() => {
    const loadGooglePayScript = () => {
      if (window.google && window.google.payments) {
        initializeGooglePay();
      } else {
        const script = document.createElement('script');
        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;
        script.onload = initializeGooglePay;
        document.body.appendChild(script);
      }
    };

    const initializeGooglePay = () => {
      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST', // Change to 'PRODUCTION' when you're ready to go live Balon
      });  

      const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',       
              gatewayMerchantId: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
            },
          },
        }], 
        merchantInfo: {
          merchantId: 'BCR2DN4TZP42TPQM',
          merchantName: 'flashie',
        }, 
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: '3.00',           
          currencyCode: 'USD',
          countryCode: 'US',
        },
      };

      const button = paymentsClient.createButton({
        onClick: () => onGooglePayButtonClick(paymentsClient, paymentRequest),
      });
      document.getElementById('googlePayButtonContainer').appendChild(button);
    };

    const onGooglePayButtonClick = (client, request) => {
      client.loadPaymentData(request)
        .then((paymentData) => processPayment(paymentData))
        .catch((err) => console.error(err));
    };

    const processPayment = (paymentData) => {
      const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    };

    loadGooglePayScript();
  }, []);

  return <div id="googlePayButtonContainer"></div>;
};

export default GooglePayButton;
