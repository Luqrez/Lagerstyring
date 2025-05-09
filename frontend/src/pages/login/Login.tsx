import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useToast } from '../../components/Toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        // Allow scrolling on Login page
        document.body.style.overflow = 'auto';

        return () => {
          // Optional: Clean up if needed when leaving
          document.body.style.overflow = '';
        };
      }, []);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
        }
    }, [error, showToast]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setError(null);
            setLoading(true);
            console.log('Login.tsx: Attempting to sign in');

            const { error } = await signIn(email, password);

            if (error) {
                console.log('Login.tsx: Sign in error:', error);
                setError(error.message);
                return;
            }

            console.log('Login.tsx: Sign in successful, navigating to dashboard');
            // Redirect to dashboard on successful login
            navigate('/');
        } catch (err) {
            console.error('Login.tsx: Unexpected error during login:', err);
            setError('An unexpected error occurred');
        } finally {
            console.log('Login.tsx: Login process completed, setting loading to false');
            setLoading(false);
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Login</h1>


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
