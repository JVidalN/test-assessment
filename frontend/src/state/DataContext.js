import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (signal) => {
    try {

      const res = await fetch('http://localhost:3001/api/items?limit=500', { signal }); // Intentional bug: backend ignores limit

      if (!res.ok) throw new Error('Failed to fetch');

      const json = await res.json();
      setItems(json);

    } catch (error) {
      if (error.name === 'AbortError') {
        // This block doesn't need action because the request was cancelled on unmount 
        return;
      }
      console.error('Fetch error:', error);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
