/**
 * ConfirmDialog Component
 *
 * A confirmation dialog for destructive or important actions.
 * Uses the Modal component for consistent UI.
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when user confirms */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Variant of confirm button (danger for destructive actions) */
  variant?: 'primary' | 'danger' | 'warning';
  /** Whether confirm action is loading */
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
        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="md"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={isLoading}
            size="md"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
