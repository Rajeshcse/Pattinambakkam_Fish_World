import apiClient from './api';
import type {
  ProductListResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
} from '@/types';

export const getAllProducts = async (params?: ProductQueryParams): Promise<ProductListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.isAvailable !== undefined)
    queryParams.append('isAvailable', params.isAvailable.toString());
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<ProductListResponse>(url);
  return response.data;
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await apiClient.get<ProductResponse>(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (
  productData: CreateProductRequest,
): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>('/api/products', productData);
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductRequest,
): Promise<ProductResponse> => {
  const response = await apiClient.put<ProductResponse>(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/api/products/${id}`,
  );
  return response.data;
};

export const toggleProductAvailability = async (
  id: string,
  isAvailable: boolean,
): Promise<ProductResponse> => {
  const response = await apiClient.patch<ProductResponse>(`/api/products/${id}/availability`, {
    isAvailable,
  });
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
};

export default productService;
