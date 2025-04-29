import Database from '../../components/Database';
import { Sidebar } from "../../components/Sidebar";
import '../../styles/Stock.css';
import '../../styles/Leftside.css';
import PopupDB from '../../components/PopupDB';
import { stockSidebarItems } from "@/navigation/stockSidebarItems";
import { useState } from 'react';

function Stock() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='stock-main'>
            <div className="stock-leftside">
                <Sidebar items={stockSidebarItems} />
                <PopupDB isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
            <Database setIsOpen={setIsOpen}/>
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