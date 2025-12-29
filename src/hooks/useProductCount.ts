import { useState, useEffect } from 'react';
import { productService } from '@/services';

/**
 * useProductCount Hook
 *
 * Fetches total product count from API
 * Used for displaying product statistics in navbar
 */
export const useProductCount = () => {
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({
          page: 1,
          limit: 1,
          isAvailable: true,
        });

        if (response.success) {
          setProductCount(response.pagination.totalProducts);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching product count:', err);
        }
        setError('Failed to fetch product count');
      } finally {
        setLoading(false);
      }
    };

    fetchProductCount();
  }, []);

  return { productCount, loading, error };
};
