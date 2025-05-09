
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/Database.css';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import RoleBasedContent from '../components/RoleBasedContent';
import { Button } from '../components/Button';

// Interface for user data
interface UserData {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    user_metadata: {
        [key: string]: any;
    };
    app_metadata?: {
        [key: string]: any;
    };
}

function Users() {
    const { showToast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<keyof UserData | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [userRoles, setUserRoles] = useState<{ [userId: string]: string }>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
        }
    }, [error, showToast]);

    async function fetchUsers() {
        try {
            setLoading(true);

            // Try to get users using the admin API (requires admin privileges)
            try {
                // Add headers to help with CORS issues
                const { data: adminData, error: adminError } = await supabase.functions.invoke('get-all-users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!adminError && adminData) {
                    setUsers(adminData);
                    return;
                }
            } catch (adminErr) {
                console.log('Admin API not available or not authorized:', adminErr);
                if (adminErr instanceof Error && adminErr.message.includes('CORS')) {
                    console.warn('CORS error detected when calling Supabase function. Falling back to database queries.');
                    // You may need to configure CORS in your Supabase Edge Function or use a proxy
                }
                // Continue to other methods if admin API fails
            }

            // Try to get users from the auth.users view if it exists
            const { data, error: fetchError } = await supabase
                .from('auth.users')
                .select('*');

            if (!fetchError && data) {
                // Make sure user_metadata is properly formatted
                const formattedData = data.map(user => {
                    // Check all possible metadata field names
                    const metadata = 
                        (typeof user.raw_user_meta_data === 'object' ? user.raw_user_meta_data : null) ||
                        (typeof user.user_metadata === 'object' ? user.user_metadata : null) ||
                        (typeof user.meta_data === 'object' ? user.meta_data : null) ||
                        (typeof user.metadata === 'object' ? user.metadata : null) ||
                        {};

                    console.log('User from auth.users:', user);
                    console.log('Extracted metadata:', metadata);

                    return {
                        ...user,
                        user_metadata: metadata
                    };
                });
                setUsers(formattedData);
                return;
            }

            // If that fails, try the users table
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*');

            if (!usersError && usersData) {
                // Make sure user_metadata is properly formatted
                const formattedData = usersData.map(user => {
                    // Check all possible metadata field names
                    const metadata = 
                        (typeof user.raw_user_meta_data === 'object' ? user.raw_user_meta_data : null) ||
                        (typeof user.user_metadata === 'object' ? user.user_metadata : null) ||
                        (typeof user.meta_data === 'object' ? user.meta_data : null) ||
                        (typeof user.metadata === 'object' ? user.metadata : null) ||
                        {};

                    console.log('User from users table:', user);
                    console.log('Extracted metadata:', metadata);

                    return {
                        ...user,
                        user_metadata: metadata
                    };
                });
                setUsers(formattedData);
                return;
            }

            // If both fail, try to get at least the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // If we can only get the current user, show just that one
                console.log('Current user data:', user);
                console.log('Current user metadata:', user.user_metadata);
                console.log('Current user app_metadata:', user.app_metadata);

                // Check if we need to format the user data
                if (!user.user_metadata) {
                    // Try to find metadata in other fields
                    const metadata = 
                        (typeof user.raw_user_meta_data === 'object' ? user.raw_user_meta_data : null) ||
                        (typeof user.meta_data === 'object' ? user.meta_data : null) ||
                        (typeof user.metadata === 'object' ? user.metadata : null) ||
                        {};

                    console.log('Extracted metadata for current user:', metadata);

                    // Create a new user object with the metadata
                    const formattedUser = {
                        ...user,
                        user_metadata: metadata
                    };

                    setUsers([formattedUser]);
                } else {
                    setUsers([user]);
                }
            } else {
                // If we can't get any users, show an error
                setError('Could not fetch users. You may not have the required permissions.');
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(`Could not fetch users: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    }

    const handleSort = (column: keyof UserData) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Log user data for debugging
    useEffect(() => {
        if (users.length > 0) {
            console.log('User data structure:', users[0]);
            console.log('User metadata:', users[0].user_metadata);
        }
    }, [users]);

    // Fetch roles for each user from the roles and user_roles tables
    useEffect(() => {
        async function fetchUserRoles() {
            if (users.length === 0) return;

            const newUserRoles: { [userId: string]: string } = {};

            for (const user of users) {
                try {
                    // First, try to get the user's role from the user_roles table
                    const { data: userRolesData, error: userRolesError } = await supabase
                        .from('user_roles')
                        .select('role_id')
                        .eq('user_id', user.id);

                    if (userRolesError) {
                        console.error('Error fetching user roles:', userRolesError);
                        // Fall back to app_metadata if there's an error
                        newUserRoles[user.id] = fallbackToMetadata(user);
                        continue;
                    }

                    if (userRolesData && userRolesData.length > 0) {
                        // Get the role name from the roles table
                        const roleId = userRolesData[0].role_id;
                        const { data: rolesData, error: rolesError } = await supabase
                            .from('roles')
                            .select('name')
                            .eq('id', roleId)
                            .single();

                        if (rolesError) {
                            console.error('Error fetching role:', rolesError);
                            // Fall back to app_metadata if there's an error
                            newUserRoles[user.id] = fallbackToMetadata(user);
                            continue;
                        }

                        if (rolesData) {
                            newUserRoles[user.id] = rolesData.name;
                        } else {
                            // Fall back to app_metadata if no role found
                            newUserRoles[user.id] = fallbackToMetadata(user);
                        }
                    } else {
                        // Fall back to app_metadata if no user_roles found
                        newUserRoles[user.id] = fallbackToMetadata(user);
                    }
                } catch (error) {
                    console.error('Error in fetchUserRoles:', error);
                    // Fall back to app_metadata if there's an exception
                    newUserRoles[user.id] = fallbackToMetadata(user);
                }
            }

            setUserRoles(newUserRoles);
        }

        fetchUserRoles();
    }, [users]);

    // Helper function to fall back to app_metadata if the database query fails
    const fallbackToMetadata = (user: UserData): string => {
        // Check app_metadata for role information
        if (user.app_metadata && typeof user.app_metadata === 'object') {
            if (user.app_metadata.role) {
                return user.app_metadata.role;
            }

            // Some Supabase configurations use 'roles' array
            if (Array.isArray(user.app_metadata.roles) && user.app_metadata.roles.length > 0) {
                return user.app_metadata.roles[0];
            }
        }

        // Default role if none found
        return 'user';
    };

    // Sort the data
    const sortedUsers = [...users].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue, 'da-DK') 
                : bValue.localeCompare(aValue, 'da-DK');
        }

        // Handle other types or null values
        if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
        if (bValue === null) return sortDirection === 'asc' ? 1 : -1;

        // Default comparison
        return sortDirection === 'asc' 
            ? String(aValue).localeCompare(String(bValue)) 
            : String(bValue).localeCompare(String(aValue));
    });

    if (loading) return <div className='center-loader'><Loading /></div>;

    return (
        <div className="container">
            <div className="table-header">
                <div className='title-holder'>
                    <h1>Brugere</h1>
                </div>
                <RoleBasedContent allowedRoles={['admin']}>
                    <div>
                        <Button 
                            label="Administrer Roller" 
                            variant="primary" 
                            onClick={() => showToast('Rolleadministration er under udvikling', 'info')} 
                        />
                    </div>
                </RoleBasedContent>
            </div>

            <div className="table-scroll-wrapper">
                <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('email')} className={`sortable ${sortColumn === 'email' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Email</th>
                            <th>Navn</th>
                            <th>Telefon</th>
                            <th>Rolle</th>
                            <th onClick={() => handleSort('created_at')} className={`sortable ${sortColumn === 'created_at' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Oprettet</th>
                            <th onClick={() => handleSort('last_sign_in_at')} className={`sortable ${sortColumn === 'last_sign_in_at' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Sidst logget ind</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user) => {
                            // We'll use a state variable to store the role for each user
                            // The role will be fetched from the roles and user_roles tables in a useEffect hook

                            return (
                                <tr key={user.uuid}>
                                    <td id="navn">{user.email}</td>
                                    <td>{user.user_metadata?.name || 'Ikke angivet'}</td>
                                    <td>{user.user_metadata?.phone || 'Ikke angivet'}</td>
                                    <td>{userRoles[user.id] || 'user'}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString('da-DK')}</td>
                                    <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('da-DK') : 'Aldrig'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && <p>Ingen brugere fundet.</p>}
        </div>
    );
}

export default Users;
