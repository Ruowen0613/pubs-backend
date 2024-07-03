// routes/authors.js

const express = require('express');
const { sql } = require('../db');

const router = express.Router();

// GET /api/authors
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`select * from authors`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching authors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
