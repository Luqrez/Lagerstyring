import { useEffect, useState } from 'react';
import '../styles/Stock.css';
import '../styles/print.css';
import { Button } from "../components/Button";
import Loading from "../components/Loading";
import { FaSearch } from 'react-icons/fa';

// Interface for stock item structure, ensuring type safety and clarity in business data handling
interface StockItem {
    Id: number;
    Navn: string;
    Mængde: number;
    Beskrivelse: string;
    Kategori: string;
    Minimum: number;
    Enhed: string;
}

function Orders() {
    // State management for inventory and UI
    const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]); // Items below minimum stock
    const [loading, setLoading] = useState(true); // Loading state for async operations
    const [error, setError] = useState<string | null>(null); // Error message handling
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({}); // Track selected items for batch actions
    const [selectedAll, setSelectedAll] = useState(false); // Track "select all" checkbox state
    const [searchQuery, setSearchQuery] = useState(''); // Search input value
    const [filteredItems, setFilteredItems] = useState<StockItem[]>([]); // Filtered items based on search

    /**
     * Fetches stock data from backend and identifies items below minimum threshold.
     * Handles loading and error states for robust user experience.
     */
    const checkLowStock = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5212/api/beholdning');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Business logic: Only include items where current quantity is below minimum
            const itemsToOrder = data.filter((item: StockItem) => item.Mængde < item.Minimum);
            setLowStockItems(itemsToOrder);
            console.log('Items below minimum:', itemsToOrder);
        } catch (error) {
            // Comprehensive error handling for network and application errors
            console.error('Error checking stock levels:', error);
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                setError("Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212");
            } else {
                setError(`Der opstod en fejl ved hentning af data: ${error instanceof Error ? error.message : String(error)}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // On component mount, fetch low stock items
    useEffect(() => {
        checkLowStock();
    }, []);

    // Filter items in real-time based on user search input
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(lowStockItems);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = lowStockItems.filter(item => 
            item.Navn.toLowerCase().includes(query) ||
            item.Beskrivelse.toLowerCase().includes(query) ||
            item.Kategori.toLowerCase().includes(query) ||
            item.Enhed.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    }, [searchQuery, lowStockItems]);

    // Handles printing of the current order list for business use (e.g., procurement)
    const handlePrint = () => {
        window.print();
    };

    // Handles "select all" checkbox logic for batch actions
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedAll(isChecked);

        const newSelectedItems: { [key: number]: boolean } = {};
        lowStockItems.forEach(item => {
            newSelectedItems[item.Id] = isChecked;
        });
        setSelectedItems(newSelectedItems);
    };

    // Handles selection of individual items for batch actions
    const handleSelectItem = (Id: number, checked: boolean) => {
        setSelectedItems(prev => ({
            ...prev,
            [Id]: checked
        }));
    };

    // Removes selected items from the order list; supports business workflow for order management
    const handleClearSelected = () => {
        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected)
            .map(([id, ]) => parseInt(id));

        if (selectedIds.length === 0) {
            alert('Ingen varer valgt til at fjerne fra indkøbslisten.');
            return;
        }

        // Update the order list by removing selected items
        const updatedItems = lowStockItems.filter(item => !selectedItems[item.Id]);
        setLowStockItems(updatedItems);

        // Reset selection state
        setSelectedItems({});
        setSelectedAll(false);
    };

    // Conditional rendering for loading and error states
    if (loading) return <div className='center-loader'><Loading /></div>;
    if (error) return (
        <div className="container">
            <div className="error-message">
                <h2>Fejl ved indlæsning af indkøbsliste</h2>
                <p>{error}</p>
                <Button label="Prøv igen" variant="primary" onClick={checkLowStock}/>
            </div>
        </div>
    );

    return (
        <div className="container">
            {/* Header and action buttons for order management */}
            <div className="table-header">
                <div className='title-holder'>
                    <h1>Indkøb</h1>
                </div>
                <div>
                    <Button label="Fjern valgte" variant="delete" onClick={handleClearSelected}/>
                    <Button label="Udskriv" variant="primary" onClick={handlePrint}/>
                </div>
            </div>

            {/* Search input for filtering items in real-time */}
            <div className="search-container">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Søg efter varer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Table displays items below minimum stock with selection and action capabilities */}
            <div className="table-scroll-wrapper">
                <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="checkbox" 
                                    checked={selectedAll} 
                                    onChange={handleSelectAll} 
                                />
                            </th>
                            <th>Navn</th>
                            <th>Indkøb</th>
                            <th>Enhed</th>
                            <th>Beskrivelse</th>
                            <th>Kategori</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr 
                                key={item.Id} 
                                onClick={() => handleSelectItem(item.Id, !(selectedItems[item.Id] || false))}
                            >
                                <td onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems[item.Id] || false}
                                        onChange={(e) => handleSelectItem(item.Id, e.target.checked)}
                                    />
                                </td>
                                <td>{item.Navn}</td>
                                <td>{item.Minimum - item.Mængde}</td>
                                <td>{item.Enhed}</td>
                                <td>{item.Beskrivelse}</td>
                                <td>{item.Kategori}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* User feedback for empty search or empty order list */}
            {filteredItems.length === 0 && lowStockItems.length > 0 && searchQuery && 
                <p>Ingen varer matcher søgningen "{searchQuery}".</p>}
            {lowStockItems.length === 0 && <p>Ingen varer skal bestilles.</p>}
        </div>
    );
}

export default Orders;
