// shopify-proxy.js
// Express backend proxy for Shopify Admin API
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN; // e.g. mystore.myshopify.com

if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
  console.error('Missing Shopify credentials in .env');
  process.exit(1);
}

// Proxy endpoint for Shopify Admin API
app.post('/shopify-admin', async (req, res) => {
  const { path, method = 'GET', data = {}, params = {} } = req.body;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/${path}`;
  try {
    const response = await axios({
      url,
      method,
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      data,
      params,
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || null,
    });
  }
});

const PORT = process.env.SHOPIFY_PROXY_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Shopify proxy running on port ${PORT}`);
});
