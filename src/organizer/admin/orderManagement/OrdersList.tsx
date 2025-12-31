import React from 'react';
import { StatusBadge, Button } from '@/components/common';
import type { Order } from '@/types';

interface OrdersListProps {
  orders: Order[];
  onStatusUpdate: (order: Order) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onStatusUpdate }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
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
                  <span className="font-medium">Amount:</span> ₹{order.totalAmount.toFixed(2)}
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
              <Button variant="primary" size="sm" onClick={() => onStatusUpdate(order)}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
