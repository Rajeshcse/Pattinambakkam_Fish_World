

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  
  isOpen: boolean;
  
  onClose: () => void;
  
  onConfirm: () => void | Promise<void>;
  
  title: string;
  
  message: string;
  
  confirmText?: string;
  
  cancelText?: string;
  
  variant?: 'primary' | 'danger' | 'warning';
  
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="space-y-6">
        {}
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

        {}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading} size="md">
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} loading={isLoading} size="md">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
