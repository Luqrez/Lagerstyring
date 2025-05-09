import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * A component that renders its children only if the current user has one of the allowed roles.
 * Otherwise, it redirects to the specified path or renders nothing.
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  console.log('RoleBasedRoute.tsx: Rendering RoleBasedRoute component with allowedRoles:', allowedRoles);

  const { user, userRole } = useAuth();
  console.log('RoleBasedRoute.tsx: user:', user, 'userRole:', userRole);

  // If there's no user, redirect to login
  if (!user) {
    console.log('RoleBasedRoute.tsx: No user, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // If the user's role is in the allowed roles, render the children
  if (userRole && allowedRoles.includes(userRole)) {
    console.log('RoleBasedRoute.tsx: User has allowed role, rendering children');
    return <>{children}</>;
  }

  // If the user's role is not allowed, redirect to the specified path
  console.log('RoleBasedRoute.tsx: User does not have allowed role, redirecting to', redirectTo);
  return <Navigate to={redirectTo} replace />;
};

export default RoleBasedRoute;
