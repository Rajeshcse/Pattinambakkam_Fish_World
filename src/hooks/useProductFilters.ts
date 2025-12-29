import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services';
import { useResponsiveToast } from './useResponsiveToast';
import type { FishProduct, ProductCategory, ProductQueryParams } from '@/types';

interface ProductPagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

/**
 * useProductFilters Hook
 *
 * Manages product filtering, search, pagination state
 * Handles URL params for category filtering
 * Centralizes complex product fetching logic
 *
 * Benefits:
 * - Extracts 200+ lines of logic from Products.tsx
 * - Reusable across different product list views
 * - Easier to test in isolation
 * - Clear separation of concerns
 */
export const useProductFilters = () => {
  const [searchParams] = useSearchParams();
  const toast = useResponsiveToast();

  // State
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [pagination, setPagination] = useState<ProductPagination>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  /**
   * Fetch products with current filters
   */
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setProducts([]);

        const params: ProductQueryParams = {
          page,
          limit: 12,
          isAvailable: showAvailableOnly,
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (searchQuery.trim()) {
          params.search = searchQuery.trim().toLowerCase();
        }

        const response = await productService.getAllProducts(params);

        if (response.success) {
          setProducts(response.data);
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            totalProducts: response.pagination.totalProducts,
          });
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchQuery, showAvailableOnly, toast],
  );

  /**
   * Handle category filter change
   */
  const handleCategoryChange = useCallback((category: ProductCategory | '') => {
    setSelectedCategory(category);
    setSearchQuery('');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle search query change
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle availability toggle
   */
  const handleAvailabilityToggle = useCallback(() => {
    setShowAvailableOnly((prev) => !prev);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setSelectedCategory('');
    setSearchQuery('');
    setShowAvailableOnly(true);
    setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  }, []);

  /**
   * Initialize from URL params
   */
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    let categoryToUse: ProductCategory | '' = '';

    if (categoryParam && ['Fish', 'Prawn', 'Crab', 'Squid'].includes(categoryParam)) {
      categoryToUse = categoryParam as ProductCategory;
      setSelectedCategory(categoryToUse);
      setSearchQuery('');
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [searchParams]);

  /**
   * Fetch products when filters change
   */
  useEffect(() => {
    fetchProducts(pagination.currentPage);
  }, [fetchProducts, pagination.currentPage]);

  return {
    // State
    products,
    loading,
    selectedCategory,
    searchQuery,
    showAvailableOnly,
    pagination,

    // Actions
    handleCategoryChange,
    handleSearchChange,
    handleAvailabilityToggle,
    handlePageChange,
    resetFilters,
    refetch: fetchProducts,
  };
};
