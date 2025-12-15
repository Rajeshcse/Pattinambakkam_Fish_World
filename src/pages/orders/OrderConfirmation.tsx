import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { orderService } from '@/services';
import type { Order } from '@/types';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
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

  if (!order) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for your order. We'll deliver fresh seafood to your door.
            </p>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Order ID</h2>
              <p className="text-2xl font-bold text-gray-900">{order.orderId}</p>
            </div>

            {}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Address:</strong> {order.deliveryDetails.address}
                </p>
                <p>
                  <strong>Phone:</strong> {order.deliveryDetails.phone}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{' '}
                  {new Date(order.deliveryDetails.deliveryDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time Slot:</strong> {order.deliveryDetails.deliveryTime}
                </p>
              </div>
            </div>

            {}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>
                      {item.name} × {item.quantity}kg
                    </span>
                    <span className="font-semibold">₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {}
            <div className="mt-6">
              {order.payment?.method === 'razorpay-link' && order.payment?.status === 'pending' && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-bold text-yellow-900 mb-2 text-lg">⚠️ Payment Pending</h3>
                      <p className="text-sm text-yellow-800 mb-3">
                        Your order is created but payment is pending. Please complete the payment to
                        confirm your order.
                      </p>

                      {}
                      <div className="bg-white border-2 border-yellow-400 rounded-lg p-4 mb-4">
                        <p className="text-xs text-yellow-700 mb-1">AMOUNT TO PAY:</p>
                        <p className="text-3xl font-bold text-yellow-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-yellow-600 mt-2">
                          💡 Please enter this EXACT amount on the payment page
                        </p>
                      </div>

                      <a
                        href="https://razorpay.me/@paramanandamrajesh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-yellow-600 text-white py-3 px-6 rounded-lg text-sm font-bold hover:bg-yellow-700 transition-colors shadow-md"
                      >
                        💳 Complete Payment Now
                      </a>

                      <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          📋 Payment Instructions:
                        </p>
                        <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                          <li>Click the button above to open Razorpay</li>
                          <li>
                            Enter amount: <strong>₹{order.totalAmount.toFixed(2)}</strong>
                          </li>
                          <li>Complete payment using UPI/Card/NetBanking</li>
                          <li>We'll verify and confirm within 30 minutes</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {order.payment?.method === 'razorpay-link' &&
                order.payment?.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-green-800 mb-1">Payment Confirmed</h3>
                        <p className="text-sm text-green-700">
                          Thank you! Your payment has been verified and your order is confirmed.
                        </p>
                        {order.payment?.paidAt && (
                          <p className="text-xs text-green-600 mt-2">
                            Paid on: {new Date(order.payment.paidAt).toLocaleString('en-IN')}
                          </p>
                        )}
                        {order.payment?.razorpayTransactionId && (
                          <p className="text-xs text-green-600 mt-1">
                            Transaction ID: {order.payment.razorpayTransactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {order.payment?.method === 'whatsapp' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 mb-2">💬 WhatsApp Payment</h3>
                      <p className="text-sm text-green-700 mb-3">
                        Your order has been sent via WhatsApp. Please complete payment to confirm
                        your order.
                      </p>

                      {}
                      <div className="bg-white border-2 border-green-300 rounded-lg p-3 mb-3">
                        <p className="text-xs text-green-700 mb-1">AMOUNT TO PAY:</p>
                        <p className="text-2xl font-bold text-green-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>

                      {}
                      <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                        <p className="text-xs font-semibold text-green-800 mb-2">
                          📱 Payment Methods:
                        </p>
                        <div className="space-y-1 text-xs text-green-700">
                          <p>
                            • UPI: Send to <strong>9994072395@paytm</strong>
                          </p>
                          <p>
                            • PhonePe / Google Pay: <strong>9994072395</strong>
                          </p>
                          <p>• Bank Transfer (Ask via WhatsApp)</p>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          💡 After payment, share screenshot on WhatsApp
                        </p>
                      </div>

                      {}
                      <a
                        href="https://wa.me/919994072395"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        💬 Open WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="flex gap-4">
            <Button onClick={() => navigate('/my-orders')} variant="primary" fullWidth>
              View My Orders
            </Button>
            <Button onClick={() => navigate('/products')} variant="outline" fullWidth>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
