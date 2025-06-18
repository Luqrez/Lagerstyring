import '../../styles/Leftside.css';
import { stockSidebarItems } from "@/navigation/stockSidebarItems";
import { Sidebar } from "../../components/Sidebar";

// Stock page component: displays sidebar navigation and category header
function Stock() {
    return (
        <div className='stock-main'>
            {/* Sidebar navigation for stock-related pages.
                Items are imported from a centralized navigation config
                to ensure consistency and maintainability across the application. */}
            <div className="stock-leftside">
                <Sidebar items={stockSidebarItems} />
            </div>
            {/* Main content area: displays a business-relevant section header.
                "Kategorier" means "Categories" and can be extended with more content as needed. */}
            <h1>Kategorier</h1>
        </div>
    );
}

export default Stock;
