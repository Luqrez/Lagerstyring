
import { useEffect, useState } from 'react';
import '../styles/Stock.css';
import '../styles/print.css';
import { Button } from "../components/Button";
import Loading from "../components/Loading";


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

    const handlePrint = () => {
        window.print();
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
                                <Button label="Udskriv" variant="primary" onClick={handlePrint}/>
                            </div>
            </div>

            <div className="table-scroll-wrapper">
                  <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Indkøb</th>
                            <th>Enhed</th>
                            <th>Beskrivelse</th>
                            <th>Kategori</th>

                        </tr>
                    </thead>

                    <tbody>
                      {lowStockItems.map((item) => (
                            <tr key={item.Id}>
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
            {lowStockItems.length === 0 && <p>Ingen varer skal bestilles.</p>}
        </div>

    );
}

export default Orders;
