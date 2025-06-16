
import { useEffect, useState } from 'react';
import '../styles/Stock.css';
import '../styles/print.css';
import { Button } from "../components/Button";
import Loading from "../components/Loading";
import { FaSearch } from 'react-icons/fa';


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
    const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [selectedAll, setSelectedAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);

    const checkLowStock = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5212/api/beholdning');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Filter items where mængde is less than minimum
            const itemsToOrder = data.filter((item: StockItem) => item.Mængde < item.Minimum);
            setLowStockItems(itemsToOrder);
            console.log('Items below minimum:', itemsToOrder);
        } catch (error) {
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

    useEffect(() => {
        checkLowStock();
    }, []);

    // Filter items based on search query
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

    const handlePrint = () => {
        window.print();
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedAll(isChecked);

        const newSelectedItems: { [key: number]: boolean } = {};
        lowStockItems.forEach(item => {
            newSelectedItems[item.Id] = isChecked;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleSelectItem = (Id: number, checked: boolean) => {
        setSelectedItems(prev => ({
            ...prev,
            [Id]: checked
        }));
    };

    const handleClearSelected = () => {
        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected)
            .map(([id, ]) => parseInt(id));

        if (selectedIds.length === 0) {
            alert('Ingen varer valgt til at fjerne fra indkøbslisten.');
            return;
        }

        // Remove selected items from the lowStockItems list
        const updatedItems = lowStockItems.filter(item => !selectedItems[item.Id]);
        setLowStockItems(updatedItems);

        // Clear selections
        setSelectedItems({});
        setSelectedAll(false);
    };
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
             <div className="table-header">
                            <div className='title-holder'>
                                <h1>Indkøb</h1>
                            </div>
                            <div>
                                <Button label="Fjern valgte" variant="delete" onClick={handleClearSelected}/>
                                <Button label="Udskriv" variant="primary" onClick={handlePrint}/>
                            </div>
            </div>

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

            <div className="table-scroll-wrapper">
                  <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={selectedAll} onChange={handleSelectAll} /></th>
                            <th>Navn</th>
                            <th>Indkøb</th>
                            <th>Enhed</th>
                            <th>Beskrivelse</th>
                            <th>Kategori</th>
                        </tr>
                    </thead>

                    <tbody>
                      {filteredItems.map((item) => (
                            <tr key={item.Id} onClick={() => handleSelectItem(item.Id, !(selectedItems[item.Id] || false))}>
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
            {filteredItems.length === 0 && lowStockItems.length > 0 && searchQuery && 
                <p>Ingen varer matcher søgningen "{searchQuery}".</p>}
            {lowStockItems.length === 0 && <p>Ingen varer skal bestilles.</p>}
        </div>

    );
}

export default Orders;
