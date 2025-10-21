// finnhub.js
import axios from 'axios';

const API_KEY = 'd343f8pr01qqt8snc1g0d343f8pr01qqt8snc1gg';
const BASE_URL = 'https://finnhub.io/api/v1';

export const getQuote = async (symbol) => {
  try {
    const res = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching quote:', err);
    return null;
  }
};

export const getHistorical = async (symbol, resolution = 'D', days = 7) => {
  try {
    const now = Math.floor(Date.now() / 1000); // current timestamp
    const past = now - days * 86400;

    const res = await axios.get(`${BASE_URL}/stock/candle`, {
      params: {
        symbol,
        resolution, // 'D' = daily
        from: past,
        to: now,
        token: API_KEY,
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error fetching historical:', err);
    return null;
  }
};

export const searchStocks = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: query,
        token: API_KEY,
      },
    });

    // Return just relevant matches (skip symbols like 'AA.CX')
    return res.data.result.filter((item) => item.symbol.match(/^[A-Z]+$/));
  } catch (err) {
    console.error('Error searching stocks:', err);
    return [];
  }
};

