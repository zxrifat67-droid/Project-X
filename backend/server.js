const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ডেটাবেস কানেক্ট (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// টেস্ট রুট
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 Project X Backend is running!',
    database: 'PostgreSQL connected'
  });
});

// API টেস্ট
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// সার্ভার চালু
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
