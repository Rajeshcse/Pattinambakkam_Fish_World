import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { Layout, Loading, ConfirmDialog } from '@/components/common';
import { productService } from '@/services';
import {
  ProductManagementHeader,
  ProductStatsCards,
  ProductFilters,
  ProductsGrid,
  PaginationControls,
} from '@/organizer/admin/productManagement';
import type { FishProduct, ProductCategory, ProductQueryParams } from '@/types';

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const toast = useResponsiveToast();
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    totalStock: 0,
    averagePrice: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    product: FishProduct | null;
  }>({
    show: false,
    product: null,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: ProductQueryParams = {
        page: currentPage,
        limit: 12,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (showAvailableOnly) {
        params.isAvailable = true;
      }

      const response = await productService.getAllProducts(params);

      if (response.success) {
        setProducts(response.data);
        setStats(response.stats);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, showAvailableOnly]);

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

  const handleEdit = (product: FishProduct) => {
    navigate(`/admin/products/edit/${product._id}`, { state: { product } });
  };

  const handleDelete = (product: FishProduct) => {
    setDeleteConfirm({ show: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.product) return;

    try {
      await productService.deleteProduct(deleteConfirm.product._id);
      toast.success('Product deleted successfully');
      setDeleteConfirm({ show: false, product: null });
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleToggleAvailability = async (product: FishProduct) => {
    try {
      await productService.toggleProductAvailability(product._id, !product.isAvailable);
      toast.success(`Product ${!product.isAvailable ? 'shown' : 'hidden'} successfully`);
      fetchProducts();
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <ProductManagementHeader />

          {/* Stats Cards */}
          <ProductStatsCards stats={stats} />

          {/* Filters */}
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            showAvailableOnly={showAvailableOnly}
            onShowAvailableOnlyChange={handleAvailabilityToggle}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Products Grid */}
          {loading ? (
            <Loading fullScreen={false} text="Loading products..." />
          ) : (
            <>
              <ProductsGrid
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailability={handleToggleAvailability}
              />

              {/* Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.show}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteConfirm.product?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeleteConfirm({ show: false, product: null })}
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default ProductManagement;
