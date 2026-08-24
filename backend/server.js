const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 📦 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔒 Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🛡️ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// 📌 Test database connection
pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
  } else {
    console.log('✅ PostgreSQL connected successfully!');
  }
});

// 📋 Create tables if not exists
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        file_url VARCHAR(500),
        thumbnail VARCHAR(500),
        is_boosted BOOLEAN DEFAULT FALSE,
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created/checked');
  } catch (err) {
    console.error('❌ Table creation error:', err);
  }
};

createTables();

// 🏠 Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Project X Backend is running!',
    database: 'PostgreSQL connected',
    timestamp: new Date().toISOString()
  });
});

// 🔐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
