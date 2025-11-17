import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PrivateRoute, PublicRoute } from '@/routes';
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
} from '@/pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
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

            {/* Protected Routes */}
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

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
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
    </AuthProvider>
  );
};

export default App;
