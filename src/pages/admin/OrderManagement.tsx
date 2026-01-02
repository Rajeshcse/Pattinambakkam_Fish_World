import React, { useState, useEffect } from 'react';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Layout, Loading } from '@/components/common';
import { adminService } from '@/services';
import {
  OrderManagementHeader,
  OrderFilters,
  OrdersList,
  OrderStatusModal,
} from '@/organizer/admin/orderManagement';
import type { Order, OrderStatus } from '@/types';

export const OrderManagement: React.FC = () => {
  const toast = useResponsiveToast();
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
          <OrderManagementHeader />

          {/* Filters */}
          <OrderFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />

          {/* Orders List */}
          <OrdersList orders={filteredOrders} onStatusUpdate={handleStatusUpdate} />
        </div>
      </div>

      {/* Status Update Modal */}
      <OrderStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedOrder={selectedOrder}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        onConfirm={confirmStatusUpdate}
        loading={updating}
      />
    </Layout>
  );
};
