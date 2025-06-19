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

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;
