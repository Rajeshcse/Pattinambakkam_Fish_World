import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  productName: string;
}

/**
 * Breadcrumb Component
 *
 * Navigation breadcrumb: Home > Products > Product Name
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName }) => {
  const navigate = useNavigate();

  return (
    <nav className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <button onClick={() => navigate('/')} className="text-cyan-600 hover:text-cyan-700">
            Home
          </button>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <button onClick={() => navigate('/products')} className="text-cyan-600 hover:text-cyan-700">
            Products
          </button>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-600">{productName}</li>
      </ol>
    </nav>
  );
};
