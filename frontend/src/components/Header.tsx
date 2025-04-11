import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <h1>Inventra</h1>
            <div className="divider" />
            <nav>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-chart-line" style={{ marginRight: '8px' }}></i>
                    Dashboard
                </NavLink>
                <NavLink to="/stock" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-boxes-stacked" style={{ marginRight: '8px' }}></i>
                    Stock
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-truck-fast" style={{ marginRight: '8px' }}></i>
                    Ordrer
                </NavLink>
                <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-users" style={{ marginRight: '8px' }}></i>
                    Brugere
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-gear" style={{ marginRight: '8px' }}></i>
                    Indstillinger
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>
                    <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                    Login
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;
