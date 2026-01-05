import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { cart, itemCount, totalAmount, loading: cartLoading } = useCart();

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

  // Validate cart and address on page load
  useEffect(() => {
    // Clean up the redirect flag now that we're at checkout
    sessionStorage.removeItem('intendedDestination');

    // Check if user has address
    if (!user?.address || Object.keys(user.address).length === 0) {
      console.log('No address found. Redirecting to profile/edit');
      sessionStorage.setItem('redirectAfterProfileEdit', '/checkout');
      toast.warning('Please complete your address information first');
      navigate('/profile/edit', { state: { redirectTo: '/checkout' } });
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate, toast, user]);

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

  // Show checkout form for authenticated users only
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
