import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BorrowPage from './pages/BorrowPage';

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrow" element={<BorrowPage />} />
        </Routes>
      </main>
    </>
  );
}


export default App;