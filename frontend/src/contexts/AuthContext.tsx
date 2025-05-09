import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Interface for role data from the roles table
interface Role {
  id: number;
  name: string;
}

// Interface for user-role assignment from the user_roles table
interface UserRole {
  id: number;
  user_id: string;
  role_id: number;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthContext.tsx: Rendering AuthProvider component');

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleCache, setRoleCache] = useState<Map<string, string>>(new Map());

  // Helper function to extract role from user
  const extractUserRole = async (user: User | null): Promise<string | null> => {
    if (!user) return null;

    console.log('Extracting role for user:', user.id);

    // Check if we have a cached role for this user
    if (roleCache.has(user.id)) {
      const cachedRole = roleCache.get(user.id) || 'user';
      console.log('Found cached role:', cachedRole);
      return cachedRole;
    }

    try {
      // First, try to get the user's role from the user_roles table
      console.log('Querying user_roles table for user_id:', user.id);
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id);

      console.log('user_roles query result:', userRoles, userRolesError);

      if (userRolesError) {
        console.error('Error fetching user roles:', userRolesError);
        // Fall back to app_metadata if there's an error
        return fallbackToMetadata(user);
      }

      if (userRoles && userRoles.length > 0) {
        // Get the role name from the roles table
        const roleId = userRoles[0].role_id;
        console.log('Found role_id:', roleId, 'Querying roles table');
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select('name')
          .eq('id', roleId)
          .single();

        console.log('roles query result:', roles, rolesError);

        if (rolesError) {
          console.error('Error fetching role:', rolesError);
          // Fall back to app_metadata if there's an error
          return fallbackToMetadata(user);
        }

        if (roles) {
          // Cache the role for future use
          console.log('Caching role:', roles.name);
          setRoleCache(prev => new Map(prev).set(user.id, roles.name));
          return roles.name;
        } else {
          console.log('No role found in roles table, falling back to metadata');
          return fallbackToMetadata(user);
        }
      }

      // If no role found in the tables, fall back to app_metadata
      console.log('No user_roles found, falling back to metadata');
      return fallbackToMetadata(user);
    } catch (error) {
      console.error('Error in extractUserRole:', error);
      // Fall back to app_metadata if there's an exception
      return fallbackToMetadata(user);
    }
  };

  // Helper function to fall back to app_metadata if the database query fails
  const fallbackToMetadata = (user: User): string => {
    console.log('Falling back to metadata for user:', user.id);
    console.log('User app_metadata:', user.app_metadata);

    // Check app_metadata for role information (Supabase standard)
    if (user.app_metadata && typeof user.app_metadata === 'object') {
      // Check for role in app_metadata.role
      if (user.app_metadata.role) {
        console.log('Found role in app_metadata.role:', user.app_metadata.role);
        return user.app_metadata.role;
      }

      // Check for role in app_metadata.roles array
      if (Array.isArray(user.app_metadata.roles) && user.app_metadata.roles.length > 0) {
        console.log('Found role in app_metadata.roles array:', user.app_metadata.roles[0]);
        return user.app_metadata.roles[0];
      }

      // Check for role in app_metadata.provider_role
      if (user.app_metadata.provider_role) {
        console.log('Found role in app_metadata.provider_role:', user.app_metadata.provider_role);
        return user.app_metadata.provider_role;
      }
    }

    // Check if the user's email is an admin email (common pattern)
    if (user.email && (
      user.email.includes('admin') || 
      user.email.endsWith('@admin.com') || 
      user.email === 'test@example.com' // For testing purposes
    )) {
      console.log('User email suggests admin role:', user.email);
      // Cache this role for future use
      setRoleCache(prev => new Map(prev).set(user.id, 'admin'));
      return 'admin';
    }

    // Default role if none found
    console.log('No role found in metadata, defaulting to "user"');
    return 'user';
  };

  // Helper function to find and log user ID in metadata
  const findUserIdInMetadata = (user: User | null) => {
    if (!user) return;

    console.log('User object:', user);
    console.log('User ID from user object:', user.id);

    if (user.user_metadata && typeof user.user_metadata === 'object') {
      console.log('User metadata:', user.user_metadata);
      if (user.user_metadata.id) {
        console.log('User ID found in user_metadata:', user.user_metadata.id);
      }
    }

    if (user.app_metadata && typeof user.app_metadata === 'object') {
      console.log('App metadata:', user.app_metadata);
      if (user.app_metadata.id) {
        console.log('User ID found in app_metadata:', user.app_metadata.id);
      }
    }
  };

  useEffect(() => {
    console.log('AuthContext.tsx: useEffect hook running');

    // Get initial session
    console.log('AuthContext.tsx: Getting initial session from Supabase');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('AuthContext.tsx: Got session from Supabase:', session);
      setSession(session);
      const currentUser = session?.user ?? null;
      console.log('AuthContext.tsx: Current user:', currentUser);
      setUser(currentUser);

      // Find and log user ID in metadata
      findUserIdInMetadata(currentUser);

      // Since extractUserRole is now async, we need to await it
      console.log('AuthContext.tsx: Extracting user role');
      const role = await extractUserRole(currentUser);
      console.log('AuthContext.tsx: User role:', role);
      setUserRole(role);
      console.log('AuthContext.tsx: Setting loading to false');
      setLoading(false);
    }).catch(error => {
      console.error('AuthContext.tsx: Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    console.log('AuthContext.tsx: Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext.tsx: Auth state changed:', event, session);
        setSession(session);
        const currentUser = session?.user ?? null;
        console.log('AuthContext.tsx: Current user after auth state change:', currentUser);
        setUser(currentUser);

        // Find and log user ID in metadata
        findUserIdInMetadata(currentUser);

        // Since extractUserRole is now async, we need to await it
        console.log('AuthContext.tsx: Extracting user role after auth state change');
        const role = await extractUserRole(currentUser);
        console.log('AuthContext.tsx: User role after auth state change:', role);
        setUserRole(role);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [roleCache]); // Add roleCache as a dependency to ensure it's updated when the cache changes

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext.tsx: Signing in with email:', email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log('AuthContext.tsx: Sign in result:', result);

    // If login is successful, update the local state
    if (result.data.session) {
      console.log('AuthContext.tsx: Login successful, updating state');
      setSession(result.data.session);
      setUser(result.data.user);

      // Extract and set the user role
      console.log('AuthContext.tsx: Extracting user role');
      const role = await extractUserRole(result.data.user);
      console.log('AuthContext.tsx: Setting user role to:', role);
      setUserRole(role);

      // Add a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('AuthContext.tsx: State updates complete');
    }

    return result;
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    // Basic email validation to prevent common test emails
    if (email.endsWith('@test.com') || email.endsWith('@example.com')) {
      return {
        error: new Error('Please use a valid email address. Test emails are not accepted.'),
        data: null
      };
    }

    // Validate required fields
    if (!name.trim()) {
      return {
        error: new Error('Name is required'),
        data: null
      };
    }

    if (!phone.trim()) {
      return {
        error: new Error('Phone number is required'),
        data: null
      };
    }

    // Get the current origin for the redirectTo URL
    const redirectTo = window.location.origin + '/login';
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name,
          phone
        }
      }
    });
  };

  const signOut = async () => {
    try {
      console.log('AuthContext.tsx: Signing out');

      // First update the local state to ensure UI updates immediately
      setUser(null);
      setSession(null);
      setUserRole(null);

      // Then sign out from Supabase
      await supabase.auth.signOut();
      console.log('AuthContext.tsx: Signed out successfully');

    } catch (error) {
      console.error('AuthContext.tsx: Error signing out:', error);
      // Even if there's an error with Supabase, ensure local state is cleared
      setUser(null);
      setSession(null);
      setUserRole(null);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return userRole === role;
  };

  // Computed property for admin check
  const isAdmin = userRole === 'admin';

  // Log when userRole changes
  useEffect(() => {
    console.log('AuthContext.tsx: userRole changed:', userRole);
  }, [userRole]);

  const value = {
    session,
    user,
    userRole,
    isAdmin,
    hasRole,
    signIn,
    signUp,
    signOut,
  };

  console.log('AuthContext.tsx: Rendering AuthContext.Provider with value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log('AuthContext.tsx: Using useAuth hook');

  const context = useContext(AuthContext);
  console.log('AuthContext.tsx: useAuth context:', context);

  if (context === undefined) {
    console.error('AuthContext.tsx: useAuth context is undefined');
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
