import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Loading, Button } from '@/components/common';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirm';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, itemCount, totalAmount, updateQuantity, removeItem, clearCart, loading } =
    useCart();
  const { confirm } = useConfirm();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    const confirmed = await confirm({
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your cart?',
      confirmText: 'Clear',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
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
      <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          {}

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {}
              <div className="lg:col-span-2 space-y-4">
                {}
                <div className="flex justify-end">
                  <Button onClick={handleClearCart} variant="outline" size="sm" disabled={loading}>
                    🗑️ Clear Cart
                  </Button>
                </div>

                {}
                <div className="space-y-3 sm:space-y-4">
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
