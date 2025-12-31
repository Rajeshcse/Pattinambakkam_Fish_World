import React from 'react';
import { Button } from '@/components/common';

interface UserEditFormProps {
  editForm: {
    name: string;
    email: string;
    phone: string;
  };
  onFormChange: (form: { name: string; email: string; phone: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  originalUser: {
    name: string;
    email: string;
    phone: string;
  };
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  editForm,
  onFormChange,
  onSubmit,
  onCancel,
  originalUser,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={editForm.email}
          onChange={(e) => onFormChange({ ...editForm, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          value={editForm.phone}
          onChange={(e) => onFormChange({ ...editForm, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" fullWidth>
          Save Changes
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
