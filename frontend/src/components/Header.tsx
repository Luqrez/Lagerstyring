import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

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
                    <NavLink to="/stock/varer" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-boxes-stacked" style={{ marginRight: '8px' }}></i>
                        Lager
                    </NavLink>
                    <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-truck-fast" style={{ marginRight: '8px' }}></i>
                        Indkøb
                    </NavLink>
                    <NavLink to="/users" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-users" style={{ marginRight: '8px' }}></i>
                        Brugere
                    </NavLink>
                    <NavLink to="/settings" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-gear" style={{ marginRight: '8px' }}></i>
                        Indstillinger
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
