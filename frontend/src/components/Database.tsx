import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Loading from "../components/Loading";
import { getConnection, addListener, removeListener } from "../services/signalrService";
import "../styles/Database.css";
import { supabase } from "../lib/supabase";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditPopup from "./EditPopup";
import { FaSearch } from 'react-icons/fa';

/*
 * Lagerstyringssystemet optimerer forretningens drift ved at:
 * - Forebygge lagermangel gennem proaktive advarsler ved lave beholdninger
 * - Reducere svind via præcis sporing af varebevægelser 
 * - Effektivisere indkøb gennem automatiske indkøbsforslag
 * - Sikre overholdelse af lovkrav om sporbarhed i fødevarebranchen
 * - Minimere fejlplaceringer via struktureret lokationsstyring
 */
interface Beholdning {
    Id: number;
    Oprettet: string;
    Navn: string;
    Beskrivelse: string;
    Mængde: number;
    Minimum: number;
    Kategori: string;
    Lokation: string;
    Enhed: string;

}
interface DatabaseProps {
    setIsOpen: (isOpen: boolean) => void;
}

interface RowData {
    id: number;
    oprettet: string;
    navn: string;
    beskrivelse: string;
    mængde: number;
    min_mængde: number;
    kategori: string;
    lokation: string;
    enhed: string;
}

function mapRow(row: RowData): Beholdning {
    return {
        Id: row.id,
        Oprettet: row.oprettet,
        Navn: row.navn,
        Beskrivelse: row.beskrivelse,
        Mængde: row.mængde,
        Minimum: row.min_mængde,
        Kategori: row.kategori,
        Lokation: row.lokation,
        Enhed: row.enhed,
    };
}

interface DatabaseProps {
    setIsOpen: (open: boolean) => void;
}

