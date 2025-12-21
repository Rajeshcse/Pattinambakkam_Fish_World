import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, ProductCard } from '@/components/common';
import { productService } from '@/services';
import type { FishProduct, ProductCategory, ProductQueryParams } from '@/types';

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

  // Get category from URL query parameter on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && ['Fish', 'Prawn', 'Crab', 'Squid'].includes(categoryParam)) {
      setSelectedCategory(categoryParam as ProductCategory);
    }
  }, [searchParams]);

  const categories: { name: ProductCategory; emoji: string; color: string }[] = [
    { name: 'Fish', emoji: '🐟', color: 'from-blue-500 to-cyan-500' },
    { name: 'Prawn', emoji: '🦐', color: 'from-pink-500 to-rose-500' },
    { name: 'Crab', emoji: '🦀', color: 'from-orange-500 to-red-500' },
    { name: 'Squid', emoji: '🦑', color: 'from-purple-500 to-indigo-500' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: ProductQueryParams = {
        page: currentPage,
        limit: 12,
        isAvailable: showAvailableOnly,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await productService.getAllProducts(params);

      if (response.success) {
        setProducts(response.data);
        setTotalProducts(response.pagination.totalProducts);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {}
      <div className="bg-gradient-to-b from-cyan-50 via-slate-50 to-white min-h-screen pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {}
          <div className="bg-white rounded-2xl shadow-lg shadow-cyan-500/10 border border-slate-100 p-4 sm:p-5 mb-6">
            {}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              {}
              <form onSubmit={handleSearch} className="flex-1 sm:max-w-md sm:ml-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      🔍
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 placeholder-slate-400 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === ''
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🌊 All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat.name
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}

              {}
              <div className="flex-1" />

              {}
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
                    showAvailableOnly ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => {
                      setShowAvailableOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      showAvailableOnly ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">In Stock</span>
              </label>
            </div>
          </div>

          {}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 animate-pulse">
                  <div className="text-6xl">🐟</div>
                </div>
                <p className="text-slate-500 font-medium">Loading fresh catches...</p>
              </div>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
                <span className="text-4xl">🐠</span>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No fish found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchQuery
                  ? "We couldn't find any matches. Try different keywords!"
                  : 'Our nets are empty right now. Check back soon!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    fetchProducts();
                  }}
                  className="mt-4 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
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
                            className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-2 text-slate-400">
                            •••
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 shadow-sm border border-slate-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
