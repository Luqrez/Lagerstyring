import { useEffect } from 'react';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

function Login() {

    useEffect(() => {
        // Allow scrolling on Login page
        document.body.style.overflow = 'auto';
    
        return () => {
          // Optional: Clean up if needed when leaving
          document.body.style.overflow = '';
        };
      }, []);

      return (
        <div className="main-holder">
          <div className="login-holder">
            <h1>Sign Up</h1>
            <p>Username</p>
            <input className="input-box" type="text" placeholder="Username" />
      
            <p>Password</p>
            <input className="input-box" type="password" placeholder="Password" />

            <p>Confirm Password</p>
            <input className="input-box" type="password" placeholder="Password" />
      
            <button className="login-button">Sign Up</button>
      
            <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      );
      
}

export default Login;
