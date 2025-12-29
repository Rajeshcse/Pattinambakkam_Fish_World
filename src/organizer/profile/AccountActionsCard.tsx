import React from 'react';
import { Button } from '@/components/common';

interface AccountActionsCardProps {
  isLoggingOut: boolean;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onLogoutAll: () => void;
}

/**
 * AccountActionsCard Component
 *
 * Action buttons: Edit Profile, Change Password, Logout, Logout All Devices
 */
export const AccountActionsCard: React.FC<AccountActionsCardProps> = ({
  isLoggingOut,
  onEditProfile,
  onChangePassword,
  onLogout,
  onLogoutAll,
}) => {
  return (
    <div className="space-y-4 pt-4">
      {/* Primary Actions */}
      <div className="flex gap-4">
        <Button variant="primary" size="md" fullWidth onClick={onEditProfile}>
          Edit Profile
        </Button>
        <Button variant="secondary" size="md" fullWidth onClick={onChangePassword}>
          Change Password
        </Button>
      </div>

      {/* Logout Actions */}
      <div className="flex gap-4">
        <Button variant="outline" size="md" fullWidth onClick={onLogout} loading={isLoggingOut}>
          Logout
        </Button>
        <Button variant="danger" size="md" fullWidth onClick={onLogoutAll} loading={isLoggingOut}>
          Logout All Devices
        </Button>
      </div>
    </div>
  );
};
