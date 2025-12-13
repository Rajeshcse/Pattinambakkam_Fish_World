import React from 'react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onClose,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div className='p-4 bg-red-50 border border-red-300 rounded-lg'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-red-700 font-medium'>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className='text-red-500 hover:text-red-700 text-sm font-bold'
            aria-label='Close error message'
          >
            ×
          </button>
        )}
        {onDismiss && !onClose && (
          <button
            onClick={onDismiss}
            className='text-red-500 hover:text-red-700 text-sm font-bold'
            aria-label='Dismiss error message'
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
