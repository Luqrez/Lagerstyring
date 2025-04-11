import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <h1>Inventra</h1>
            <div className="divider"/>
            <nav>
                <Link to="/">Dashboard</Link>
                <Link to="/login">Login</Link>
            </nav>
        </header>
    );
}

export default Header;