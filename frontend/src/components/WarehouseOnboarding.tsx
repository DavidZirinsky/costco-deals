import React, { useState, FormEvent } from 'react';
import { Search, MapPin, Clock, Navigation } from 'lucide-react';

interface Warehouse {
  salesLocationId: string;
  name: { value: string }[][];
  distance: number;
  distanceUnit: string;
  address: {
    line1: string;
    city: string;
    territory: string;
    postalCode: string;
  };
  hours: { close: string }[];
}

interface WarehouseOnboardingProps {
  onComplete: (warehouse: Warehouse) => void;
}

export default function WarehouseOnboarding({ onComplete }: WarehouseOnboardingProps) {
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);
    setWarehouses([]);

    try {
      const response = await fetch(`${API_URL}/warehouses?location=${encodeURIComponent(location.trim())}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations (Status: ${response.status})`);
      }
      const data = await response.json();
      
      const results = data?.salesLocations || [];
      if (results.length === 0) {
        setError("No warehouses found near that location. Try another city or zip code.");
      } else {
        setWarehouses(results);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while searching for warehouses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (warehouse: Warehouse) => {
    onComplete(warehouse);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6 font-sans relative">
      
      {/* Site Title */}
      <div className="absolute top-6 left-6">
        <h1 className="text-xl font-bold text-costco-blue tracking-tight whitespace-nowrap">Dave&apos;s Dank Costco Discoveries</h1>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl p-8 md:p-12 border border-white/50 mt-12 md:mt-0">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-costco-blue to-blue-500 text-white mb-6 shadow-lg shadow-blue-500/30 transform transition hover:scale-105">
            <MapPin size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-costco-blue to-blue-600">Costco</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Discover exclusive local clearance deals and live inventory. Enter your city, state, or zip code to get started.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-10 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-costco-blue transition-colors" />
          </div>
          <input
            type="text"
            placeholder="e.g., Denver, CO or 80202"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full pl-14 pr-36 py-5 text-lg text-gray-900 bg-white/80 border-2 border-transparent rounded-2xl shadow-inner placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-costco-blue focus:bg-white transition-all backdrop-blur-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!location.trim() || loading}
            className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-costco-blue to-blue-600 hover:from-blue-600 hover:to-costco-blue text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-costco-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center"
          >
            {loading ? (
              <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50/80 border-l-4 border-red-500 rounded-r-xl text-red-700 font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {warehouses.length > 0 && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl font-bold text-gray-800 mb-4 px-1">Nearby Warehouses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((wh) => (
                <button
                  key={wh.salesLocationId}
                  onClick={() => handleSelect(wh)}
                  className="text-left bg-white/90 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-costco-blue/30 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-costco-blue transition-colors leading-tight">
                      {wh.name?.[0]?.[0]?.value || 'Costco Warehouse'}
                    </h4>
                    {wh.distance && (
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-blue-50 text-costco-blue rounded-full whitespace-nowrap">
                        <Navigation size={12} className="mr-1" />
                        {wh.distance.toFixed(1)} {wh.distanceUnit}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {wh.address?.line1}<br />
                    {wh.address?.city}, {wh.address?.territory} {wh.address?.postalCode}
                  </p>

                  {wh.hours && wh.hours.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                      <Clock size={14} className="mr-1.5" />
                      <span>Closes {wh.hours[0]?.close?.substring(0, 5) || 'N/A'}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
