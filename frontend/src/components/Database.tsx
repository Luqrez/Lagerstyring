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

    return(
    <div className="container">
        <h1>Lagerbeholdning</h1>

        <table className="beholdning-tabel">
            <thead>
            <tr>
                <th>ID</th>
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
                    <td>{vare.id}</td>
                    <td>{vare.navn}</td>
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