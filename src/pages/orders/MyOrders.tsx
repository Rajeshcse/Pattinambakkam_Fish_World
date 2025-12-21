import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, Loading, StatusBadge } from '@/components/common';
import { orderService } from '@/services';
import type { Order } from '@/types';

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading your orders..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 font-semibold"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.orderId}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Delivery:{' '}
                      {new Date(order.deliveryDetails.deliveryDate).toLocaleDateString()}{' '}
                      {order.deliveryDetails.deliveryTime}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                    <button className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
