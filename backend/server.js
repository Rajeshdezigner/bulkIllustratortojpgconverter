const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const illustratorRoutes = require('./routes/illustrator');
const templateRoutes = require('./routes/templates');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Create required directories
const dirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'outputs'),
  path.join(__dirname, 'scripts'),
  path.join(__dirname, 'jobs')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
app.use('/api/illustrator', illustratorRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Illustrator Automation Backend is running',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   🎨 Illustrator Automation Backend v2.0.0                 ║
║   Running on: http://localhost:${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
