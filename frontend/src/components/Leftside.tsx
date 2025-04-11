import { NavLink } from 'react-router-dom';
import '../styles/Leftside.css';

function Leftside() {
    return (
        <div className="stock-leftside">
            <NavLink to="/stock/varer">
                Varer
            </NavLink>
            <NavLink to="/stock/kategorier">
                Kategorier
            </NavLink>
        </div>
    );
}

export default Leftside;
