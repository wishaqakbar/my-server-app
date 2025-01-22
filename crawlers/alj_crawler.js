const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAlJazeeraNews() {
  const url = 'https://www.aljazeera.com/news/';

  try {
    // Fetch the HTML content of the news page
    const { data: html } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Target the section with class "news-feed-container"
    const articles = [];
    $('section#news-feed-container article').each((_, article) => {
      const title = $(article).find('h3 a').text().trim() || 'No Title Found';
      const link = $(article).find('h3 a').attr('href')
        ? `https://www.aljazeera.com${$(article).find('h3 a').attr('href')}`
        : 'No Link Found';
      let image = $(article).find('img').attr('src') || 'No Image Found';

      // Check if the image URL is relative and prepend the domain
      if (image && image.startsWith('/')) {
        image = `https://www.aljazeera.com${image}`;
      }
      const description = $(article).find('p').text().trim() || 'No Description Found';

      articles.push({ title, link, image, description });
    });

    if (articles.length === 0) {
      console.error('No articles found!');
      return;
    }

    // Log or return the scraped articles
    console.log('Scraped Articles:', JSON.stringify(articles, null, 2));
    return articles;
  } catch (error) {
    console.error('Error scraping the news page:', error.message);
  }
}

// Run the scraper
scrapeAlJazeeraNews();
exports.scrapeAlJazeeraNews = scrapeAlJazeeraNews;
