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

// GET /api/authors/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await sql.query`select * from authors where au_id = ${id}`;
      if (result.recordset.length > 0) {
        res.json(result.recordset[0]); // Assuming `au_id` is unique
      } else {
        res.status(404).json({ error: 'Author not found' });
      }
    } catch (err) {
      console.error(`Error fetching author with id ${id}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// PUT /api/authors/:id
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { au_lname, au_fname, phone, address, city, state, zip, contract } = req.body;
  
    try {
      await sql.query`
        UPDATE authors
        SET au_lname = ${au_lname}, au_fname = ${au_fname}, phone = ${phone}, address = ${address}, city = ${city}, state = ${state}, zip = ${zip}, contract = ${contract}
        WHERE au_id = ${id}
      `;
      res.status(200).json({ message: 'Author updated successfully' });
    } catch (err) {
      console.error('Error updating author:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// DELETE /api/authors/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`
            delete from titleauthor where au_id = ${id};
            delete from authors where au_id = ${id};
        `;
      if (result.rowsAffected[0] > 0) {
        res.json({ message: 'Author deleted successfully' });
      } else {
        res.status(404).json({ error: 'Author not found' });
      }
    } catch (err) {
      console.error(`Error deleting author with id ${id}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;
