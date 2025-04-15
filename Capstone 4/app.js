const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { results: null, error: null });
});

app.post('/search', async (req, res) => {
  const term = req.body.term;

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: term,
        entity: 'song',
        limit: 10,
        country: 'IN'
      }
    });

    const results = response.data.results;
    res.render('index', { results, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { results: null, error: 'Something went wrong. Please try again.' });
  }
});

app.listen(3001, () => {
  console.log('🎧 Server running at http://localhost:3001');
});
