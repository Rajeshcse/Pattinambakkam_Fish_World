import React from 'react';
import type { OrderStatus } from '@/types';

interface OrderStatusStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

const steps: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'pending', label: 'Pending', icon: '⏳' },
  { status: 'confirmed', label: 'Confirmed', icon: '✅' },
  { status: 'out-for-delivery', label: 'Out for Delivery', icon: '🚗' },
  { status: 'delivered', label: 'Delivered', icon: '✅' },
];

const getStepIndex = (status: OrderStatus): number => {
  if (status === 'cancelled') return -1;
  const index = steps.findIndex((step) => step.status === status);
  return index;
};

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({
  currentStatus,
  className = '',
}) => {
  const currentIndex = getStepIndex(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-red-700">
          <span className="text-2xl">❌</span>
          <span className="text-lg font-semibold">Order Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>

      {/* Desktop View - Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.status} className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white scale-110'
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Vertical Stepper */}
      <div className="block md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex items-center gap-4">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Checkmark */}
              {isCompleted && (
                <div className="text-green-500 text-xl">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
