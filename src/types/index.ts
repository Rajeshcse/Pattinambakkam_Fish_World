export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  avatar?: string;
  address?: Address;
  createdAt: string;
  updatedAt?: string;
}

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
  address?: Address;
}

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
  method: 'email' | 'phone';
  success: boolean;
  message: string;
  expiresIn?: string;
}

export interface VerifyEmailRequest {
  otp: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

export type ApiResponse<T = any> = T | ErrorResponse | ValidationErrorResponse;

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

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

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

export type ProductCategory = 'Fish' | 'Prawn' | 'Crab' | 'Squid';

export interface FishProduct {
  _id: string;
  name: string;
  category: ProductCategory;
  price: number; // Price per 500g unit
  stock: number; // Stock in 500g units (e.g., 50 units = 25kg)
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
  price: number; // Price per 500g unit
  stock: number; // Stock in 500g units
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
  data: FishProduct;
}

export interface CartItem {
  _id: string;
  product: FishProduct;
  quantity: number; // Quantity in 500g units (e.g., 2 = 1kg)
  addedAt: string;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface CartCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export type OrderStatus = 'pending' | 'confirmed' | 'out-for-delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid';
export type DeliveryTimeSlot = '8:00 AM - 12:00 PM' | '12:00 PM - 4:00 PM' | '4:00 PM - 8:00 PM';

export interface OrderItem {
  product: string | FishProduct;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface DeliveryDetails {
  address: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: DeliveryTimeSlot;
}

export interface Order {
  _id: string;
  orderId: string;
  user: string | User;
  items: OrderItem[];
  totalAmount: number;
  deliveryDetails: DeliveryDetails;
  orderNotes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  payment?: {
    method?: string;
    status?: string;
    transactionId?: string;
    razorpayTransactionId?: string;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  deliveryDetails: DeliveryDetails;
  orderNotes?: string;
  paymentMethod?: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrderListResponse {
  success: boolean;
  data: Order[];
  message?: string;
}

export interface OrderStatsResponse {
  success: boolean;
  data: {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalSpent: number;
  };
}

export interface DeliveryTimeValidation {
  valid: boolean;
  message: string;
  minimumTime?: Date;
}

export interface TimeSlot {
  slot: DeliveryTimeSlot;
  available: boolean;
  reason: string;
}

export interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}
