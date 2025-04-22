import '../../styles/Leftside.css';
import { stockSidebarItems } from "@/navigation/stockSidebarItems";
import { Sidebar } from "../../components/Sidebar";

function Stock() {
    return (
        <div className='stock-main'>
            <div className="stock-leftside">
                <Sidebar items={stockSidebarItems} />
            </div>
            <h1>Kategorier</h1>
        </div>
    );
}

export default Stock;