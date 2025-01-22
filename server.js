const express = require('express');
const { scrapeAlJazeeraNews } = require('./crawlers/alj_crawler');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const articles = await scrapeAlJazeeraNews();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
