import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
// jwt-decode is avoided here to keep decoding lightweight and avoid import shape issues
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthContextType,
  DecodedToken,
} from '@/types';
import { authService } from '@/services';
import { toast } from 'react-toastify';

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Check if token is expired
   */
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      // base64url -> base64
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as DecodedToken;
    } catch (error) {
      return null;
    }
  };

  const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  /**
   * Refresh access token
   */
  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = authService.getRefreshToken();
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(storedRefreshToken);
      if (response.success && response.accessToken) {
        authService.setAccessToken(response.accessToken);
        setToken(response.accessToken);
      }
    } catch (error: any) {
      authService.clearAuthData();
      setToken(null);
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getAccessToken();
        const storedRefreshToken = authService.getRefreshToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
          // Check if access token is expired
          if (isTokenExpired(storedToken)) {
            // Try to refresh the token if we have a refresh token
            if (storedRefreshToken) {
              try {
                const response = await authService.refreshToken(storedRefreshToken);
                if (response.success && response.accessToken) {
                  authService.setAccessToken(response.accessToken);
                  setToken(response.accessToken);
                  setUser(storedUser);
                } else {
                  throw new Error('Token refresh failed');
                }
              } catch (refreshError) {
                authService.clearAuthData();
                toast.error('Session expired. Please login again.');
              }
            } else {
              authService.clearAuthData();
              toast.error('Session expired. Please login again.');
            }
          } else {
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.accessToken && response.refreshToken && response.user) {
        authService.setAuthData(response.accessToken, response.refreshToken, response.user);
        setToken(response.accessToken);
        setUser(response.user);
        toast.success(response.message || 'Welcome back to Kidzo!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage, { autoClose: 5000 });
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      if (response.success && response.accessToken && response.refreshToken && response.user) {
        authService.setAuthData(response.accessToken, response.refreshToken, response.user);
        setToken(response.accessToken);
        setUser(response.user);
        toast.success(response.message || 'Welcome to Kidzo! Please verify your email.');
      } else {
        // Handle case where response structure is unexpected
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, { autoClose: 5000 });
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Logout user from current device
   */
  const logout = useCallback(async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      authService.clearAuthData();
      setToken(null);
      setUser(null);
      toast.info('Logged out successfully');
    }
  }, []);

  /**
   * Logout user from all devices
   */
  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
      toast.success('Logged out from all devices successfully');
    } catch (error) {
      console.error('Logout all API error:', error);
      toast.error('Failed to logout from all devices');
    } finally {
      authService.clearAuthData();
      setToken(null);
      setUser(null);
    }
  }, []);

  /**
   * Update user data (after profile update)
   */
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
