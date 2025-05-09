# Role-Based Access Control System

This document describes the role-based access control system implemented in the application.

## Overview

The application supports two roles:
- `admin`: Users with administrative privileges who can access all features
- `user`: Regular users with limited access to features

The role information is stored in Supabase in dedicated `roles` and `user_roles` tables, and is retrieved when the user logs in. If the database query fails, the system falls back to using the user's `app_metadata`.

## Components

### AuthContext

The `AuthContext` provides role-related information and functionality:

```tsx
// Get the current user's role and role-checking functions
const { user, userRole, isAdmin, hasRole } = useAuth();

// Check if the user is an admin
if (isAdmin) {
  // Admin-only code
}

// Check if the user has a specific role
if (hasRole('admin')) {
  // Role-specific code
}
```

### RoleBasedRoute

The `RoleBasedRoute` component restricts access to routes based on user roles:

```tsx
// In App.tsx
<Route path="/admin-page" element={
  <RoleBasedRoute allowedRoles={['admin']} redirectTo="/">
    <AdminPage />
  </RoleBasedRoute>
} />
```

### RoleBasedContent

The `RoleBasedContent` component conditionally renders UI elements based on user roles:

```tsx
// Show content only to admins
<RoleBasedContent allowedRoles={['admin']}>
  <button>Admin-only Button</button>
</RoleBasedContent>

// Show different content based on role
<RoleBasedContent 
  allowedRoles={['admin']} 
  fallback={<p>You don't have permission to see this content.</p>}
>
  <AdminPanel />
</RoleBasedContent>
```

## Implementation Details

### How Roles Are Retrieved

Roles are primarily retrieved from the dedicated `roles` and `user_roles` tables in Supabase. The `extractUserRole` function in `AuthContext.tsx` queries these tables and implements caching for performance:

```tsx
const extractUserRole = async (user: User | null): Promise<string | null> => {
  if (!user) return null;

  // Check if we have a cached role for this user
  if (roleCache.has(user.uuid)) {
    return roleCache.get(user.uuid) || 'user';
  }

  try {
    // First, try to get the user's role from the user_roles table
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.uuid);

    if (userRolesError) {
      console.error('Error fetching user roles:', userRolesError);
      // Fall back to app_metadata if there's an error
      return fallbackToMetadata(user);
    }

    if (userRoles && userRoles.length > 0) {
      // Get the role name from the roles table
      const roleId = userRoles[0].role_id;
      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('name')
        .eq('id', roleId)
        .single();

      if (rolesError) {
        console.error('Error fetching role:', rolesError);
        // Fall back to app_metadata if there's an error
        return fallbackToMetadata(user);
      }

      if (roles) {
        // Cache the role for future use
        setRoleCache(prev => new Map(prev).set(user.uuid, roles.name));
        return roles.name;
      }
    }

    // If no role found in the tables, fall back to app_metadata
    return fallbackToMetadata(user);
  } catch (error) {
    console.error('Error in extractUserRole:', error);
    // Fall back to app_metadata if there's an exception
    return fallbackToMetadata(user);
  }
};
```

If the database query fails or no role is found, the system falls back to checking the user's `app_metadata`:

```tsx
const fallbackToMetadata = (user: User): string => {
  // Check app_metadata for role information
  if (user.app_metadata && typeof user.app_metadata === 'object') {
    if (user.app_metadata.role) return user.app_metadata.role;

    // Some Supabase configurations use 'roles' array
    if (Array.isArray(user.app_metadata.roles) && user.app_metadata.roles.length > 0) {
      return user.app_metadata.roles[0];
    }
  }

  // Default role if none found
  return 'user';
};
```

### Setting Up Roles in Supabase

The application uses dedicated tables for role management. To set up roles in Supabase:

#### 1. Create the `roles` table:

1. Go to the Supabase dashboard
2. Navigate to Table Editor
3. Create a new table named `roles` with the following columns:
   - `id` (int8, primary key)
   - `name` (varchar, not null, unique)
   - `created_at` (timestamptz, default: now())

4. Insert the default roles:
   ```sql
   INSERT INTO roles (name) VALUES ('admin');
   INSERT INTO roles (name) VALUES ('user');
   ```

#### 2. Create the `user_roles` table:

1. In the Table Editor, create a new table named `user_roles` with the following columns:
   - `id` (int8, primary key)
   - `user_id` (uuid, not null, references auth.users(id))
   - `role_id` (int8, not null, references roles(id))
   - `created_at` (timestamptz, default: now())

2. Add a unique constraint on the combination of `user_id` and `role_id` to prevent duplicate assignments.

#### 3. Assign roles to users:

1. To assign a role to a user, insert a record into the `user_roles` table:
   ```sql
   INSERT INTO user_roles (user_id, role_id)
   VALUES ('user-uuid-here', 1); -- 1 for admin, 2 for user
   ```

#### 4. Fallback method (optional):

If you prefer to use the app_metadata method as a fallback:

1. Navigate to Authentication > Users
2. Select a user
3. Under "Metadata", add or modify the `app_metadata` field:
   ```json
   {
     "role": "admin"
   }
   ```
4. Save the changes

## Best Practices

1. Always use `RoleBasedRoute` for routes that should be restricted to certain roles
2. Use `RoleBasedContent` for UI elements that should only be visible to certain roles
3. For complex permission checks, use the `hasRole` function from `useAuth()`
4. Consider implementing more granular permissions if needed (e.g., `canEdit`, `canDelete`)
