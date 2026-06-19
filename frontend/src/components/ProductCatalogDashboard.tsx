import React, { useState, useMemo } from 'react';
import { transformProductData, transformSearchProductData } from '../utils/productUtils';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

const PAGE_SIZE = 20;

interface Product {
  id: string;
  title: string;
  brand: string;
  itemNumber: string;
  programTypes: string[];
  price: number | null;
  warehousePrice: number | null;
  warehouseAvailability: string | null;
  marketingKeywords: string[];
  image: string | null;
  uri: string;
  inventoryStatus?: string;
}

interface ProductCatalogDashboardProps {
  rawData: any[];
  mode: 'deals' | 'search';
  searchTerm: string;
  viewMode: 'grid' | 'table';
}

export default function ProductCatalogDashboard({ rawData = [], mode = 'deals', searchTerm = '', viewMode = 'grid' }: ProductCatalogDashboardProps) {
  // State Management
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);
  const [clearanceScannerEnabled, setClearanceScannerEnabled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Parse and transform data using the correct transformer based on mode
  const data: Product[] = useMemo(() => {
    const transformer = mode === 'search' ? transformSearchProductData : transformProductData;
    return (rawData || []).map(transformer);
  }, [rawData, mode]);

  // Extract unique program types for filter
  const uniqueProgramTypes: string[] = useMemo(() => {
    const types = new Set<string>();
    data.forEach((item) => {
      item.programTypes.forEach((pt: string) => types.add(pt));
    });
    return Array.from(types).sort();
  }, [data]);

  // Filter and Sort Data
  const processedData = useMemo(() => {
    let filtered: Product[] = [...data];

    // 1. Text Search Filter (uses searchTerm passed from App)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.brand || '').toLowerCase().includes(q) ||
          (item.itemNumber || '').toLowerCase().includes(q)
      );
    }

    // 2. Program Types Filter
    if (selectedProgramTypes.length > 0) {
      filtered = filtered.filter((item) =>
        item.programTypes.some((pt: string) => selectedProgramTypes.includes(pt))
      );
    }

    // 3. Clearance Scanner
    if (clearanceScannerEnabled) {
      filtered = filtered.filter((item) => {
        const is97 = item.price && item.price.toFixed(2).endsWith('.97');
        const hasMarketing = item.marketingKeywords.some((kw: string) => kw.toLowerCase().includes('whilesupplieslast'));
        return is97 || hasMarketing;
      });
    }

    // 4. Sorting (skip in search mode — API handles sort order)
    if (mode !== 'search') {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key as keyof Product];
        let valB = b[sortConfig.key as keyof Product];

        // Handle missing/null values (push them to the bottom)
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        // Fallbacks for sorting strings
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, selectedProgramTypes, clearanceScannerEnabled, sortConfig, mode]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return processedData.slice(start, end);
  }, [processedData, currentPage]);

  // Handlers
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Content Section */}
        {mode === 'search' && searchTerm && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Results <span className="text-gray-500 font-normal">for &quot;{searchTerm}&quot;</span>
            </h2>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {processedData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No items found matching your criteria.</div>
          ) : viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedData.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col group">
                  <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`block h-64 bg-gray-100 relative p-4 flex items-center justify-center overflow-hidden transition-opacity ${mode === 'deals' ? 'group-hover:opacity-90' : ''}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </a>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.brand}</span>
                    <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`text-sm font-medium text-gray-900 line-clamp-2 mb-2 flex-1 ${mode === 'deals' ? 'hover:text-costco-blue hover:underline' : ''}`} title={item.title}>{item.title}</a>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      <span className="text-xs text-gray-500 pb-1">Item #{item.itemNumber}</span>
                      <div className="flex flex-col items-end">
                        {item.price ? (
                          <span className="font-bold text-lg text-costco-blue">${item.price.toFixed(2)}</span>
                        ) : (
                          <span className="text-xs text-gray-400 mb-1">Price N/A</span>
                        )}
                        {mode === 'search' ? (
                          item.inventoryStatus && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${item.warehouseAvailability === 'IN_STOCK'
                              ? 'text-green-700 bg-green-50 border border-green-200'
                              : 'text-red-700 bg-red-50 border border-red-200'
                              }`}>
                              {item.inventoryStatus === 'in stock' ? '✓ In Stock' : item.inventoryStatus}
                            </span>
                          )
                        ) : (
                          item.warehousePrice && (item.warehouseAvailability === 'LOW_STOCK' || item.warehouseAvailability === 'IN_STOCK') && (
                            <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded mt-0.5">In Warehouse: ${item.warehousePrice.toFixed(2)}</span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('title')}>
                      <div className="flex items-center">
                        Title
                        {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                      </div>
                    </th>
                    {mode === 'deals' ? (
                      <th scope="col" className="hidden sm:table-cell w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('brand')}>
                        <div className="flex items-center">
                          Brand
                          {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                        </div>
                      </th>
                    ) : null}
                    <th scope="col" className="hidden sm:table-cell w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('itemNumber')}>
                      <div className="flex items-center">
                        Item #
                        {sortConfig.key === 'itemNumber' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="w-24 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('price')}>
                      <div className="flex items-center justify-end">
                        {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />)}
                        Price
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-2 whitespace-nowrap">
                        {item.image ? (
                          <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`block h-20 w-20 flex-shrink-0 bg-white border rounded p-1 transition-opacity ${mode === 'deals' ? 'hover:opacity-80' : ''}`}>
                            <img src={item.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                          </a>
                        ) : (
                          <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">N/A</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`block text-sm font-medium text-gray-900 truncate ${mode === 'deals' ? 'hover:text-costco-blue hover:underline' : ''}`} title={item.title}>{item.title}</a>
                      </td>
                      {mode === 'deals' ? (
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                          <div className="text-sm text-gray-500 truncate" title={item.brand}>{item.brand}</div>
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col items-end gap-1">
                          {item.price ? (
                            <span className={item.price.toFixed(2).endsWith('.97') ? "text-costco-red font-bold" : "text-gray-900"}>
                              ${item.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                          {mode === 'search' ? (
                            item.inventoryStatus && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.warehouseAvailability === 'IN_STOCK'
                                ? 'text-green-700 bg-green-50 border border-green-200'
                                : 'text-red-700 bg-red-50 border border-red-200'
                                }`}>
                                {item.inventoryStatus === 'in stock' ? '✓ In Stock' : item.inventoryStatus}
                              </span>
                            )
                          ) : (
                            item.warehousePrice && (item.warehouseAvailability === 'LOW_STOCK' || item.warehouseAvailability === 'IN_STOCK') && (
                              <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">In Warehouse: ${item.warehousePrice.toFixed(2)}</span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {processedData.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * PAGE_SIZE + 1, processedData.length)}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, processedData.length)}</span> of{' '}
                  <span className="font-medium">{processedData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
