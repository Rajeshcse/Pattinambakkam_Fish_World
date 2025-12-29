import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/common';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { productService } from '@/services';
import {
  ProductGrid,
  ProductSearchBar,
  ProductFilters,
  PaginationControls,
} from '@/organizer/products';
import type { FishProduct, ProductCategory, ProductQueryParams } from '@/types';

/**
 * Products Page
 *
 * Displays all products with search, filtering, and pagination
 * Supports URL-based category filtering
 */
const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const toast = useResponsiveToast();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get category from URL and fetch products
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    let categoryToUse: ProductCategory | '' = '';

    if (categoryParam && ['Fish', 'Prawn', 'Crab', 'Squid'].includes(categoryParam)) {
      categoryToUse = categoryParam as ProductCategory;
      setSelectedCategory(categoryToUse);
      setSearchQuery('');
      setCurrentPage(1);
    } else {
      setSelectedCategory('');
    }

    fetchProductsByCategory(categoryToUse);
  }, [searchParams, showAvailableOnly]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, showAvailableOnly, searchQuery]);

  const fetchProductsByCategory = async (category: ProductCategory | '') => {
    try {
      setLoading(true);
      setProducts([]);
      const params: ProductQueryParams = {
        page: 1,
        limit: 12,
        isAvailable: showAvailableOnly,
      };

      if (category) {
        params.category = category;
      }

      const response = await productService.getAllProducts(params);

      if (response.success) {
        setProducts(response.data);
        setTotalProducts(response.pagination.totalProducts);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setProducts([]);
      const params: ProductQueryParams = {
        page: currentPage,
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
        setTotalProducts(response.pagination.totalProducts);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (category: ProductCategory | '') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleAvailabilityToggle = (checked: boolean) => {
    setShowAvailableOnly(checked);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
    fetchProducts();
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 via-slate-50 to-white min-h-screen pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search and Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-cyan-500/10 border border-slate-100 p-4 sm:p-5 mb-6">
            {/* Search Bar */}
            <ProductSearchBar
              searchQuery={searchQuery}
              totalProducts={totalProducts}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearch}
            />

            {/* Category Filters */}
            <ProductFilters
              selectedCategory={selectedCategory}
              showAvailableOnly={showAvailableOnly}
              onCategoryChange={handleCategoryChange}
              onAvailabilityToggle={handleAvailabilityToggle}
            />
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
          />

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Products;
