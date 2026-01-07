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
    getFormCompletionStatus,
  } = useCheckoutForm();

  // Get form completion status for button gating
  const { isComplete: isFormComplete, missingFields } = getFormCompletionStatus();

  // Validate cart and address on page load
  useEffect(() => {
    // Clean up the redirect flag now that we're at checkout
    sessionStorage.removeItem('intendedDestination');
    sessionStorage.removeItem('redirectAfterProfileEdit');

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate, toast]);

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
                  hasAddress={formData.address.length > 0}
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
                <div className="group relative">
                  <Button
                    type="submit"
                    disabled={submitting || cart.items.length === 0 || !isFormComplete}
                    loading={submitting}
                    variant="primary"
                    fullWidth
                    size="lg"
                    className={!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {submitting
                      ? 'Creating Order...'
                      : paymentMethod === 'whatsapp'
                      ? 'Place Order via WhatsApp'
                      : 'Continue to Payment'}
                  </Button>

                  {/* Tooltip for missing fields */}
                  {!isFormComplete && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <p className="font-semibold mb-1">Please complete:</p>
                      <ul className="space-y-0.5">
                        {missingFields.map((field) => (
                          <li key={field} className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>{field}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="absolute top-full left-4 w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
                    </div>
                  )}
                </div>
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
