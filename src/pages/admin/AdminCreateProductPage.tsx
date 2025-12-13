import React from 'react';
import { CreateProductForm } from '@/components/CreateProductForm';

/**
 * Admin Product Creation Route
 *
 * This component handles the product creation form page
 * Integrated with the admin panel for product management
 *
 * Usage in router:
 * <Route path="/admin/products/create" element={<AdminCreateProductPage />} />
 */
export const AdminCreateProductPage: React.FC = () => {
  return <CreateProductForm />;
};

export default AdminCreateProductPage;
