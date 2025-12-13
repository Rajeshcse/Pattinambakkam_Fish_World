// User types based on Swagger schema
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified?: boolean; // Email verified (legacy)
  isPhoneVerified?: boolean; // Phone verified (legacy)
  emailVerified?: boolean; // Email verified
  phoneVerified?: boolean; // Phone verified
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

// Request types
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Response types
export interface AuthSuccessResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  expiresIn?: string;
}

// Email Verification types
export interface VerifyEmailRequest {
  otp: string;
}

// Password Management types
export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  phone?: string;
  resetCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileSuccessResponse {
  success: boolean;
  user: User;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ValidationError {
  type?: string;
  value?: string;
  msg: string;
  path: string;
  location?: string;
}

export interface ValidationErrorResponse {
  success: boolean;
  message: string;
  errors: ValidationError[];
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

// API Response union type
export type ApiResponse<T = any> = T | ErrorResponse | ValidationErrorResponse;

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshAccessToken: () => Promise<void>;
  isAuthenticated: boolean;
}

// Decoded JWT token
export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Admin Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  totalAdmins: number;
  recentUsers: User[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

// Admin User Management Types
export interface UserListQueryParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  search?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationMeta;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface ChangeUserRoleRequest {
  role: 'user' | 'admin';
}

export interface ToggleVerificationRequest {
  isVerified: boolean;
}

export interface BulkActionRequest {
  action: 'delete' | 'verify' | 'unverify';
  userIds: string[];
}

// Product types
export type ProductCategory =
  | 'Fish'
  | 'Prawn'
  | 'Crab'
  | 'Squid'
  | 'Lobsters'
  | 'Seafood Combo'
  | 'Dry Fish';

export interface FishProduct {
  _id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  images: string[];
  createdBy: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description?: string;
  images?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  category?: ProductCategory;
  price?: number;
  stock?: number;
  description?: string;
  images?: string[];
  isAvailable?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductStats {
  totalProducts: number;
  availableProducts: number;
  totalStock: number;
  averagePrice: number;
}

export interface ProductPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductListResponse {
  success: boolean;
  data: FishProduct[];
  pagination: ProductPaginationMeta;
  stats: ProductStats;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: FishProduct;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  via?: 'email' | 'phone';
}
