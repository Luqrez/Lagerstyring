import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import supabase from "../../utils/supabase";
import "../styles/Database.css";

// Interface der afspejler strukturen i beholdning-tabellen
// used for type safety. Good practice
interface Beholdning {
    id: number;
    oprettet: string;
    navn: string;
    beskrivelse: string;
    mængde: number;
    kategori: string;
    lokation: string;
    enhed: string;
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
    }, []);

    async function getBeholdning() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("beholdning").select();

            if (error) throw error;

            setBeholdning(data || []);
        } catch (err) {
            console.error("Fejl ved hentning af beholdning:", err);
            setError("Der opstod en fejl ved hentning af data");
        } finally {
            setLoading(false);
        }
    }

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedAll(isChecked);

        const newSelectedItems: { [key: number]: boolean } = {};
        beholdning.forEach(item => {
            newSelectedItems[item.id] = isChecked;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        setSelectedItems(prev => ({
            ...prev,
            [id]: checked
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
                    <Button label="6969" variant="secondary"/>
                    <Button label="Slet" variant="delete" />

                    <Button label="+ Opret ny" variant="primary"/>
                </div>
            </div>


            <div className="table-scroll-wrapper">
                <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={selectedAll} onChange={handleSelectAll} /></th>
                            <th onClick={() => handleSort('navn')} className={`sortable ${sortColumn === 'navn' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Navn</th>
                            <th onClick={() => handleSort('beskrivelse')} className={`sortable ${sortColumn === 'beskrivelse' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Beskrivelse</th>
                            <th onClick={() => handleSort('mængde')} className={`sortable ${sortColumn === 'mængde' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Mængde</th>
                            <th onClick={() => handleSort('enhed')} className={`sortable ${sortColumn === 'enhed' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Enhed</th>
                            <th onClick={() => handleSort('kategori')} className={`sortable ${sortColumn === 'kategori' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Kategori</th>
                            <th onClick={() => handleSort('lokation')} className={`sortable ${sortColumn === 'lokation' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Lokation</th>
                            <th onClick={() => handleSort('oprettet')} className={`sortable ${sortColumn === 'oprettet' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Oprettet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBeholdning.map((vare) => (
                            <tr key={vare.id}>
                                <td><input type="checkbox" checked={selectedItems[vare.id] || false} onChange={(e) => handleSelectItem(vare.id, e.target.checked)} /></td>
                                <td id="navn">{vare.navn}</td>
                                <td>{vare.beskrivelse}</td>
                                <td>{vare.mængde}</td>
                                <td>{vare.enhed}</td>
                                <td>{vare.kategori}</td>
                                <td>{vare.lokation}</td>
                                <td>{new Date(vare.oprettet).toLocaleDateString('da-DK')}</td>
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
