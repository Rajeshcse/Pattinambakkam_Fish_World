import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductManagementHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
          Product Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">Manage your fish products inventory</p>
      </div>
      <button
        onClick={() => navigate('/admin/products/new')}
        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Product
      </button>
    </div>
  );
};
