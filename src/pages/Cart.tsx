import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, itemCount, totalAmount, updateQuantity, removeItem, clearCart, loading } =
    useCart();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        // Error handled by context
      }
    }
  };

  if (loading && !cart) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" text="Loading your cart..." />
        </div>
      </Layout>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {isEmpty
                ? 'Your cart is waiting to be filled!'
                : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items (Left Side) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end">
                  <Button onClick={handleClearCart} variant="outline" size="sm" disabled={loading}>
                    🗑️ Clear Cart
                  </Button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary (Right Side) */}
              <div className="lg:col-span-1">
                <CartSummary
                  itemCount={itemCount}
                  totalAmount={totalAmount}
                  onCheckout={handleCheckout}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
