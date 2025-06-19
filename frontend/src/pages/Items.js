import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const {
    items,
    page,
    setPage,
    totalPages,
    loading,
    fetchItems,
    searchTerm,
    setSearchTerm
  } = useData();


  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchItems(ctrl.signal, page, searchTerm);
    return () => ctrl.abort();
  }, [page, fetchItems, searchTerm]);

  const handleSearchInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = () => {
    setSearchTerm(inputValue);
    setPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (!Array.isArray(items)) return <p>Data not found</p>;

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={handleSearchInput}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearchSubmit}>Search</button>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default Items;
