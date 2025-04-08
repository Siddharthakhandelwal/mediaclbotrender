#!/usr/bin/env node

// This script sets NODE_ENV to production and starts the application
// This is needed because Render doesn't support cross-env in package.json scripts

process.env.NODE_ENV = 'production';

// Import and run the server
import('../dist/index.js').catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});