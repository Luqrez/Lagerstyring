import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import './styles/App.css';

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

function App() {
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

    return (
      <div className="app">
        <Header/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    );
}

export default App;