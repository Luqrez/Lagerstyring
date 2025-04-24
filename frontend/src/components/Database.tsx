import { useEffect, useState } from "react";
import { Button } from "../components/Button";

// Used for streaming from server
import { HubConnectionBuilder } from "@microsoft/signalr";


import "../styles/Database.css";

// Interface der afspejler strukturen i beholdning-tabellen
// used for type safety. Good practice
interface Beholdning {
    Id: number;
    Oprettet: string;
    Navn: string;
    Beskrivelse: string;
    Mængde: number;
    Kategori: string;
    Lokation: string;
    Enhed: string;
}

function mapRow(row: any): Beholdning {
    return {
        Id: row.id,
        Oprettet: row.oprettet,
        Navn: row.navn,
        Beskrivelse: row.beskrivelse,
        Mængde: row.mængde,
        Kategori: row.kategori,
        Lokation: row.lokation,
        Enhed: row.enhed,
    };
}


// Component
function Database() {
    const [beholdning, setBeholdning] = useState<Beholdning[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [sortColumn, setSortColumn] = useState<keyof Beholdning | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        getBeholdning();

        const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5212/realtime/beholdning")
        .withAutomaticReconnect()
        .build();

        connection.on("ReceiveUpdate", (data: any) => {
            console.log("Realtime update received:", data);
          
            const { eventType, new: newRow, old: oldRow } = data;
          
            if (eventType === "INSERT" && newRow) {
              setBeholdning(prev => [...prev, mapRow(newRow)]);
            } else if (eventType === "UPDATE" && newRow) {
              setBeholdning(prev =>
                prev.map(row => (row.Id === newRow.id ? mapRow(newRow) : row))
              );
            } else if (eventType === "DELETE" && oldRow) {
              setBeholdning(prev => prev.filter(row => row.Id !== oldRow.id));
            }
          });
          

        connection.start()
            .then(() => console.log("SignalR connected"))
            .catch((err) => console.error("SignalR connection error:", err));

        return () => {
            connection.stop();
        };
    }, []);

    async function getBeholdning() {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5212/api/beholdning', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBeholdning(data || []);
        } catch (err) {
            console.error("Fejl ved hentning af beholdning:", err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError("Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212");
            } else {
                setError(`Der opstod en fejl ved hentning af data: ${err instanceof Error ? err.message : String(err)}`);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedAll(isChecked);

        const newSelectedItems: { [key: number]: boolean } = {};
        beholdning.forEach(item => {
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

    const handleSort = (column: keyof Beholdning) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedBeholdning = [...beholdning].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue);
        const bString = String(bValue);
        return sortDirection === 'asc'
            ? aString.localeCompare(bString, 'da-DK')
            : bString.localeCompare(aString, 'da-DK');
    });

    if (loading) return <div>Indlæser...</div>;
    if (error) return <div>Fejl: {error}</div>;

    return (
        <div className="container">
            <div className="table-header">
                <div className='title-holder'>
                    <h1>Lagerbeholdning</h1>
                    <p>28 Varer</p>
                </div>
                <div>
                    <Button label="Slet" variant="delete" />
                    <Button label="+ Opret ny" variant="primary"/>
                </div>
            </div>


            <div className="table-scroll-wrapper">
                <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={selectedAll} onChange={handleSelectAll} /></th>
                            <th onClick={() => handleSort('Navn')} className={`sortable ${sortColumn === 'Navn' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Navn</th>
                            <th onClick={() => handleSort('Beskrivelse')} className={`sortable ${sortColumn === 'Beskrivelse' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Beskrivelse</th>
                            <th onClick={() => handleSort('Mængde')} className={`sortable ${sortColumn === 'Mængde' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Mængde</th>
                            <th onClick={() => handleSort('Enhed')} className={`sortable ${sortColumn === 'Enhed' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Enhed</th>
                            <th onClick={() => handleSort('Kategori')} className={`sortable ${sortColumn === 'Kategori' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Kategori</th>
                            <th onClick={() => handleSort('Lokation')} className={`sortable ${sortColumn === 'Lokation' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Lokation</th>
                            <th onClick={() => handleSort('Oprettet')} className={`sortable ${sortColumn === 'Oprettet' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Oprettet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBeholdning.map((vare) => (
                            <tr key={vare.Id}>
                                <td><input type="checkbox" checked={selectedItems[vare.Id] || false} onChange={(e) => handleSelectItem(vare.Id, e.target.checked)} /></td>
                                <td id="navn">{vare.Navn}</td>
                                <td>{vare.Beskrivelse}</td>
                                <td>{vare.Mængde}</td>
                                <td>{vare.Enhed}</td>
                                <td>{vare.Kategori}</td>
                                <td>{vare.Lokation}</td>
                                <td>{new Date(vare.Oprettet).toLocaleDateString('da-DK')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {beholdning.length === 0 && <p>Ingen varer fundet i beholdningen.</p>}
        </div>
    );
}

export default Database;
