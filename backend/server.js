const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// হেলথ চেক
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Project X Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// টেস্ট API
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// 404 হ্যান্ডলার
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// সার্ভার চালু
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
