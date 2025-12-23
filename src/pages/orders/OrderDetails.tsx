import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Loading, Button, StatusBadge, Modal } from '@/components/common';
import { OrderStatusStepper } from '@/components/orders/OrderStatusStepper';
import { orderService } from '@/services';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import type { Order } from '@/types';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId!);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      toast.error('Order not found');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(orderId!);
      if (response.success) {
        toast.success('🐟 Fresh catch order cancelled successfully!');
        setOrder(response.data);
        setShowCancelModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const canCancel = order.status === 'pending';

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {}
          <div className="mb-6">
            <button
              onClick={() => navigate('/my-orders')}
              className="text-cyan-600 hover:text-cyan-700 mb-4"
            >
              ← Back to My Orders
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{order.orderId}</h1>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Order Status Stepper */}
          <OrderStatusStepper currentStatus={order.status} className="mb-6" />

          {}
          <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">
            {}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Delivery Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Address:</strong> {order.deliveryDetails.address}
                </p>
                <p>
                  <strong>Phone:</strong> {order.deliveryDetails.phone}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.deliveryDetails.deliveryDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {order.deliveryDetails.deliveryTime}
                </p>
              </div>
            </div>

            {}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} kg × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {}
            {order.orderNotes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {order.orderNotes}
                </p>
              </div>
            )}
          </div>

          {}
          {canCancel && (
            <Button
              onClick={() => setShowCancelModal(true)}
              loading={cancelling}
              variant="outline"
              fullWidth
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="🐟 Cancel Fresh Catch Order"
        size="lg"
        closeOnOverlayClick={!cancelling}
        closeOnEscape={!cancelling}
        showCloseButton={!cancelling}
      >
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              Your seafood order <span className="font-semibold">{order?.orderId}</span> will be{' '}
              <span className="font-semibold text-red-600">permanently removed</span> and this
              action <span className="font-semibold text-red-600">cannot be reversed</span>.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium text-gray-700">Order Total:</span>
                <span className="ml-2 text-green-600 font-bold">
                  ₹{order?.totalAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Delivery Date:</span>
                <span className="ml-2 text-gray-600">
                  {order?.deliveryDetails.deliveryDate &&
                    new Date(order.deliveryDetails.deliveryDate).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
              size="lg"
              fullWidth
              className="order-2 sm:order-1"
            >
              Keep Order
            </Button>
            <Button
              variant="primary"
              onClick={handleCancelOrder}
              loading={cancelling}
              size="lg"
              fullWidth
              className="order-1 sm:order-2 bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default OrderDetails;
