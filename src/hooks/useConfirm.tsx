/**
 * useConfirm Hook
 *
 * Provides a simple way to show confirmation dialogs throughout the app.
 * Replaces window.confirm() with a beautiful modal component.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { ConfirmDialog } from '@/components/common';

interface ConfirmOptions {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Variant of confirm button */
  variant?: 'primary' | 'danger' | 'warning';
}

interface ConfirmContextValue {
  /** Show confirmation dialog and wait for user response */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined
);

interface ConfirmProviderProps {
  children: ReactNode;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

/**
 * ConfirmProvider Component
 *
 * Wrap your app with this provider to enable useConfirm hook
 *
 * @example
 * ```tsx
 * <ConfirmProvider>
 *   <App />
 * </ConfirmProvider>
 * ```
 */
export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
}) => {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = async () => {
    if (!confirmState) return;

    setIsLoading(true);
    try {
      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 150));
      confirmState.resolve(true);
    } finally {
      setIsLoading(false);
      setConfirmState(null);
    }
  };

  const handleCancel = () => {
    if (!confirmState) return;
    confirmState.resolve(false);
    setConfirmState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState && (
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          isLoading={isLoading}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};

/**
 * useConfirm Hook
 *
 * Returns a confirm function to show confirmation dialogs
 *
 * @example
 * ```tsx
 * const { confirm } = useConfirm();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Delete User',
 *     message: 'Are you sure you want to delete this user?',
 *     confirmText: 'Delete',
 *     variant: 'danger'
 *   });
 *
 *   if (confirmed) {
 *     await deleteUser();
 *   }
 * };
 * ```
 */
export const useConfirm = (): ConfirmContextValue => {
  const context = useContext(ConfirmContext);

  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};
