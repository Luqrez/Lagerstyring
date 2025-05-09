import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import RoleBasedContent from './RoleBasedContent';

function Header() {
    console.log('Header.tsx: Rendering Header component');

    const { user, signOut } = useAuth();
    console.log('Header.tsx: User from useAuth:', user);

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
                        <i className="fa-solid fa-chart-line nav-icon"></i>
                        Dashboard
                    </NavLink>
                    <NavLink to="/stock/varer" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-boxes-stacked nav-icon"></i>
                        Lager
                    </NavLink>
                    <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
                        <i className="fa-solid fa-truck-fast nav-icon"></i>
                        Indkøb
                    </NavLink>
                    <RoleBasedContent allowedRoles={['admin']}>
                        <NavLink to="/users" onClick={() => setMenuOpen(false)}>
                            <i className="fa-solid fa-users nav-icon"></i>
                            Brugere
                        </NavLink>
                    </RoleBasedContent>
                    <RoleBasedContent allowedRoles={['admin']}>
                        <NavLink to="/settings" onClick={() => setMenuOpen(false)}>
                            <i className="fa-solid fa-gear nav-icon"></i>
                            Indstillinger
                        </NavLink>
                    </RoleBasedContent>
                    {user ? (
                        <button id="logout-button" className="no-active" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                            <i className="fa-solid fa-right-from-bracket nav-icon"></i>
                            Logout
                        </button>
                    ) : (
                        <NavLink id="login-button" to="/login" onClick={() => setMenuOpen(false)}>
                            <i className="fa-solid fa-right-to-bracket nav-icon"></i>
                            Login
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
