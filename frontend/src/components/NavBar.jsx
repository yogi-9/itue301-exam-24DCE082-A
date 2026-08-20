import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h2>Campus Library</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/borrow">Borrow</Link>
      </div>
    </nav>
  );
}

export default Navbar;