const express = require('express');
const path = require('path');

const app = express();

// Use EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Sample in-memory post storage
let posts = [];
let id = 1;

// Home route – List all posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Create post form
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle post creation
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  posts.unshift({ id: id++, title, content });
  res.redirect('/');
});

// Edit post form
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  res.render('edit', { post });
});

// Handle post update
app.post('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  post.title = req.body.title;
  post.content = req.body.content;
  res.redirect('/');
});

// Delete post
app.post('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});