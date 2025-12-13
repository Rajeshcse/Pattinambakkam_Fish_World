import React from 'react';
import { CreateProductForm } from '@/components/CreateProductForm';
import { Layout } from '@/components/common/Layout';

/**
 * Example page for using the CreateProductForm component
 */
const AdminProductPage: React.FC = () => {
  return (
    <Layout>
      <CreateProductForm />
    </Layout>
  );
};

export default AdminProductPage;
