import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { orderService } from '@/services';
import { formatQuantityToWeight } from '@/utils/formatters';
import { config } from '@/config/env';
import type { DeliveryTimeSlot } from '@/types';

/**
 * useCheckoutForm Hook
 *
 * Centralizes all checkout form logic including:
 * - Form state management
 * - Address auto-population from user profile
 * - Delivery slot management
 * - Form validation
 * - Order submission (WhatsApp & Razorpay)
 * - WhatsApp message generation
 */
export const useCheckoutForm = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

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

  const [availableSlots, setAvailableSlots] = useState<
    { slot: DeliveryTimeSlot; available: boolean; reason: string }[]
  >([]);

  const RAZORPAY_PAYMENT_LINK = config.razorpayPaymentLink;

  /**
   * Auto-populate address from user profile
   */
  useEffect(() => {
    if (user) {
      if (user.address && user.address.street) {
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
        toast.warning('Please add your delivery address first', {
          autoClose: 5000,
        });
        navigate('/profile/edit');
      }
    }
  }, [user, navigate, toast]);

  /**
   * Update available time slots when delivery date changes
   */
  useEffect(() => {
    if (formData.deliveryDate) {
      const slots = orderService.getAvailableTimeSlots(formData.deliveryDate);
      setAvailableSlots(slots);

      // Clear selected slot if it's no longer available
      if (formData.deliveryTime) {
        const selectedSlot = slots.find((s) => s.slot === formData.deliveryTime);
        if (!selectedSlot?.available) {
          setFormData((prev) => ({ ...prev, deliveryTime: '' }));
        }
      }
    }
  }, [formData.deliveryDate, formData.deliveryTime]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validate form fields
   */
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

  /**
   * Generate WhatsApp message for order
   */
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

    const appUrl = window.location.origin;

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
_Please confirm this order. Thank you!_

📊 *Admin Panel:*
${appUrl}/admin/products - Manage Products
${appUrl}/admin/orders - Manage Orders`;

    return message;
  };

  /**
   * Process order submission
   */
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
          const whatsappURL = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

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

  /**
   * Handle time slot selection
   */
  const handleSlotSelect = (slot: DeliveryTimeSlot) => {
    setFormData((prev) => ({ ...prev, deliveryTime: slot }));
  };

  /**
   * Handle form submission
   */
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

  return {
    // Form state
    formData,
    paymentMethod,
    addressLocked,
    showConfirmModal,
    submitting,
    availableSlots,

    // Actions
    handleInputChange,
    handleSlotSelect,
    setPaymentMethod,
    setShowConfirmModal,
    handleSubmit,
    processOrder,
  };
};
