import React from 'react';
import { useEffect, useState } from 'react';

function BorrowPage() {
  const [memberName, setMemberName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function getMemberName(borrowing) {
    if (borrowing.memberName && !['borrowed', 'returned', 'overdue'].includes(borrowing.memberName)) {
      return borrowing.memberName;
    }

    return borrowing.memberId || 'Member name unavailable';
  }

  function getBookTitle(borrowing) {
    if (borrowing.bookTitle && !['borrowed', 'returned', 'overdue'].includes(borrowing.bookTitle)) {
      return borrowing.bookTitle;
    }

    return borrowing.bookId || 'Book title unavailable';
  }

  function isCompleteBorrowing(borrowing) {
    return Boolean(
      borrowing.memberName &&
      borrowing.bookTitle &&
      !['borrowed', 'returned', 'overdue'].includes(borrowing.memberName) &&
      !['borrowed', 'returned', 'overdue'].includes(borrowing.bookTitle)
    );
  }

  useEffect(() => {
    fetch('/api/v1/borrowings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load borrowing data');
        }

        return response.json();
      })
      .then((borrowingList) => {
        setBorrowings(borrowingList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    fetch('/api/v1/borrowings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberName, bookTitle, borrowDate, returnDate })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to save borrowing');
        }

        return response.json();
      })
      .then((borrowing) => {
        setBorrowings((current) => [borrowing, ...current]);
        setMessage('Borrowing recorded successfully.');
        setMemberName('');
        setBookTitle('');
        setBorrowDate('');
        setReturnDate('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  if (loading) {
    return <p className="status-message">Loading borrowing data...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h1>Borrow a book</h1>
        <p>Choose an available title and enter the borrowing dates.</p>
      </div>

      {error && <p className="error-message" role="alert">Error: {error}</p>}
      {message && <p className="status-message" role="status">{message}</p>}

      <div className="borrow-layout">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Borrowing details</h2>
          <label htmlFor="memberName">Member name</label>
          <input
            id="memberName"
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            required
          />

          <label htmlFor="bookTitle">Book title</label>
          <input
            id="bookTitle"
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />

          <label htmlFor="borrowDate">Borrow Date</label>
          <input
            id="borrowDate"
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            required
          />

          <label htmlFor="returnDate">Return Date</label>
          <input
            id="returnDate"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Record borrowing'}
          </button>
        </form>

        <section className="panel">
          <h2>Recent borrowings</h2>
          {borrowings.filter(isCompleteBorrowing).length === 0 ? (
            <p>No borrowing records found.</p>
          ) : (
            <ul className="borrowing-list">
              {borrowings.filter(isCompleteBorrowing).map((borrowing) => (
                <li key={borrowing.id}>
                  <strong>{getMemberName(borrowing)}</strong> borrowed{' '}
                  <strong>{getBookTitle(borrowing)}</strong>
                  <br />
                  Status: {borrowing.status} | Borrowed: {borrowing.borrowDate} | Return: {borrowing.returnDate}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default BorrowPage;