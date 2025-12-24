

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ConfirmDialog } from '@/components/common';

interface ConfirmOptions {
  
  title: string;
  
  message: string;
  
  confirmText?: string;
  
  cancelText?: string;
  
  variant?: 'primary' | 'danger' | 'warning';
}

interface ConfirmContextValue {
  
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

interface ConfirmProviderProps {
  children: ReactNode;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
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

export const useConfirm = (): ConfirmContextValue => {
  const context = useContext(ConfirmContext);

  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};
