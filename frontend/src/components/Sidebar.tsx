// Sidebar.tsx
import { useState, useEffect } from "react";
import '../styles/Leftside.css';
import { getConnection, addListener, removeListener } from "../services/signalrService";
import { getApiUrl, API_ENDPOINTS } from "../lib/apiConfig";

interface SidebarProps {
  onLocationChange?: (location: string | null) => void;
}

export function Sidebar({ onLocationChange }: SidebarProps) {
  const [totalStock, setTotalStock] = useState<number>(0);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    // Fetch total stock count and available locations
    const fetchStockData = async () => {
      try {
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

        // Calculate total stock
        const total = data.reduce((sum: number, item: any) => sum + item.Mængde, 0);
        setTotalStock(total);

        // Extract unique locations
        const uniqueLocations = [...new Set(data.map((item: any) => item.Lokation))].filter(Boolean);
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();

    // Use the signalrService to get a connection
    getConnection();

    // Handle realtime updates
    const handleRealtimeUpdate = (data: any) => {
      console.log("Sidebar received realtime update:", data);

      // Refresh data when any change occurs
      fetchStockData();
    };

    // Add listener for realtime updates
    addListener("ReceiveUpdate", handleRealtimeUpdate);

    // Clean up on component unmount
    return () => {
      removeListener("ReceiveUpdate", handleRealtimeUpdate);
    };
  }, []);

  const handleLocationClick = (location: string | null) => {
    setActiveLocation(location);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  return (
    <div className="stock-leftside">
      {/* Total Stock Display */}
      <div className="total-stock-container">
        <h3>Lagerbeholdning</h3>
        <div className="total-stock-value">{totalStock}</div>
      </div>

      {/* Location Tabs */}
      <div className="location-tabs">
        <div 
          className={`location-tab ${activeLocation === null ? 'active' : ''}`}
          onClick={() => handleLocationClick(null)}
        >
          Alle lokationer
        </div>
        {locations.map((location) => (
          <div 
            key={location}
            className={`location-tab ${activeLocation === location ? 'active' : ''}`}
            onClick={() => handleLocationClick(location)}
          >
            {location}
          </div>
        ))}
      </div>

    </div>
  );
}
