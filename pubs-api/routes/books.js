// routes/books.js

const express = require('express');
const { sql } = require('../db');

const router = express.Router();

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`
      select * from titles 
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await sql.query`
        select title_id, title, type, pub_id, price, royalty, ytd_sales, notes, pubdate
        from titles 
        where title_id = ${id}
      `;
      if (result.recordset.length > 0) {
        res.json(result.recordset[0]); // Assuming `au_id` is unique
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (err) {
      console.error(`Error fetching book with id ${id}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// POST /api/books
router.post('/', async (req, res) => {
    const { title_id, title, type, pub_id, price, royalty, ytd_sales, notes, pubdate, royaltyper, authorName } = req.body;
    console.log('Request Body:', req.body);
    
    try {
      const pubIdValue = pub_id ? pub_id : null;
      const authorResult = await sql.query`
      SELECT au_id FROM authors WHERE CONCAT(au_fname, ' ', au_lname) = ${authorName}
    `;

    if (authorResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const au_id = authorResult.recordset[0].au_id;


    await sql.query`
        INSERT INTO titles (title_id, title, type, pub_id, price, royalty, ytd_sales, notes, pubdate)
        VALUES (${title_id}, ${title}, ${type}, ${pubIdValue}, ${price}, ${royalty}, ${ytd_sales}, ${notes}, ${pubdate})
    `;

    await sql.query`
    INSERT INTO titleauthor (au_id, title_id, au_ord, royaltyper)
    VALUES (${au_id}, ${title_id}, ${au_ord}, ${royaltyper})
  `;

    res.status(201).json({ message: 'Book and author link added successfully' });
    } catch (err) {
      console.error('Error adding book:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// PUT /api/books/:id
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, type, au_fname, au_lname, pub_id, price, royalty, ytd_sales, notes, pubdate, authorName } = req.body;
  
    try {
      let authorResult = await sql.query`
      SELECT au_id FROM authors WHERE au_fname = ${au_fname} AND au_lname = ${au_lname}
    `;

      let au_id;
      if (authorResult.recordset.length > 0) {
        au_id = authorResult.recordset[0].au_id;
      } else {
        //insert new author

      }
      await sql.query`

        UPDATE titles
        SET title = ${title}, type = ${type}, pub_id = ${pub_id}, price = ${price}, royalty = ${royalty}, ytd_sales = ${ytd_sales}, notes = ${notes}, pubdate = ${pubdate}
        WHERE title_id = ${id}
      `;
      res.status(200).json({ message: 'Book updated successfully' });
    } catch (err) {
      console.error('Error updating book:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// DELETE /api/books/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Attempting to delete book with title_id: ${id}`);
    try {
        const result = await sql.query`
            delete from titleauthor where title_id = ${id};
            delete from titles where title_id = ${id};
        `;
        console.log(`SQL Delete Result: ${JSON.stringify(result)}`);
      if (result.rowsAffected[1] > 0) {
        res.json({ message: 'Book deleted successfully' });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (err) {
      console.error(`Error deleting book with id ${id}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
