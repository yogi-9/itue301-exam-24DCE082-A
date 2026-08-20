const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const Book = require('./models/Book');
const Member = require('./models/Member');
const Borrowing = require('./models/Borrowing');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


function requestLogger(req, res, next) {
  console.log(
    `[${req.method}] ${req.path} [${new Date().toISOString()}]`
  );

  next();
}

app.use(requestLogger);

const books = [
  {
    id: 1,
    title: 'JavaScript Basics',
    author: 'John Smith',
    category: 'Programming',
    isbn: 'ISBN001',
    available: true
  },
  {
    id: 2,
    title: 'React Guide',
    author: 'David Brown',
    category: 'Web Development',
    isbn: 'ISBN002',
    available: false
  }
];

const borrowings = [];

app.get('/api/v1/books', (req, res) => {
  res.status(200).json(books);
});


// GET all borrowing records
app.get('/api/v1/borrowings', (req, res) => {
  res.status(200).json(borrowings);
});


// POST new borrowing record
app.post('/api/v1/borrowings', (req, res) => {
  const {
    memberName,
    bookTitle,
    borrowDate,
    returnDate,
    status = 'borrowed'
  } = req.body;

  if (!memberName || !bookTitle || !borrowDate || !returnDate) {
    return res.status(400).json({
      error: 'All borrowing fields are required'
    });
  }

  if (!['borrowed', 'returned', 'overdue'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid borrowing status',
      allowedStatuses: ['borrowed', 'returned', 'overdue']
    });
  }

  const newBorrowing = {
    id: borrowings.length + 1,
    memberName,
    bookTitle,
    borrowDate,
    returnDate,
    status
  };

  borrowings.push(newBorrowing);

  res.status(201).json(newBorrowing);
});



if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((error) => {
      console.log('MongoDB connection error:', error.message);
    });
} else {
  console.warn(
    'MONGO_URI is not configured. Copy .env.example to .env to enable MongoDB routes.'
  );
}


app.post('/api/v1/mongodb/books', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/mongodb/books', async (req, res, next) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});


// Update a book
app.put('/api/v1/mongodb/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});


app.delete('/api/v1/mongodb/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});


app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate value already exists'
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid identifier',
      message: `Invalid value for ${err.path}`
    });
  }

  res.status(500).json({
    error: 'Something went wrong'
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});