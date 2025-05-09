import { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useToast } from '../../components/Toast';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !name || !phone) {
            showToast('Please fill in all fields', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'warning');
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { error, data } = await signUp(email, password, name, phone);

            if (error) {
                console.error('Signup error:', error);
                showToast(error.message, 'error');
                return;
            }

            console.log('Signup successful:', data);

            // Check if user is created but not confirmed
            if (data?.user && !data.user.confirmed_at) {
                showToast('Registration successful! Please check your email to confirm your account.', 'success');
            } else {
                showToast('Registration successful! You can now log in.', 'success');
            }

            navigate('/login');
        } catch (err) {
            showToast('An unexpected error occurred', 'error');
            console.error('Unexpected error during signup:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Sign Up</h1>

            <form onSubmit={handleSignup}>
                <p>Name</p>
                <input 
                    className="input-box" 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <p>Phone</p>
                <input 
                    className="input-box" 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

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
