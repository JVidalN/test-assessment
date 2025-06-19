import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-2xl font-light text-gray-800 hover:text-blue-600 transition-colors duration-200">
            Items
          </Link>
        </div>
      </nav>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </DataProvider>
  );
}

export default App;
