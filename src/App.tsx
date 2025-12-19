import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ErrorBoundary } from '@/components/common';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ConfirmProvider } from '@/hooks/useConfirm';
import { PrivateRoute, PublicRoute } from '@/routes';
import { AdminRoute } from '@/routes/AdminRoute';
import { setTokenGetter } from '@/services/api';
import {
  Home,
  Login,
  Register,
  Profile,
  ProfileEdit,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  Products,
} from '@/pages';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import PaymentInstructions from '@/pages/PaymentInstructions';
import OrderConfirmation from '@/pages/orders/OrderConfirmation';
import MyOrders from '@/pages/orders/MyOrders';
import OrderDetails from '@/pages/orders/OrderDetails';
import {
  AdminDashboard,
  AdminUsers,
  AdminUserDetail,
  AdminTest,
  ProductManagement,
  ProductForm,
} from '@/pages/admin';
import { ApiTest } from '@/pages/admin/ApiTest';
import { ToastContainer } from 'react-toastify';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';

const AppContent: React.FC = () => {
  const { getToken } = useAuth();

  // Set token getter for API client
  React.useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ConfirmProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicRoute>
                        <ResetPassword />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/edit"
                    element={
                      <PrivateRoute>
                        <ProfileEdit />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/verify-email"
                    element={
                      <PrivateRoute>
                        <VerifyEmail />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/change-password"
                    element={
                      <PrivateRoute>
                        <ChangePassword />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payment-instructions"
                    element={
                      <PrivateRoute>
                        <PaymentInstructions />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <PrivateRoute>
                        <MyOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders/:orderId"
                    element={
                      <PrivateRoute>
                        <OrderDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders/:orderId/confirmation"
                    element={
                      <PrivateRoute>
                        <OrderConfirmation />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users/:id"
                    element={
                      <AdminRoute>
                        <AdminUserDetail />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/test"
                    element={
                      <AdminRoute>
                        <AdminTest />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/api-test"
                    element={
                      <AdminRoute>
                        <ApiTest />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <ProductManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/new"
                    element={
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick={true}
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable={true}
                  pauseOnHover={true}
                  theme="light"
                  limit={3}
                />
              </div>
            </Router>
          </ConfirmProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
};

export default App;
