import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import '../styles/Database.css';

// Interface der afspejler strukturen i beholdning-tabellen
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

function Database() {
    // Angiv typen eksplicit
    const [beholdning, setBeholdning] = useState<Beholdning[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{[key: number]: boolean}>({});



    useEffect(() => {
        getBeholdning();
    }, []);

    async function getBeholdning() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("beholdning").select();

            if (error) {
                throw error;
            }

            // Tilføj null check for at undgå at sætte null i state
            setBeholdning(data || []);
        } catch (err) {
            console.error("Fejl ved hentning af beholdning:", err);
            setError("Der opstod en fejl ved hentning af data");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Indlæser...</div>;
    if (error) return <div>Fejl: {error}</div>;


    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedAll(isChecked);
        
        const newSelectedItems: {[key: number]: boolean} = {};
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

    return(
    <div className="container">
        <h1>Lagerbeholdning</h1>

        <table className="beholdning-tabel">
            <thead>
            <tr>
                <th><input type="checkbox" checked={selectedAll} onChange={handleSelectAll} /></th>
                <th>Navn</th>
                <th>Beskrivelse</th>
                <th>Mængde</th>
                <th>Enhed</th>
                <th>Kategori</th>
                <th>Lokation</th>
                <th>Oprettet</th>
            </tr>
            </thead>
            <tbody>
            {beholdning.map((vare) => (
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

        {beholdning.length === 0 && <p>Ingen varer fundet i beholdningen.</p>}
    </div>
    );
}

export default Database;