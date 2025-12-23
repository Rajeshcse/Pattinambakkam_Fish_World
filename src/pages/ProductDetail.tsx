import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { productService } from '@/services';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import type { FishProduct } from '@/types';
import { formatQuantityToWeight, getStockStatus as formatStockStatus } from '@/utils/formatters';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useResponsiveToast();

  const [product, setProduct] = useState<FishProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id!);
      if (response.success) {
        setProduct(response.data);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await addItem(product._id, quantity);
    } catch (error) {}
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (product && newQuantity > product.stock) {
      setQuantity(product.stock);
      const weight = formatQuantityToWeight(product.stock);
      toast.warning(`Only ${weight} available`);
    } else {
      setQuantity(newQuantity);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fish: 'bg-blue-100 text-blue-800 border-blue-300',
      Prawn: 'bg-pink-100 text-pink-800 border-pink-300',
      Crab: 'bg-orange-100 text-orange-800 border-orange-300',
      Squid: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStockStatus = () => {
    if (!product) return { text: '', color: 'text-gray-600 bg-gray-50 border-gray-200' };

    const status = formatStockStatus(product.stock);
    // Add background and border colors for ProductDetail display
    let colorClasses = 'text-gray-600 bg-gray-50 border-gray-200';
    if (status.color.includes('red')) {
      colorClasses = 'text-red-600 bg-red-50 border-red-200';
    } else if (status.color.includes('orange')) {
      colorClasses = 'text-orange-600 bg-orange-50 border-orange-200';
    } else if (status.color.includes('green')) {
      colorClasses = 'text-green-600 bg-green-50 border-green-200';
    }

    return { text: status.text, color: colorClasses };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading product..." />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </Layout>
    );
  }

  const stockStatus = getStockStatus();
  const isAvailable = product.isAvailable && product.stock > 0;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="text-cyan-600 hover:text-cyan-700">
                  Home
                </button>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <button
                  onClick={() => navigate('/products')}
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  Products
                </button>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600">{product.name}</li>
            </ol>
          </nav>

          {}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-6 p-6">
              {}
              <div className="lg:col-span-2">
                {}
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] max-w-md mx-auto lg:max-w-none">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwMCwzMDApIj4KICAgIDxzdmcgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTNhM2EzIiBzdHJva2Utd2lkdGg9IjEiPgogICAgICA8cGF0aCBkPSJNMTIgNC41YzEuNSAwIDMuNS43IDQuNSAyLjUgMCAwLS41IDEuNS0yIDJsLS41LS41Yy0uNS0uNS0xLS41LTEuNSAwLS41LjUtLjUgMS0uNSAxLjVsMi41IDJzMS41IDAgMS41LTJjMC0yLjUtMi0yLjUtMy01LS41LTEuNS0yLTItMy0yLTIgMC00IDItNCA0IDAgMiAyIDQgNCA0czQtMiA0LTQtMi00LTQtNC0xIDAtMSAxIDEgMSAxIDFoMnptLTIgOC41Yy0uNSAwLTEtLjUtMS0xczEtMSAxLTFoNWMuNSAwIDEgLjUgMSAxcy0uNSAxLTEgMXptLTIgMmMtLjUgMC0xLS41LTEtMXMuNS0xIDEtMWgzYy41IDAgMSAuNSAxIDFzLS41IDEtMSAxeiIvPgogICAgPC9zdmc+CiAgPC9nPgo8L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-32 h-32 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Not Available</span>
                    </div>
                  )}
                </div>

                {}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-cyan-500 ring-2 ring-cyan-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {}
              <div className="lg:col-span-3 flex flex-col">
                {}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                      product.category,
                    )}`}
                  >
                    {product.category}
                  </span>
                </div>

                {}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>

                {}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-base text-gray-500">/250g</span>
                  </div>
                </div>

                {}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${stockStatus.color}`}
                  >
                    {stockStatus.text}
                  </span>
                </div>

                {}
                {product.description && (
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                  </div>
                )}

                {}
                {isAvailable && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg font-bold text-lg transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                        className="w-16 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg py-1 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-lg font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-500 ml-2">
                        {quantity} × 250g = {formatQuantityToWeight(quantity)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        (Max: {formatQuantityToWeight(product.stock)})
                      </span>
                    </div>
                  </div>
                )}

                {}
                {isAvailable && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm">Subtotal:</span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {}
                <div className="flex gap-3 mt-auto pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isAvailable || cartLoading}
                    loading={cartLoading}
                    variant="primary"
                    fullWidth
                    size="md"
                  >
                    🛒 Add to Cart
                  </Button>
                  <Button
                    onClick={() => navigate('/products')}
                    variant="outline"
                    size="md"
                    className="px-4"
                  >
                    ← Back
                  </Button>
                </div>

                {!isAuthenticated && isAvailable && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-cyan-600 hover:underline"
                    >
                      login
                    </button>{' '}
                    to add items to cart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
