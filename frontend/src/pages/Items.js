import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-600 text-lg font-light">Loading...</div>
      </div>
    );
  }
  if (!Array.isArray(items)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-600 text-lg font-light">Data not found</div>
      </div>
    );
  }

  const Row = ({ index, style, data }) => {
    const item = data[index];
    return (
      <div style={style} key={item.id} className="flex items-center px-4">
        <Link
          to={'/items/' + item.id}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 py-2 block w-full text-left"
        >
          {item.name}
        </Link>
      </div>
    );
  };


  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <input
              type="text"
              placeholder="Search..."
              value={inputValue}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              className="flex-1 px-6 py-4 text-gray-700 bg-transparent rounded-full outline-none text-lg"
            />
            <button
              onClick={handleSearchSubmit}
              className="mr-2 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
        <List
          height={400}
          itemCount={items.length}
          itemSize={50}
          width={'100%'}
          itemData={items}
        >
          {Row}
        </List>
      </div>
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Prev
        </button>
        <span className="text-gray-600 font-medium px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;
