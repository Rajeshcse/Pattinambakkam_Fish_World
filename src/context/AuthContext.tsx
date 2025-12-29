import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

import { User, LoginRequest, RegisterRequest, AuthContextType } from '@/types';
import { authService } from '@/services';
import { tokenService } from '@/services/tokenService';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { getErrorMessage, logError } from '@/utils/errors';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useResponsiveToast();

  /**
   * Refresh access token using centralized token service
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      const newToken = await tokenService.refreshAccessToken();
      setToken(newToken);
    } catch (error: unknown) {
      logError(error, 'AuthContext.refreshAccessToken');
      authService.clearAuthData();
      setToken(null);
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Initialize authentication on app load
   * Checks stored tokens and refreshes if expired
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getAccessToken();
        const storedRefreshToken = authService.getRefreshToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
          // Check if token is expired using centralized token service
          if (tokenService.isTokenExpired(storedToken)) {
            if (storedRefreshToken) {
              try {
                // Use centralized token refresh
                const newToken = await tokenService.refreshAccessToken();
                setToken(newToken);
                setUser(storedUser);
              } catch (refreshError) {
                authService.clearAuthData();
                toast.error('Session expired. Please login again.');
              }
            } else {
              authService.clearAuthData();
              toast.error('Session expired. Please login again.');
            }
          } else {
            // Token is valid
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Auth initialization error:', error);
        }
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [toast]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await authService.login(credentials);

        if (response.success && response.accessToken && response.refreshToken && response.user) {
          authService.setAuthData(response.accessToken, response.refreshToken, response.user);
          setToken(response.accessToken);
          setUser(response.user);
          toast.success(response.message || 'Welcome back to Pattinambakkam_Fish_World!');
        }
      } catch (error: unknown) {
        logError(error, 'AuthContext.login');
        const errorMessage = getErrorMessage(error) || 'Login failed. Please try again.';
        toast.error(errorMessage, { autoClose: 5000 });
        throw new Error(errorMessage);
      }
    },
    [toast],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await authService.register(data);

        if (response.success && response.accessToken && response.refreshToken && response.user) {
          authService.setAuthData(response.accessToken, response.refreshToken, response.user);
          setToken(response.accessToken);
          setUser(response.user);
          toast.success(
            response.message || 'Welcome to Pattinambakkam_Fish_World! Please verify your email.',
          );
        } else {
          if (import.meta.env.DEV) {
            console.error('Unexpected response structure:', response);
          }
          throw new Error('Invalid response from server');
        }
      } catch (error: unknown) {
        logError(error, 'AuthContext.register');
        const errorMessage = getErrorMessage(error) || 'Registration failed. Please try again.';
        toast.error(errorMessage, { autoClose: 5000 });
        throw new Error(errorMessage);
      }
    },
    [toast],
  );

  const logout = useCallback(async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout API error:', error);
      }
    } finally {
      authService.clearAuthData();
      setToken(null);
      setUser(null);
      toast.info('Logged out successfully');
    }
  }, [toast]);

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
      toast.success('Logged out from all devices successfully');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout all API error:', error);
      }
      toast.error('Failed to logout from all devices');
    } finally {
      authService.clearAuthData();
      setToken(null);
      setUser(null);
    }
  }, [toast]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    logoutAll,
    updateUser,
    refreshAccessToken,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
