import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Loading, Button, Modal } from '@/components/common';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { orderService } from '@/services';
import type { DeliveryTimeSlot, CreateOrderRequest } from '@/types';
import { formatQuantityToWeight } from '@/utils/formatters';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { cart, itemCount, totalAmount, loading: cartLoading, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'razorpay-link'>('whatsapp');
  const [addressLocked, setAddressLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: user?.phone || '',
    deliveryDate: '',
    deliveryTime: '' as DeliveryTimeSlot | '',
    orderNotes: '',
  });

  const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@paramanandamrajesh';

  const [availableSlots, setAvailableSlots] = useState<
    { slot: DeliveryTimeSlot; available: boolean; reason: string }[]
  >([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);

  // Check if user has saved address and auto-populate
  useEffect(() => {
    if (user) {
      // Check if user has a saved address
      if (user.address && user.address.street) {
        // Build full address string
        const fullAddress = [
          user.address.street,
          user.address.landmark && `Landmark: ${user.address.landmark}`,
          user.address.city,
          user.address.state,
          user.address.pincode && `PIN: ${user.address.pincode}`,
        ]
          .filter(Boolean)
          .join(', ');

        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
        }));
        setAddressLocked(true);
      } else {
        // No address saved - redirect to profile edit
        toast.warning('Please add your delivery address first', {
          autoClose: 5000,
        });
        navigate('/profile/edit');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.deliveryDate) {
      const slots = orderService.getAvailableTimeSlots(formData.deliveryDate);
      setAvailableSlots(slots);

      if (formData.deliveryTime) {
        const selectedSlot = slots.find((s) => s.slot === formData.deliveryTime);
        if (!selectedSlot?.available) {
          setFormData((prev) => ({ ...prev, deliveryTime: '' }));
        }
      }
    }
  }, [formData.deliveryDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.address || formData.address.length < 10) {
      toast.error('Please enter a valid delivery address (minimum 10 characters)');
      return false;
    }

    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!formData.deliveryDate) {
      toast.error('Please select a delivery date');
      return false;
    }

    if (!formData.deliveryTime) {
      toast.error('Please select a delivery time slot');
      return false;
    }

    const validation = orderService.validateDeliveryTime(
      formData.deliveryDate,
      formData.deliveryTime,
    );

    if (!validation.valid) {
      toast.error(validation.message);
      return false;
    }

    return true;
  };

  const generateWhatsAppMessage = (order: any) => {
    const items =
      cart?.items
        .map(
          (item) =>
            `• ${item.product.name} × ${formatQuantityToWeight(item.quantity)} - ₹${(
              item.product.price * item.quantity
            ).toFixed(2)}`,
        )
        .join('\n') || '';

    const message = `🐟 *New Order from Pattinambakkam Fish World*

*Order ID:* ${order.orderId}
*Customer:* ${user?.name || 'Customer'}
*Phone:* ${formData.phone}

*Items:*
${items}

*Total Amount:* ₹${totalAmount.toFixed(2)}

*Delivery Details:*
📍 Address: ${formData.address}
📅 Date: ${new Date(formData.deliveryDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}
🕐 Time: ${formData.deliveryTime}

${formData.orderNotes ? `*Special Instructions:*\n${formData.orderNotes}\n` : ''}
_Please confirm this order. Thank you!_`;

    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // For WhatsApp orders, show confirmation modal first
    if (paymentMethod === 'whatsapp') {
      setShowConfirmModal(true);
      return;
    }

    // For other payment methods, proceed directly
    await processOrder();
  };

  const processOrder = async () => {
    try {
      setSubmitting(true);

      const orderData = {
        deliveryDetails: {
          address: formData.address,
          phone: formData.phone,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime as DeliveryTimeSlot,
        },
        orderNotes: formData.orderNotes,
        paymentMethod: paymentMethod,
      };

      toast.info('Creating your order...');
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        const order = response.data;

        // Clear the cart after successful order
        clearCart();

        if (paymentMethod === 'whatsapp') {
          toast.success('Order created! Redirecting to WhatsApp...');

          const whatsappMessage = generateWhatsAppMessage(order);
          const encodedMessage = encodeURIComponent(whatsappMessage);
          const whatsappNumber = '919994072395';
          const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

          window.open(whatsappURL, '_blank');

          setTimeout(() => {
            navigate(`/orders/${order.orderId}/confirmation`);
          }, 1000);
        } else {
          toast.success(`Order created! Please pay ₹${order.totalAmount} on the payment page.`, {
            autoClose: 7000,
          });

          localStorage.setItem('pendingPaymentOrderId', order.orderId);
          localStorage.setItem('pendingPaymentAmount', order.totalAmount.toString());

          window.open(RAZORPAY_PAYMENT_LINK, '_blank');

          setTimeout(() => {
            navigate(`/orders/${order.orderId}/confirmation`);
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
            {}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>

                  {}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Delivery Address *
                      </label>
                      {addressLocked && (
                        <button
                          type="button"
                          onClick={() => navigate('/profile/edit')}
                          className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Edit in Profile →
                        </button>
                      )}
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Enter your complete delivery address"
                      readOnly={addressLocked}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 ${
                        addressLocked ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                    {addressLocked && (
                      <p className="text-xs text-gray-500 mt-1">
                        This address is from your profile. Click "Edit in Profile" to update it.
                      </p>
                    )}
                  </div>

                  {}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit phone number"
                      pattern="[6-9][0-9]{9}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      required
                      min={today}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Time Slot *{' '}
                      <span className="text-xs text-orange-600">(Minimum 4 hours from now)</span>
                    </label>
                    {formData.deliveryDate ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {availableSlots.map(({ slot, available, reason }) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              available &&
                              setFormData((prev) => ({
                                ...prev,
                                deliveryTime: slot as DeliveryTimeSlot,
                              }))
                            }
                            disabled={!available}
                            className={`p-4 rounded-lg border-2 text-sm font-semibold transition-all ${
                              formData.deliveryTime === slot
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                : available
                                ? 'border-gray-200 hover:border-cyan-300 text-gray-700'
                                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div>{slot}</div>
                            <div className="text-xs mt-1">{reason}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Please select a delivery date first</p>
                    )}
                  </div>

                  {}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      rows={2}
                      maxLength={500}
                      placeholder="E.g., Please clean and cut into medium pieces"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.orderNotes.length}/500 characters
                    </p>
                  </div>
                </div>

                {}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {}
                    <div
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'whatsapp'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={paymentMethod === 'whatsapp'}
                          onChange={() => setPaymentMethod('whatsapp')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">💬 WhatsApp Order</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Order via WhatsApp & pay using UPI/PhonePe/GPay
                          </p>
                          <div className="mt-2 text-sm text-gray-700">
                            Amount: <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="mt-1 text-xs text-green-600">✓ Quick & convenient</div>
                        </div>
                      </div>
                    </div>

                    {}
                    <div
                      onClick={() => setPaymentMethod('razorpay-link')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'razorpay-link'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={paymentMethod === 'razorpay-link'}
                          onChange={() => setPaymentMethod('razorpay-link')}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">💳 Pay Online</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay now using UPI, Cards, NetBanking, or Wallets
                          </p>
                          <div className="mt-2 flex items-center space-x-1 text-xs">
                            <span className="text-green-600 font-medium">
                              ✓ Instant confirmation
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-green-600 font-medium">
                            ✓ Secure payment
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
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

            {}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                {}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {formatQuantityToWeight(item.quantity)}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Fresh seafood delivered</p>
                  <p>✓ WhatsApp/UPI payment accepted</p>
                  <p>
                    ✓ {itemCount} item{itemCount !== 1 ? 's' : ''} in order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Your Order"
        size="lg"
        closeOnOverlayClick={!submitting}
        closeOnEscape={!submitting}
        showCloseButton={!submitting}
      >
        <div className="space-y-4 md:space-y-6">
          {/* Order Items Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Order Items:</h3>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 max-h-40 md:max-h-48 overflow-y-auto">
              {cart?.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start gap-2 text-xs md:text-sm"
                >
                  <span className="text-gray-700 flex-1">
                    {item.product.name} × {formatQuantityToWeight(item.quantity)}
                  </span>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-sm md:text-base">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
              Delivery Details:
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2.5 text-xs md:text-sm">
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-600 mt-0.5 leading-relaxed">{formData.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-600">{formData.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-600">
                    {new Date(formData.deliveryDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Time:</span>
                <p className="text-gray-600">{formData.deliveryTime}</p>
              </div>
              {formData.orderNotes && (
                <div>
                  <span className="font-medium text-gray-700">Special Instructions:</span>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">{formData.orderNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">💬</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base">WhatsApp Order</h4>
                <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">
                  You'll be redirected to WhatsApp to confirm this order. Pay using UPI/PhonePe/GPay
                  after confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={submitting}
              size="lg"
              fullWidth
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={processOrder}
              loading={submitting}
              size="lg"
              fullWidth
              className="order-1 sm:order-2"
            >
              Confirm & Proceed to WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Checkout;
