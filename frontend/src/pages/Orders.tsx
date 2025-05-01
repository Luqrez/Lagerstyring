
import { useEffect, useState } from 'react';
import '../styles/Stock.css';
import '../styles/print.css';
import { Button } from "../components/Button";


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

    const checkLowStock = async () => {
        try {
            const response = await fetch('http://localhost:5212/api/beholdning');
            const data = await response.json();
            
            // Filter items where mængde is less than minimum
            const itemsToOrder = data.filter((item: StockItem) => item.Mængde < item.Minimum);
            setLowStockItems(itemsToOrder);
            console.log('Items below minimum:', itemsToOrder);
        } catch (error) {
            console.error('Error checking stock levels:', error);
        }
    };

    useEffect(() => {
        checkLowStock();
    }, []);

    const handlePrint = () => {
        window.print();
    };
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
        </div>

    );
}

export default Orders;