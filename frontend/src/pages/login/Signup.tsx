import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Allow scrolling on Login page
        document.body.style.overflow = 'auto';

        return () => {
          // Optional: Clean up if needed when leaving
          document.body.style.overflow = '';
        };
      }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { error, data } = await signUp(email, password);

            if (error) {
                console.error('Signup error:', error);
                setError(error.message);
                return;
            }

            console.log('Signup successful:', data);

            // Check if user is created but not confirmed
            if (data?.user && !data.user.confirmed_at) {
                alert('Registration successful! Please check your email to confirm your account.');
            } else {
                alert('Registration successful! You can now log in.');
            }

            navigate('/login');
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Unexpected error during signup:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Sign Up</h1>

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

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

                <button 
                    className="login-button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <p className="signup-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      );

}

export default Signup;
