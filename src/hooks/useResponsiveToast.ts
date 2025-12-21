import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const useResponsiveToast = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const showToast = {
    success: (message: string, options?: any) => {
      if (!isMobile) {
        toast.success(message, options);
      }
    },
    error: (message: string, options?: any) => {
      if (!isMobile) {
        toast.error(message, options);
      }
    },
    info: (message: string, options?: any) => {
      if (!isMobile) {
        toast.info(message, options);
      }
    },
    warning: (message: string, options?: any) => {
      if (!isMobile) {
        toast.warning(message, options);
      }
    },
  };

  return showToast;
};
