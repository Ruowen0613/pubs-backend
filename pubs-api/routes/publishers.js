// routes/publishers.js

const express = require('express');
const { sql } = require('../db');

const router = express.Router();

// GET /api/publishers
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`
        select * from publishers
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching publishers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;