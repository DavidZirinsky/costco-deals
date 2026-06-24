import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { transformProductData, transformSearchProductData } from '../utils/productUtils';
import { ChevronUp, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';

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
  category?: string;
}

interface ProductCatalogDashboardProps {
  rawData: any[];
  mode: 'deals' | 'search';
  searchTerm: string;
  viewMode: 'grid' | 'table';
  dealsSortConfig: { key: string; direction: string };
  onDealsSortChange: (key: string, direction: string) => void;
}

export default function ProductCatalogDashboard({ 
  rawData = [], mode = 'deals', searchTerm = '', viewMode = 'grid',
  dealsSortConfig = { key: 'title', direction: 'asc' }, onDealsSortChange = () => {}
}: ProductCatalogDashboardProps) {
  // State Management
  const [selectedProgramTypes, setSelectedProgramTypes] = useState<string[]>([]);

  const [clearanceScannerEnabled, setClearanceScannerEnabled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 250;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  // Extract unique categories for filter
  const uniqueCategories: string[] = useMemo(() => {
    const categories = new Set<string>();
    data.forEach((item) => {
      if (item.category && item.category !== 'Other' && item.category !== '') {
        categories.add(item.category);
      }
    });
    return ['All', ...Array.from(categories).sort()];
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

    // 4. Category Filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 4. Sorting (skip in search mode — API handles sort order)
    if (mode !== 'search') {
      filtered.sort((a, b) => {
        let valA = a[dealsSortConfig.key as keyof Product];
        let valB = b[dealsSortConfig.key as keyof Product];

        // Handle missing/null values (push them to the bottom)
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        // Fallbacks for sorting strings
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return dealsSortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return dealsSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, selectedProgramTypes, clearanceScannerEnabled, dealsSortConfig, mode, selectedCategory]);

  // Detect mobile for infinite scroll vs pagination
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pagination
  const totalPages = Math.ceil(processedData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    if (isMobile) {
      // Infinite scroll: show all items up to current page
      return processedData.slice(0, currentPage * PAGE_SIZE);
    }
    // Desktop: traditional single-page view
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return processedData.slice(start, end);
  }, [processedData, currentPage, isMobile]);

  const hasMore = currentPage < totalPages;

  // Reset page when sort config or filters change
  useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1);
  }, [dealsSortConfig, searchTerm, selectedProgramTypes, clearanceScannerEnabled, rawData, selectedCategory]);

  // Infinite scroll observer
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadMore = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  useEffect(() => {
    if (!isMobile || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isMobile, loadMore]);

  // Reset page when sort config changes from parent
  React.useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1);
  }, [dealsSortConfig]);

  // Handlers
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (dealsSortConfig.key === key && dealsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onDealsSortChange(key, direction);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Content Section */}
        {mode === 'search' && searchTerm && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Results <span className="text-gray-500 font-normal">for &quot;{searchTerm}&quot;</span>
            </h2>
          </div>
        )}

        {/* Category Scroll Bar */}
        {uniqueCategories.length > 1 && (
          <div className="flex items-center gap-2 mb-2 w-full">
            <button 
              onClick={() => scrollCategories('left')} 
              className="p-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 flex-shrink-0 focus:outline-none"
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div 
              ref={categoryScrollRef}
              className="overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide flex-1"
            >
              <div className="flex space-x-2">
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors border flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-costco-blue text-white border-costco-blue shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => scrollCategories('right')} 
              className="p-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 flex-shrink-0 focus:outline-none"
              aria-label="Scroll categories right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Removed Sorting Dropdown for Grid View from here, moved to App.tsx Header */}

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
                    <th scope="col" className="w-20 sm:w-32 px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('title')}>
                      <div className="flex items-center">
                        Title
                        {dealsSortConfig.key === 'title' && (dealsSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                      </div>
                    </th>
                    {mode === 'deals' ? (
                      <th scope="col" className="hidden sm:table-cell w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('brand')}>
                        <div className="flex items-center">
                          Brand
                          {dealsSortConfig.key === 'brand' && (dealsSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                        </div>
                      </th>
                    ) : null}
                    <th scope="col" className="hidden sm:table-cell w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('itemNumber')}>
                      <div className="flex items-center">
                        Item #
                        {dealsSortConfig.key === 'itemNumber' && (dealsSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="w-24 sm:w-44 px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group" onClick={() => handleSort('price')}>
                      <div className="flex items-center justify-end">
                        {dealsSortConfig.key === 'price' && (dealsSortConfig.direction === 'asc' ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />)}
                        Price
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-6 py-2 whitespace-nowrap">
                        {item.image ? (
                          <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`block h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 bg-white border rounded p-1 transition-opacity ${mode === 'deals' ? 'hover:opacity-80' : ''}`}>
                            <img src={item.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                          </a>
                        ) : (
                          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">N/A</div>
                        )}
                      </td>
                      <td className="px-2 sm:px-6 py-4 overflow-hidden text-ellipsis">
                        <a {...(mode === 'deals' ? { href: item.uri, target: "_blank", rel: "noreferrer" } : {})} className={`block text-sm font-medium text-gray-900 line-clamp-2 sm:truncate ${mode === 'deals' ? 'hover:text-costco-blue hover:underline' : ''}`} title={item.title}>{item.title}</a>
                      </td>
                      {mode === 'deals' ? (
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                          <div className="text-sm text-gray-500 truncate" title={item.brand}>{item.brand}</div>
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemNumber}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-right text-sm font-medium">
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
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${item.warehouseAvailability === 'IN_STOCK'
                                ? 'text-green-700 bg-green-50 border border-green-200'
                                : 'text-red-700 bg-red-50 border border-red-200'
                                }`}>
                                {item.inventoryStatus === 'in stock' ? '✓ In Stock' : item.inventoryStatus}
                              </span>
                            )
                          ) : (
                            item.warehousePrice && (item.warehouseAvailability === 'LOW_STOCK' || item.warehouseAvailability === 'IN_STOCK') && (
                              <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded whitespace-nowrap">in Warehouse: ${item.warehousePrice.toFixed(2)}</span>
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

        {/* Infinite scroll sentinel for mobile */}
        {isMobile && hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-6">
            <div className="text-sm text-gray-400 animate-pulse">Loading more...</div>
          </div>
        )}
        {isMobile && !hasMore && processedData.length > PAGE_SIZE && (
          <div className="flex justify-center py-4">
            <span className="text-xs text-gray-400">All {processedData.length} items loaded</span>
          </div>
        )}

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
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
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
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
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
