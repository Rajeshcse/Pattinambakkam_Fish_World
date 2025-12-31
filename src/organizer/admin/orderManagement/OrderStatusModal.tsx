import React from 'react';
import { StatusBadge, Button, Modal } from '@/components/common';
import type { Order, OrderStatus } from '@/types';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  newStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  onConfirm: () => void;
  loading: boolean;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  selectedOrder,
  newStatus,
  onStatusChange,
  onConfirm,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Order Status">
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
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
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
          <Button variant="primary" fullWidth onClick={onConfirm} loading={loading}>
            Update Status
          </Button>
          <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
