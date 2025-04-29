import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Allow scrolling on Login page
        document.body.style.overflow = 'auto';

        return () => {
          // Optional: Clean up if needed when leaving
          document.body.style.overflow = '';
        };
      }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { error } = await signIn(email, password);

            if (error) {
                setError(error.message);
                return;
            }

            // Redirect to dashboard on successful login
            navigate('/');
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Login</h1>

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

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

                <button 
                    className="login-button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      );

}

export default Login;
