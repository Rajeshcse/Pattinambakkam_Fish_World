import { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  isEssential?: boolean;
  [key: string]: any;
}

export const useResponsiveToast = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  // Essential toast messages that should show on desktop
  const essentialMessages = useMemo(
    () => ['login', 'register', 'add to cart', 'added to cart'],
    [],
  );

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint is 768px in Tailwind
    };

    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  const isEssentialToast = useCallback(
    (message: string): boolean => {
      const lowerMessage = message.toLowerCase();
      return essentialMessages.some((essential) => lowerMessage.includes(essential));
    },
    [essentialMessages],
  );

  const showToast = useMemo(
    () => ({
      success: (message: string, options?: ToastOptions) => {
        // On desktop, only show essential toasts; on mobile, show all
        if (isDesktop ? isEssentialToast(message) : true) {
          toast.success(message, options);
        }
      },
      error: (message: string, options?: ToastOptions) => {
        // On desktop, only show essential error toasts; on mobile, show all
        if (isDesktop ? isEssentialToast(message) : true) {
          toast.error(message, options);
        }
      },
      info: (message: string, options?: ToastOptions) => {
        // On desktop, only show essential info toasts; on mobile, show all
        if (isDesktop ? isEssentialToast(message) : true) {
          toast.info(message, options);
        }
      },
      warning: (message: string, options?: ToastOptions) => {
        // On desktop, only show essential warning toasts; on mobile, show all
        if (isDesktop ? isEssentialToast(message) : true) {
          toast.warning(message, options);
        }
      },
    }),
    [isDesktop, isEssentialToast],
  );

  return showToast;
};
