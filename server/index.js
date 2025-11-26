import express from 'express';
import cors from 'cors';
import booksRouter from './routes/books.js';
import bookDetailRouter from './routes/bookDetail.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', booksRouter);
app.use('/', bookDetailRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Books API: http://localhost:${PORT}/kr-books, /us-books, /jp-books`);
  console.log(`📖 Book Detail API: http://localhost:${PORT}/kr-book-detail, /us-book-detail, /jp-book-detail`);
});

