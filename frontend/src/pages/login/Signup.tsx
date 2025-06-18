import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

function Signup() {
    // State variables for user inputs and UI feedback
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Auth context: provides business logic for user registration
    const { signUp } = useAuth();

    // Router hook for navigation after successful signup
    const navigate = useNavigate();

    useEffect(() => {
        // Business requirement: Ensure signup page allows scrolling,
        // in case previous pages have restricted it.
        document.body.style.overflow = 'auto';

        // Cleanup: Restore default overflow when leaving the signup page.
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    /**
     * Handles signup form submission.
     * Validates user input, manages loading and error state,
     * and interacts with authentication service.
     */
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Input validation: All fields must be filled.
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        // Business rule: Passwords must match.
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError(null); // Clear any previous errors
            setLoading(true); // Indicate loading state

            // Attempt registration via authentication context
            const { error, data } = await signUp(email, password);

            if (error) {
                // Handle business logic for failed registration
                console.error('Signup error:', error);
                setError(error.message);
                return;
            }

            // Log registration data for audit or debugging (business practice)
            console.log('Signup successful:', data);

            // Business logic: Notify user to confirm email if required
            if (data?.user && !data.user.confirmed_at) {
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                alert('Registration successful! You can now log in.');
            }

            // Redirect to login page after successful registration
            navigate('/login');
        } catch (err) {
            // Log unexpected errors for diagnostics and support
            setError('An unexpected error occurred');
            console.error('Unexpected error during signup:', err);
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Sign Up</h1>

            {/* Display error messages to the user, if any */}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {/* Signup form: collects user registration details */}
            <form onSubmit={handleSignup}>
                <p>Email</p>
                <input 
                    className="input-box" 
                    type="email" 
                    placeholder="Email (not test@test.com or example domains)" 
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

                <p>Confirm Password</p>
                <input 
                    className="input-box" 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {/* Submit button: disabled while loading to prevent duplicate submissions */}
                <button 
                    className="login-button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            {/* Link to login page for existing users */}
            <p className="signup-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      );

}

export default Signup;
