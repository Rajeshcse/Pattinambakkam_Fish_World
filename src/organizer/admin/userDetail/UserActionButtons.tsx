import React from 'react';
import { Button } from '@/components/common';

interface UserActionButtonsProps {
  isCurrentUser: boolean;
  userRole: 'user' | 'admin';
  isVerified: boolean;
  onEditClick: () => void;
  onChangeRole: () => void;
  onToggleVerification: () => void;
  onDelete: () => void;
}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  isCurrentUser,
  userRole,
  isVerified,
  onEditClick,
  onChangeRole,
  onToggleVerification,
  onDelete,
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-4">
        <Button variant="primary" size="md" fullWidth onClick={onEditClick}>
          Edit User
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={onChangeRole}
          disabled={isCurrentUser}
        >
          {userRole === 'admin' ? 'Demote to User' : 'Promote to Admin'}
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="md" fullWidth onClick={onToggleVerification}>
          {isVerified ? 'Unverify Email' : 'Verify Email'}
        </Button>
        <Button variant="danger" size="md" fullWidth onClick={onDelete} disabled={isCurrentUser}>
          Delete User
        </Button>
      </div>
    </div>
  );
};
