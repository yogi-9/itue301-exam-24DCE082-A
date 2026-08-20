import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="welcome">
      <h1>Library Book Management System</h1>
      <p>View books and record borrowing details.</p>
      <div className="welcome-actions">
        <Link className="button-link" to="/books">View books</Link>
        <Link className="button-link" to="/borrow">Borrow book</Link>
      </div>
    </div>
  );
}

export default HomePage;