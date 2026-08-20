import React from 'react';
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';

function BooksPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/books')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        return response.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="status-message">Loading books...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h1>Browse the collection</h1>
        <p>Explore books currently held by the college library.</p>
      </div>

      {data.length === 0 && <p className="status-message">No books found.</p>}

      <div className="books-grid">
        {data.map((book) => (
          <BookCard
            key={book._id || book.isbn}
            title={book.title}
            author={book.author}
            category={book.category}
            available={book.available}
          />
        ))}
      </div>
    </div>
  );
}

export default BooksPage;
