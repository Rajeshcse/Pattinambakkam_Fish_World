import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, ProductCard, Loading, ConfirmDialog } from '@/components/common';
import { productService } from '@/services';
import type { FishProduct, ProductCategory, ProductQueryParams } from '@/types';

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
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

  const categories: ProductCategory[] = ['Fish', 'Prawn', 'Crab', 'Squid'];

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your fish products inventory</p>
            </div>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Product
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Products</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Available</div>
              <div className="text-2xl font-bold text-green-600">{stats.availableProducts}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Stock</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalStock} kg</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Avg Price</div>
              <div className="text-2xl font-bold text-purple-600">
                ₹{stats.averagePrice.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Availability Toggle */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => {
                      setShowAvailableOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show available only</span>
                </label>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loading fullScreen={false} text="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500 mb-4">Get started by adding a new product</p>
              <button
                onClick={() => navigate('/admin/products/new')}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
              >
                + Add New Product
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    showAdminActions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-md font-semibold ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
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
