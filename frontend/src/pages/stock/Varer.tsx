import Database from '../../components/Database';
import { Sidebar } from "../../components/Sidebar";
import '../../styles/Stock.css';
import '../../styles/Leftside.css';
import { stockSidebarItems } from "@/navigation/stockSidebarItems";


function Stock() {
    return (
        <div className='stock-main'>
            <div className="stock-leftside">
                <Sidebar items={stockSidebarItems} />
            </div>
            <Database/>
        </div>
    );
}

export default Stock;

// <div className="stock-leftside">
// <NavLink to="/stock/varer">
//     Varer
// </NavLink>
// <NavLink to="/stock/kategorier">
//     Kategorier
// </NavLink>
// </div>