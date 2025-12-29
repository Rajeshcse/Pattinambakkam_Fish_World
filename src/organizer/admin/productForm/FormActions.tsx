import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  loading: boolean;
  uploading: boolean;
}

/**
 * FormActions Component
 *
 * Submit and Cancel buttons for product form
 */
export const FormActions: React.FC<FormActionsProps> = ({
  isEditMode,
  isSubmitting,
  loading,
  uploading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 pt-6 border-t">
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting || loading || uploading}
        disabled={uploading}
        fullWidth
      >
        {uploading ? 'Uploading images...' : isEditMode ? 'Update Product' : 'Create Product'}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => navigate('/admin/products')}
        disabled={isSubmitting || loading || uploading}
      >
        Cancel
      </Button>
    </div>
  );
};
