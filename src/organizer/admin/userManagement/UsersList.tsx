import React from 'react';
import { Card } from '@/components/common';
import { UsersTable } from './UsersTable';
import { UsersMobileCards } from './UsersMobileCards';
import { User } from '@/types';

interface UsersListProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  loading: boolean;
}

export const UsersList: React.FC<UsersListProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  loading,
}) => {
  return (
    <Card>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">
          {loading ? 'Loading users...' : 'No users found'}
        </p>
      ) : (
        <>
          <UsersTable
            users={users}
            selectedUsers={selectedUsers}
            onSelectUser={onSelectUser}
            onSelectAll={onSelectAll}
            loading={loading}
          />
          <UsersMobileCards
            users={users}
            selectedUsers={selectedUsers}
            onSelectUser={onSelectUser}
            loading={loading}
          />
        </>
      )}
    </Card>
  );
};
