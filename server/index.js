const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { configureHelmet, configureCors, apiRateLimiter, sanitizeInput } = require('./middleware/security');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const submissionRoutes = require('./routes/submissions');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(configureHelmet());
app.use(configureCors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeInput);

// Global API Rate Limiter
app.use('/api', apiRateLimiter);

// API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    security: 'enforced (Helmet, CORS, Rate Limiting, Prepared Statements)',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/submissions', submissionRoutes);

// Serve Frontend Static Build if in Production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    console.error('Unhandled server error:', err.stack);
  } else {
    console.error('Unhandled server error:', err.message);
  }
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Start Server (if executed directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` CYSCOM FFCS PORTAL SECURITY BACKEND LISTENING ON PORT ${PORT} `);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
    console.log(` Rate Limiting & Helmet Security: ACTIVE `);
    console.log(`=======================================================`);
  });
}

module.exports = app;
