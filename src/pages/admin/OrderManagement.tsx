import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Layout, Loading, StatusBadge, Button, Modal } from '@/components/common';
import { adminService } from '@/services';
import type { Order, OrderStatus } from '@/types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const response = await adminService.updateOrderStatus(selectedOrder.orderId, newStatus);

      toast.success(`Order status updated to ${newStatus}`);
      setIsModalOpen(false);

      // Send WhatsApp notification if available
      if (response.whatsapp && response.whatsapp.phone) {
        const { phone, message } = response.whatsapp;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;

        // Show notification about WhatsApp
        toast.info('Opening WhatsApp to notify customer...', { autoClose: 2000 });

        // Open WhatsApp in new tab after short delay
        setTimeout(() => {
          window.open(whatsappURL, '_blank');
        }, 500);
      }

      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user &&
        typeof order.user === 'object' &&
        order.user.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading orders..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>
                <input
                  type="text"
                  placeholder="Search by Order ID or Customer Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Orders</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.orderId}</h3>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Customer:</span>{' '}
                          {order.user && typeof order.user === 'object' ? order.user.name : 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Items:</span> {order.items.length}
                        </p>
                        <p>
                          <span className="font-medium">Amount:</span> ₹
                          {order.totalAmount.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Delivery:</span>{' '}
                          {new Date(order.deliveryDetails.deliveryDate).toLocaleDateString('en-IN')}{' '}
                          {order.deliveryDetails.deliveryTime}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button variant="primary" size="sm" onClick={() => handleStatusUpdate(order)}>
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Order Status">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID: {selectedOrder?.orderId}
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Current Status: <StatusBadge status={selectedOrder?.status || 'pending'} />
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" fullWidth onClick={confirmStatusUpdate} loading={updating}>
              Update Status
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsModalOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
