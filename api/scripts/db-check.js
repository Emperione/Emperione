#!/usr/bin/env node
// Simple DB check for Emperione API
require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment');
  process.exit(2);
}

const client = new Client({ connectionString });
client.connect().then(() => {
  return client.query('SELECT 1 AS ok');
}).then(res => {
  console.log('DB check OK:', res.rows[0]);
  return client.end();
}).catch(err => {
  console.error('DB check failed:', err.message || err);
  process.exit(1);
});
