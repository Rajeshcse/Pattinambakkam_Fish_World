import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, Loading, Button, StatusBadge } from '@/components/common';
import { OrderStatusStepper } from '@/components/orders/OrderStatusStepper';
import { orderService } from '@/services';
import type { Order } from '@/types';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(orderId!);
      if (response.success) {
        toast.success('Order cancelled successfully');
        setOrder(response.data);
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
            <Button onClick={handleCancelOrder} loading={cancelling} variant="outline" fullWidth>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
