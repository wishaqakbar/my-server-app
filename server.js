const express = require('express');
const { scrapeAlJazeeraNews } = require('./crawlers/alj_crawler');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());

// Cache to store articles
let cachedArticles = [];
let lastUpdated = null;

// Function to refresh articles periodically
const refreshArticles = async () => {
  try {
    console.log('Refreshing news articles...');
    const articles = await scrapeAlJazeeraNews();
    cachedArticles = articles; // Update the cache
    lastUpdated = new Date(); // Record the last update time
    console.log('Articles refreshed successfully.');
  } catch (error) {
    console.error('Error refreshing articles:', error);
  }
};

// Initial fetch of articles
refreshArticles();

// Set up an interval to refresh the articles every 15 minutes
setInterval(refreshArticles, 15 * 60 * 1000); // 15 minutes in milliseconds

// API endpoint to serve the cached articles
app.get('/api/news', (req, res) => {
  if (cachedArticles.length === 0) {
    return res.status(500).json({ error: 'No articles available. Please try again later.' });
  }
  res.json({ articles: cachedArticles, lastUpdated });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
