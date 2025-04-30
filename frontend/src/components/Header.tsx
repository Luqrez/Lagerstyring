import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <NavLink to="/" className="header-title no-active">
                <h1>Inventra</h1>
            </NavLink>
            <div className="divider" />
            <nav>
                <NavLink to="/">
                    <i className="fa-solid fa-chart-line" style={{ marginRight: '8px' }}></i>
                    Dashboard
                </NavLink>
                <NavLink to="/stock/varer">
                    <i className="fa-solid fa-boxes-stacked" style={{ marginRight: '8px' }}></i>
                    Lager
                </NavLink>
                <NavLink to="/orders">
                    <i className="fa-solid fa-truck-fast" style={{ marginRight: '8px' }}></i>
                    Indkøb
                </NavLink>
                <NavLink to="/users">
                    <i className="fa-solid fa-users" style={{ marginRight: '8px' }}></i>
                    Brugere
                </NavLink>
                <NavLink to="/settings">
                    <i className="fa-solid fa-gear" style={{ marginRight: '8px' }}></i>
                    Indstillinger
                </NavLink>
                <NavLink to="/login">
                    <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                    Login
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;
