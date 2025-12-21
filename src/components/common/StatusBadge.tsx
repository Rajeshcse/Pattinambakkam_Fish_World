import React from 'react';
import type { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    icon: '⏳',
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: '✅',
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    icon: '🚗',
  },
  delivered: {
    label: 'Delivered',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: '❌',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
