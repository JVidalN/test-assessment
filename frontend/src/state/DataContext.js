import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const fetchItems = useCallback(async (signal, page, searchTerm) => {
    setLoading(true);
    try {

      const query = new URLSearchParams({
        page,
        limit,
        ...(searchTerm && { q: searchTerm })
      });

      const res = await fetch(`http://localhost:3001/api/items?${query}`, { signal }); // Intentional bug: backend ignores limit

      if (!res.ok) throw new Error('Failed to fetch');

      const json = await res.json();

      const fetchedItems = Array.isArray(json) ? json : json.items;
      const total = json.total ?? fetchedItems.length;

      setItems(fetchedItems);
      setTotalItems(total);

    } catch (error) {
      if (error.name === 'AbortError') {
        // This block doesn't need action because the request was cancelled on unmount 
        return;
      }
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <DataContext.Provider value={{
      items,
      page,
      setPage,
      totalPages,
      totalItems,
      limit,
      loading,
      fetchItems,
      searchTerm,
      setSearchTerm
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
