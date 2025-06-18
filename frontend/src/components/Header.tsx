import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

// Hovednavigation med brugerstyring der sikrer:
// - Kontrolleret adgang til systemets funktioner
// - Nem navigation på tværs af enheder (desktop/mobil)
function Header() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <NavLink to="/" className="header-title no-active">
                <h1>Inventra</h1>
            </NavLink>
            <div className="divider" />

            <button className="mobile-menu-toggle" onClick={toggleMenu}>
                <i className="fa-solid fa-bars"></i>
            </button>

            <nav>
                <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-chart-line" style={{ marginRight: '8px' }}></i>
                        Dashboard
                    </NavLink>

                    {user ? (
                        <button id="logout-button" className="no-active" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '8px' }}></i>
                            Logout
                        </button>
                    ) : (
                        <NavLink id="login-button" to="/login" onClick={() => setMenuOpen(false)}>
                            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                            Login
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;