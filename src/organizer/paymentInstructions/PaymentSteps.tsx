import React from 'react';

/**
 * PaymentSteps Component
 *
 * Step-by-step payment instructions (4 steps)
 */
export const PaymentSteps: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Click the payment button below',
      description: 'You will be redirected to our secure Razorpay payment page',
    },
    {
      number: 2,
      title: 'Choose your payment method',
      description: 'Pay using UPI, Card, Net Banking, or Wallet',
    },
    {
      number: 3,
      title: 'Complete the payment',
      description: 'After successful payment, return to this page and click "I\'ve Paid"',
    },
    {
      number: 4,
      title: 'Wait for confirmation',
      description: "We'll verify your payment and confirm your order within 30 minutes",
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {steps.map((step) => (
        <div key={step.number} className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
            {step.number}
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-800">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
