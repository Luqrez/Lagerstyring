import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedContentProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

/**
 * A component that renders its children only if the current user has one of the allowed roles.
 * Otherwise, it renders the fallback content or nothing.
 */
const RoleBasedContent: React.FC<RoleBasedContentProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  console.log('RoleBasedContent.tsx: Rendering RoleBasedContent component with allowedRoles:', allowedRoles);

  const { user, userRole } = useAuth();
  console.log('RoleBasedContent.tsx: user:', user, 'userRole:', userRole);

  // If there's no user or the user's role is not allowed, render the fallback
  if (!user || !userRole || !allowedRoles.includes(userRole)) {
    console.log('RoleBasedContent.tsx: User does not have allowed role, rendering fallback');
    return <>{fallback}</>;
  }

  // If the user's role is allowed, render the children
  console.log('RoleBasedContent.tsx: User has allowed role, rendering children');
  return <>{children}</>;
};

export default RoleBasedContent;
