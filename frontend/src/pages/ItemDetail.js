import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();

    const loadItemDetail = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/items/' + id, { signal: ctrl.signal });

        if (!res.ok) {
          if (res.status === 404) {
            navigate('/');
          } else {
            Promise.reject(res)
          }
          return;
        }

        const data = await res.json();
        setItem(data);
      } catch (error) {
        if (error.name === 'AbortError') return;

        console.error(error);
        setError(true);
      }
    };

    loadItemDetail();

    return () => ctrl.abort();
  }, [id, navigate]);

  if (!item) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-gray-600 text-lg font-light">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
          {item.name}
        </h2>

        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Category</p>
            <p className="text-gray-900 text-lg">{item.category}</p>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Price</p>
            <p className="text-gray-900 text-2xl font-medium">${item.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
