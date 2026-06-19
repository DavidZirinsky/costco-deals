import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import ProductCatalogDashboard from './components/ProductCatalogDashboard';
import WarehouseOnboarding from './components/WarehouseOnboarding';
import { LayoutGrid, List, Search } from 'lucide-react';

// Sort options that map to the backend SortEnum + SortDirection
const SEARCH_SORT_OPTIONS = [
  { label: 'Best Match', sortField: 'lastWeek', sortDirection: 'desc' },
  { label: 'Price: Low to High', sortField: 'sellPrice', sortDirection: 'asc' },
  { label: 'Price: High to Low', sortField: 'sellPrice', sortDirection: 'desc' },
  { label: 'Stock Status', sortField: 'inventoryStatus', sortDirection: 'asc' },
];

interface Warehouse {
  salesLocationId: string;
  name: { value: string }[];
}

function App() {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(() => {
    try {
      const stored = localStorage.getItem('costco_warehouse');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'deals' | 'search'>('deals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>('');
  const [searchSortIndex, setSearchSortIndex] = useState<number>(0); // index into SEARCH_SORT_OPTIONS
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (mode !== 'deals' || !warehouse) {
      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    // eslint-disable-next-line
    setLoading(true); 
    setError(null);

    fetch(`${API_URL}/costco?warehouse=${warehouse.salesLocationId}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const results = data?.searchResult?.results || [];
        setProducts(results);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching live data:', err);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [mode, warehouse, API_URL]);

  // Perform search API call
  const doSearch = useCallback((keyword: string, sortIdx: number) => {
    if (!keyword.trim() || !warehouse) return;

    setLoading(true);
    setError(null);
    setSearchSubmitted(true);
    setActiveSearchTerm(keyword.trim());

    const sort = SEARCH_SORT_OPTIONS[sortIdx];
    const params = new URLSearchParams({
      keyword: keyword.trim(),
      warehouse: warehouse.salesLocationId,
      sortField: sort.sortField,
      sortDirection: sort.sortDirection,
    });

    fetch(`${API_URL}/search?${params}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // New search response uses `items` array directly
        const results = data?.items || [];
        setProducts(results);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error searching:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL, warehouse]);

  // Search form submit (only used in search mode)
  const handleSearchSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (mode === 'search') {
      doSearch(searchQuery, searchSortIndex);
    }
  }, [searchQuery, searchSortIndex, doSearch, mode]);

  // Re-search when sort changes (only if already searched)
  const handleSortChange = useCallback((newIdx: number) => {
    setSearchSortIndex(newIdx);
    if (searchSubmitted && activeSearchTerm) {
      doSearch(activeSearchTerm, newIdx);
    }
  }, [searchSubmitted, activeSearchTerm, doSearch]);

  const handleModeSwitch = (newMode: 'deals' | 'search') => {
    if (newMode === mode) return;
    setMode(newMode);
    setProducts([]);
    setSearchQuery('');
    setSearchSubmitted(false);
    setActiveSearchTerm('');
    setSearchSortIndex(0);
    setError(null);
    if (newMode === 'search') {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  if (!warehouse) {
    return (
      <WarehouseOnboarding 
        onComplete={(selected: Warehouse) => {
          localStorage.setItem('costco_warehouse', JSON.stringify(selected));
          setWarehouse(selected);
        }} 
      />
    );
  }
                {console.log(JSON.stringify(warehouse))}

  return (
    <div className="App">
      {/* Mode Toggle Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
          
          {/* Top Row: Title & Toggle */}
          <div className="flex items-center justify-between">
            {/* Title - Top Left */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-costco-blue tracking-tight whitespace-nowrap">Dave&apos;s Dank Costco Discoveries</h1>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                📍 You&apos;re Shopping: {warehouse.name?.[0]?.value || 'Costco Warehouse'} 
                <button 
                  onClick={() => {
                    localStorage.removeItem('costco_warehouse');
                    setWarehouse(null);
                  }}
                  className="ml-2 text-costco-blue hover:underline text-xs"
                >
                  (Change)
                </button>
              </div>
            </div>

            {/* Toggle Pill */}
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner flex-shrink-0">
              <button
                onClick={() => handleModeSwitch('deals')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'deals'
                    ? 'bg-costco-blue text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔥 Deals & Clearance
              </button>
              <button
                onClick={() => handleModeSwitch('search')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'search'
                    ? 'bg-costco-blue text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔍 Search Warehouse Inventory
              </button>
            </div>
          </div>

          {/* Bottom Row: Search & View Toggle */}
          <div className="flex items-center gap-3 w-full">
            {/* Unified Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2 w-full items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={mode === 'search' ? "Search Costco warehouse products by name or item # (e.g. butter)..." : "Filter Title, Brand"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-costco-blue focus:border-costco-blue sm:text-sm transition-shadow"
                  autoFocus
                />
              </div>

              {/* Extra Controls based on Mode */}
              {mode === 'search' && (
                <>
                  <select
                    value={searchSortIndex}
                    onChange={(e) => handleSortChange(Number(e.target.value))}
                    className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-costco-blue focus:border-costco-blue cursor-pointer hidden sm:block"
                  >
                    {SEARCH_SORT_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={idx}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="px-5 py-2 bg-costco-red text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-costco-red focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-sm whitespace-nowrap"
                  >
                    Search
                  </button>
                </>
              )}
            </form>

            {/* View Toggle - Top Right */}
            <div className="flex bg-gray-100 p-1 rounded-lg ml-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-costco-blue' : 'text-gray-500 hover:text-gray-700'}`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm text-costco-blue' : 'text-gray-500 hover:text-gray-700'}`}
                title="Table View"
              >
                <List size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-costco-blue border-t-transparent mb-3"></div>
            <div className="text-lg text-costco-blue font-semibold">
              {mode === 'deals' ? 'Loading live deals...' : 'Searching Costco...'}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-costco-red mb-2">Failed to load data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Make sure your backend is running at {API_URL}</p>
          </div>
        </div>
      ) : mode === 'search' && !searchSubmitted ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-gray-600 p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Costco Products</h2>
            <p className="text-gray-500 leading-relaxed">
              Find in-warehouse prices, stock status, and product availability.
              Type a product name above and hit <span className="font-semibold text-costco-red">Search</span> to get started.
            </p>
          </div>
        </div>
      ) : (
        <ProductCatalogDashboard
          rawData={products}
          mode={mode}
          searchTerm={mode === 'search' ? activeSearchTerm : searchQuery}
          viewMode={viewMode}
        />
      )}
    </div>
  );
}

export default App;