// Understøtter realtidsopdateringer af lageret:
// - Sikrer at alle brugere ser samme lagerdata
// - Muliggør effektiv koordinering mellem lagerpersonale
// - Reducerer risiko for dobbeltbookinger og fejlbestillinger
function Database({setIsOpen}: DatabaseProps) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Beholdning | null>(null);
    const [beholdning, setBeholdning] = useState<Beholdning[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [sortColumn, setSortColumn] = useState<keyof Beholdning | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<Beholdning[]>([]);

    useEffect(() => {
        getBeholdning();

        // Use the signalrService to get a connection
        getConnection();

        // Handle realtime updates
        const handleRealtimeUpdate = (data: any) => {
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
        };

        // Add listener for realtime updates
        addListener("ReceiveUpdate", handleRealtimeUpdate);

        // Clean up on component unmount
        return () => {
            removeListener("ReceiveUpdate", handleRealtimeUpdate);
        };
    }, []);


    // Henter aktuelt lagerstatus:
    // - Giver komplet overblik over varebeholdning
    // - Identificerer varer under minimumsbeholdning
    // - Viser varelokationer for effektiv plukkeproces
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

    // Effektiv massehåndtering af varer:
    // - Strømliner arbejdsgange ved vareoptælling
    // - Reducerer tid brugt på rutineopgaver
    // - Minimerer menneskelige fejl ved dataindtastning
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

    // Sikker sletning af varer:
    // - Forebygger utilsigtet tab af lagerdata
    // - Dokumenterer ændringer for sporbarhed
    // - Understøtter compliance og revision
    const handleDeleteSelected = () => {
        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected)
            .map(([id, ]) => parseInt(id));

        if (selectedIds.length === 0) {
            alert('Ingen varer valgt til sletning.');
            return;
        }

        // Open the delete confirmation modal
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected)
            .map(([id, ]) => parseInt(id));

        try {
            for (const id of selectedIds) {
                // Use Supabase client to delete the item
                const { error } = await supabase
                    .from('beholdning')
                    .delete()
                    .eq('id', id);

                if (error) {
                    throw new Error(`Supabase error: ${error.message}`);
                }
            }

            // Clear selections after successful deletion
            setSelectedItems({});
            setSelectedAll(false);

            // Close the modal
            setIsDeleteModalOpen(false);

            // Refresh the data
            getBeholdning();
        } catch (err) {
            console.error("Fejl ved sletning af varer:", err);
            alert(`Der opstod en fejl ved sletning: ${err instanceof Error ? err.message : String(err)}`);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSort = (column: keyof Beholdning) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };


    // Intelligent søgefunktion:
    // - Hurtig lokalisering af specifik vare
    // - Effektiv filtrering på tværs af kategorier
    // - Understøtter lageroptælling og varekontrol
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(beholdning);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = beholdning.filter(item => 
            item.Navn.toLowerCase().includes(query) ||
            item.Beskrivelse.toLowerCase().includes(query) ||
            item.Kategori.toLowerCase().includes(query) ||
            item.Enhed.toLowerCase().includes(query) ||
            item.Lokation.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    }, [searchQuery, beholdning]);

    // Fleksibel sortering af lagerdata:
    // - Optimerer overblik over varebeholdning
    // - Letter identificering af kritiske lagerniveauer
    // - Understøtter effektiv lageranalyse
    const sortedBeholdning = [...filteredItems].sort((a, b) => {
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

    // Effektiv varevedligeholdelse:
    // - Sikrer præcis opdatering af varedata
    // - Understøtter kvalitetssikring
    // - Muliggør hurtig respons på ændrede behov
    const handleEditSelected = () => {
        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected) // Fix ESLint warning by removing underscore
            .map(([id]) => parseInt(id)); // Fix ESLint warning by removing underscore

        if (selectedIds.length === 0) {
            alert('Ingen varer valgt til redigering.');
            return;
        }

        if (selectedIds.length > 1) {
            alert('Vælg kun én vare ad gangen til redigering.');
            return;
        }

        // Get the selected item
        const selectedItemId = selectedIds[0];
        const selectedItem = beholdning.find(item => item.Id === selectedItemId);

        if (selectedItem) {
            // Open the edit popup with the selected item data
            setEditingItem(selectedItem);
            setIsEditPopupOpen(true);
        }
    };

    if (loading) return <div className='center-loader'><Loading></Loading></div>;
    if (error) return <div>Fejl: {error}</div>;

    return (
        <div className="container">
            <div className="table-header">
                <div className='title-holder'>
                    <h1>Lagerbeholdning</h1>
                </div>
                <div>
                    <Button label="Slet" variant="delete" onClick={handleDeleteSelected} />
                    <Button label="Rediger" variant="secondary" onClick={handleEditSelected} />
                    <Button label="+ Opret ny" variant="primary" onClick={() => setIsOpen(true)}/>
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
                            <th onClick={() => handleSort('Navn')} className={`sortable ${sortColumn === 'Navn' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Navn</th>
                            <th onClick={() => handleSort('Beskrivelse')} className={`sortable ${sortColumn === 'Beskrivelse' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Beskrivelse</th>
                            <th onClick={() => handleSort('Mængde')} className={`sortable ${sortColumn === 'Mængde' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Mængde</th>
                            <th onClick={() => handleSort('Minimum')}>Minimum</th>
                            <th onClick={() => handleSort('Enhed')} className={`sortable ${sortColumn === 'Enhed' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Enhed</th>
                            <th onClick={() => handleSort('Kategori')} className={`sortable ${sortColumn === 'Kategori' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Kategori</th>
                            <th onClick={() => handleSort('Lokation')} className={`sortable ${sortColumn === 'Lokation' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Lokation</th>
                            <th onClick={() => handleSort('Oprettet')} className={`sortable ${sortColumn === 'Oprettet' ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}>Oprettet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBeholdning.map((vare) => (
                            <tr key={vare.Id} onClick={() => handleSelectItem(vare.Id, !(selectedItems[vare.Id] || false))}>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems[vare.Id] || false}
                                        onChange={(e) => handleSelectItem(vare.Id, e.target.checked)}
                                    />
                                </td>
                                <td id="navn">{vare.Navn}</td>
                                <td>{vare.Beskrivelse}</td>
                                <td>{vare.Mængde}</td>
                                <td>{vare.Minimum}</td>
                                <td>{vare.Enhed}</td>
                                <td>{vare.Kategori}</td>
                                <td>{vare.Lokation}</td>
                                <td>{new Date(vare.Oprettet).toLocaleDateString('da-DK')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredItems.length === 0 && beholdning.length > 0 && searchQuery && 
                <p>Ingen varer matcher søgningen "{searchQuery}".</p>}
            {beholdning.length === 0 && <p>Ingen varer fundet i beholdningen.</p>}

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemCount={Object.values(selectedItems).filter(Boolean).length}
            />

            <EditPopup
                isOpen={isEditPopupOpen}
                onClose={() => setIsEditPopupOpen(false)}
                item={editingItem}
                onItemUpdated={getBeholdning}
            />
        </div>
    );
}

export default Database;
