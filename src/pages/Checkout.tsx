import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import {
  useCheckoutForm,
  OrderSummaryBlock,
  DeliveryAddressForm,
  DeliverySlotSelector,
  PaymentMethodSelector,
  ConfirmationModal,
} from '@/organizer/checkout';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { cart, itemCount, totalAmount, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  // Use custom hook for all checkout logic
  const {
    formData,
    paymentMethod,
    addressLocked,
    showConfirmModal,
    submitting,
    availableSlots,
    handleInputChange,
    handleSlotSelect,
    setPaymentMethod,
    setShowConfirmModal,
    handleSubmit,
    processOrder,
  } = useCheckoutForm();

  // Authentication and cart validation
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate, toast]);

  // Loading state
  if (cartLoading || !cart) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading checkout..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Details */}
                <DeliveryAddressForm
                  formData={formData}
                  addressLocked={addressLocked}
                  onInputChange={handleInputChange}
                />

                {/* Delivery Date, Time Slots, and Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Schedule</h2>
                  <DeliverySlotSelector
                    formData={formData}
                    availableSlots={availableSlots}
                    onInputChange={handleInputChange}
                    onSlotSelect={handleSlotSelect}
                  />
                </div>

                {/* Payment Method */}
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  totalAmount={totalAmount}
                  onMethodChange={setPaymentMethod}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting || cart.items.length === 0}
                  loading={submitting}
                  variant="primary"
                  fullWidth
                  size="lg"
                >
                  {submitting
                    ? 'Creating Order...'
                    : paymentMethod === 'whatsapp'
                    ? 'Place Order via WhatsApp'
                    : 'Continue to Payment'}
                </Button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummaryBlock cart={cart} totalAmount={totalAmount} itemCount={itemCount} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={processOrder}
        submitting={submitting}
        cart={cart}
        formData={formData}
        totalAmount={totalAmount}
      />
    </Layout>
  );
};

export default Checkout;
