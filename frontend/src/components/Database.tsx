import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Loading from "../components/Loading";
import { getConnection, addListener, removeListener } from "../services/signalrService";
import "../styles/Database.css";
import { supabase } from "../lib/supabase";
import { getApiUrl, API_ENDPOINTS } from "../lib/apiConfig";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditPopup from "./EditPopup";
import { useToast } from "./Toast";

// Interface der afspejler strukturen i beholdning-tabellen
// used for type safety. Good practice
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
    setisOpen: (isOpen: boolean) => void;
    selectedLocation?: string | null;
    isAuthenticated: boolean;
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

// Component
function Database({setisOpen, selectedLocation, isAuthenticated}: DatabaseProps) {
    const { showToast } = useToast();
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


    async function getBeholdning() {
        try {
            setLoading(true);
            const response = await fetch(getApiUrl(API_ENDPOINTS.BEHOLDNING), {
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
                setError(`Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på ${getApiUrl('')}`);
            } else {
                setError(`Der opstod en fejl ved hentning af data: ${err instanceof Error ? err.message : String(err)}`);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAuthenticated) {
            showToast('Du skal være logget ind for at vælge varer.', 'warning');
            return;
        }

        const isChecked = event.target.checked;
        setSelectedAll(isChecked);

        const newSelectedItems: { [key: number]: boolean } = {};
        beholdning.forEach(item => {
            newSelectedItems[item.Id] = isChecked;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleSelectItem = (Id: number, checked: boolean) => {
        if (!isAuthenticated) {
            showToast('Du skal være logget ind for at vælge varer.', 'warning');
            return;
        }

        setSelectedItems(prev => ({
            ...prev,
            [Id]: checked
        }));
    };

    const handleDeleteSelected = () => {
        if (!isAuthenticated) {
            showToast('Du skal være logget ind for at slette varer.', 'warning');
            return;
        }

        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected)
            .map(([id, ]) => parseInt(id));

        if (selectedIds.length === 0) {
            showToast('Ingen varer valgt til sletning.', 'warning');
            return;
        }

        // Open the delete confirmation modal
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!isAuthenticated) {
            showToast('Du skal være logget ind for at slette varer.', 'warning');
            setIsDeleteModalOpen(false);
            return;
        }

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
            showToast(`Der opstod en fejl ved sletning: ${err instanceof Error ? err.message : String(err)}`, 'error');
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


    // Filter by location if selected
    const filteredBeholdning = selectedLocation 
        ? beholdning.filter(item => item.Lokation === selectedLocation)
        : beholdning;

    // Sort the filtered data
    const sortedBeholdning = [...filteredBeholdning].sort((a, b) => {
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

    const handleEditSelected = () => {
        if (!isAuthenticated) {
            showToast('Du skal være logget ind for at redigere varer.', 'warning');
            return;
        }

        const selectedIds = Object.entries(selectedItems)
            .filter(([, isSelected]) => isSelected) // Fix ESLint warning by removing underscore
            .map(([id]) => parseInt(id)); // Fix ESLint warning by removing underscore

        if (selectedIds.length === 0) {
            showToast('Ingen varer valgt til redigering.', 'warning');
            return;
        }

        if (selectedIds.length > 1) {
            showToast('Vælg kun én vare ad gangen til redigering.', 'warning');
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

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
        }
    }, [error, showToast]);

    if (loading) return <div className='center-loader'><Loading></Loading></div>;

    return (
        <div className="container">
            <div className="table-header">
                <div className='title-holder'>
                    <h1>Lagerbeholdning</h1>
                    {!isAuthenticated && (
                        <p className="auth-message">Log ind for at redigere lagerbeholdningen</p>
                    )}
                </div>
                <div>
                    {isAuthenticated ? (
                        <>
                            <Button label="Slet" variant="delete" onClick={handleDeleteSelected} />
                            <Button label="Rediger" variant="secondary" onClick={handleEditSelected} />
                            <Button label="+ Opret ny" variant="primary" onClick={() => setisOpen(true)}/>
                        </>
                    ) : null}
                </div>
            </div>


            <div className="table-scroll-wrapper">
                <table className="beholdning-tabel">
                    <thead>
                        <tr>
                            {isAuthenticated && (
                                <th><input type="checkbox" checked={selectedAll} onChange={handleSelectAll} /></th>
                            )}
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
                            <tr 
                                key={vare.Id} 
                                onClick={isAuthenticated ? () => handleSelectItem(vare.Id, !(selectedItems[vare.Id] || false)) : undefined}
                                className={isAuthenticated ? "selectable-row" : ""}
                            >
                                {isAuthenticated && (
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems[vare.Id] || false}
                                            onChange={(e) => handleSelectItem(vare.Id, e.target.checked)}
                                        />
                                    </td>
                                )}
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
