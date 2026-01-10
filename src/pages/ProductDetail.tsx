import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout, Loading, Button, ShareButton } from '@/components/common';
import { productService } from '@/services';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import {
  Breadcrumb,
  ProductImageGallery,
  ProductInfo,
  ProductDescription,
  AddToCartSection,
} from '@/organizer/productDetail';
import type { FishProduct } from '@/types';
import { formatQuantityToWeight, getStockStatus as formatStockStatus } from '@/utils/formatters';

/**
 * ProductDetail Page
 *
 * Displays detailed product information with image gallery
 * Handles quantity selection and add to cart functionality
 */
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
    if (!product) return;

    try {
      // Pass the full product object to addItem - no need to fetch later
      await addItem(product, quantity);
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

  const getStockStatus = () => {
    if (!product) return { text: '', color: 'text-gray-600 bg-gray-50 border-gray-200' };

    const status = formatStockStatus(product.stock);
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

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading product..." />
        </div>
      </Layout>
    );
  }

  // Product not found
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

  // Prepare meta tags for social sharing
  const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
  const productUrl = `${window.location.origin}/products/${product._id}`;
  const productDescription = product.description || `Fresh ${product.name} - Order now from Pattinambakkam Fish World`;

  return (
    <Layout>
      <Helmet>
        <title>{product.name} - Pattinambakkam Fish World</title>
        <meta name="description" content={productDescription} />

        {/* Open Graph tags for Facebook and WhatsApp */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} - Pattinambakkam Fish World`} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:site_name" content="Pattinambakkam Fish World" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="INR" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Pattinambakkam Fish World`} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={productImage} />
      </Helmet>

      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumb productName={product.name} />

          {/* Product Detail Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-6 p-6">
              {/* Image Gallery */}
              <ProductImageGallery
                images={product.images || []}
                productName={product.name}
                isAvailable={product.isAvailable}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />

              {/* Product Details */}
              <div className="lg:col-span-3 flex flex-col">
                {/* Product Info */}
                <ProductInfo
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  stockStatus={stockStatus}
                />

                {/* Description */}
                <ProductDescription description={product.description} />

                {/* Share Button */}
                <div className="mb-6">
                  <ShareButton product={product} />
                </div>

                {/* Add to Cart Section */}
                <AddToCartSection
                  isAvailable={isAvailable}
                  isAuthenticated={isAuthenticated}
                  quantity={quantity}
                  maxStock={product.stock}
                  price={product.price}
                  cartLoading={cartLoading}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
