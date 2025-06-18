import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

function Login() {
    // State variables for user input and UI state management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth(); // Auth context: provides authentication methods
    const navigate = useNavigate(); // Router hook for navigation

    useEffect(() => {
        // Business requirement: Ensure login page allows scrolling,
        // in case previous pages have restricted it.
        document.body.style.overflow = 'auto';

        // Cleanup: Restore default overflow when leaving the login page.
        return () => {
          document.body.style.overflow = '';
        };
      }, []);

    /**
     * Handles login form submission.
     * Validates input, manages loading/error state, and
     * interacts with authentication service.
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Input validation: Both fields must be filled.
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setError(null); // Clear any previous errors
            setLoading(true); // Indicate loading state

            // Attempt sign-in via authentication context
            const { error } = await signIn(email, password);

            if (error) {
                // Handle business logic for failed authentication
                setError(error.message);
                return;
            }

            // On successful login, navigate to the dashboard/home page
            navigate('/');
        } catch (err) {
            // Log unexpected errors for diagnostics and support
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Login</h1>

            {/* Display error messages to the user, if any */}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {/* Login form: collects user credentials */}
            <form onSubmit={handleLogin}>
                <p>Email</p>
                <input 
                    className="input-box" 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <p>Password</p>
                <input 
                    className="input-box" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* Submit button: disabled while loading to prevent duplicate submissions */}
                <button 
                    className="login-button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Link to registration page for new users */}
            <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      );

}

export default Login
