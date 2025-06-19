import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    const ctrl = new AbortController();

    // Intentional bug: setState called after component unmount if request is slow
    fetchItems(ctrl.signal).catch(console.error);

    // Clean‑up to avoid memory leak (candidate should implement)
    return () => {
      ctrl.abort();
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;
