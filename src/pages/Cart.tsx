import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Layout, Loading, Button } from '@/components/common';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { useCart } from '@/hooks/useCart';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { cart, itemCount, totalAmount, updateQuantity, removeItem, clearCart, loading } =
    useCart();

  // Check auth before rendering
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {}
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
          {}
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
              {}
              <div className="lg:col-span-2 space-y-4">
                {}
                <div className="flex justify-end">
                  <Button onClick={handleClearCart} variant="outline" size="sm" disabled={loading}>
                    🗑️ Clear Cart
                  </Button>
                </div>

                {}
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

              {}
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
