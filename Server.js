const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 10000;

// Homepage with URL input
app.get('/', (req, res) => {
  res.send(`
    <h2>Web Proxy</h2>
    <form method="GET" action="/proxy">
      <input name="url" placeholder="https://example.com" style="width:300px">
      <button type="submit">Go</button>
    </form>
  `);
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.send("No URL provided.");

  try {
    const response = await fetch(target);
    let body = await response.text();

    // Rewrite relative links (simple version)
    body = body.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
      if (url.startsWith('http')) return match;
      return `${attr}="${target}${url}"`;
    });

    res.send(body);
  } catch (err) {
    res.send("Failed to load page: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
