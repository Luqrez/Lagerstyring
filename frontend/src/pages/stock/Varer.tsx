import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import Database from '../../components/Database';
import PopupDB from '../../components/PopupDB';
import '../../styles/Stock.css';
import { useAuth } from '../../contexts/AuthContext';

function StockVarer() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const { user } = useAuth();

    const handleLocationChange = (location: string | null) => {
        setSelectedLocation(location);
    };

    return (
        <div className="stock-container">
            <div className="stock-sidebar">
                <Sidebar onLocationChange={handleLocationChange} />
            </div>
            <div className="stock-content">
                <Database setisOpen={setIsOpen} selectedLocation={selectedLocation} isAuthenticated={!!user} />
                {user && <PopupDB isOpen={isOpen} setIsOpen={setIsOpen} />}
            </div>
        </div>
    );
}

export default StockVarer;
