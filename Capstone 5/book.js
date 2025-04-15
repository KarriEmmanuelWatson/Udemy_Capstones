require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Home Route - Show all books
app.get('/', async (req, res) => {
  try {
    const sort = req.query.sort || 'created_at';
    const [books] = await db.query(
      `SELECT * FROM books ORDER BY ${sort === 'rating' ? 'rating DESC' : sort}`
    );
    res.render('index', { books, editBook: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

// Add a new book
app.post('/add', async (req, res) => {
  const { title, author, cover_id, rating, review, read_date } = req.body;
  try {
    await db.query(
      'INSERT INTO books (title, author, cover_id, rating, review, read_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, cover_id, rating, review, read_date]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add book');
  }
});

// Edit form route
app.get('/edit/:id', async (req, res) => {
  try {
    const [[editBook]] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    res.render('edit', { editBook });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load edit form');
  }
});

// Update book
app.post('/edit/:id', async (req, res) => {
  const { title, author, cover_id, rating, review, read_date } = req.body;
  try {
    await db.query(
      'UPDATE books SET title = ?, author = ?, cover_id = ?, rating = ?, review = ?, read_date = ? WHERE id = ?',
      [title, author, cover_id, rating, review, read_date, req.params.id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update book');
  }
});

// Delete book
app.post('/delete/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete book');
  }
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
