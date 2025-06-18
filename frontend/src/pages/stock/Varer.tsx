import Database from '../../components/Database';
import { Sidebar } from "../../components/Sidebar";
import '../../styles/Stock.css';
import '../../styles/Leftside.css';
import PopupDB from '@/components/PopupDB';
import { stockSidebarItems } from "@/navigation/stockSidebarItems";
import { useState } from 'react';

function Stock() {
    // State to control the visibility of the database popup modal.
    // Used for actions such as adding or editing stock records.
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='stock-main'>
            {/* Left sidebar: 
                - Provides navigation for stock management sections.
                - Uses a centralized configuration (stockSidebarItems) for consistency and scalability.
                - Hosts the PopupDB modal for database-related user interactions. */}
            <div className="stock-leftside">
                <Sidebar items={stockSidebarItems} />
                {/* PopupDB modal: 
                    - Controlled via isOpen and setIsOpen.
                    - Supports business workflows like record creation or editing. */}
                <PopupDB isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
            {/* Main content area:
                - Renders the Database component for managing and displaying stock data.
                - Passes setIsOpen to allow child components to trigger the popup modal as needed. */}
            <Database setisOpen={setIsOpen}/>
        </div>
    );
}

export default Stock;
