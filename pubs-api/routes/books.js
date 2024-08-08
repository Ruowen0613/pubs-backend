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
        select t.title_id, t.title, t.type, t.pub_id, t.price, t.advance, 
               t.royalty, t.ytd_sales, t.notes, t.pubdate, ta.royaltyper, 
               a.au_fname + ' ' + a.au_lname as authorName
        from titles t
        join titleauthor ta on t.title_id = ta.title_id
        join authors a on a.au_id = ta.au_id
        where t.title_id = ${id}
        order by ta.au_ord
      `;

    if (result.recordset.length > 0) {
      const bookRecord = result.recordset[0]; // Take the first record as base
      const authors = result.recordset.map(record => record.authorName);

      // Create the combined book object
      const book = {
        title_id: bookRecord.title_id,
        title: bookRecord.title,
        type: bookRecord.type,
        pub_id: bookRecord.pub_id,
        price: bookRecord.price,
        advance: bookRecord.advance,
        royalty: bookRecord.royalty,
        ytd_sales: bookRecord.ytd_sales,
        notes: bookRecord.notes,
        pubdate: bookRecord.pubdate,
        royaltyper: bookRecord.royaltyper,
        authorNames: authors
      };

      res.json(book);
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
  const { title_id, title, type, pub_id, price, advance, royalty, ytd_sales, notes, pubdate, royaltyper, authorNames } = req.body;
  //console.log('Request Body:', req.body);


  try {
    const pubIdValue = pub_id ? pub_id : null;

    await sql.query`
          INSERT INTO titles (title_id, title, type, pub_id, price, advance, royalty, ytd_sales, notes, pubdate)
          VALUES (${title_id}, ${title}, ${type}, ${pubIdValue}, ${price}, ${advance}, ${royalty}, ${ytd_sales}, ${notes}, ${pubdate})
      `;

    for (const authorName of authorNames) {
      const authorResult = await sql.query`
          SELECT au_id FROM authors WHERE CONCAT(au_fname, ' ', au_lname) = ${authorName}
        `;

      if (authorResult.recordset.length === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }

      const au_id = authorResult.recordset[0].au_id;

      await sql.query`
        INSERT INTO titleauthor (au_id, title_id, au_ord, royaltyper)
        VALUES (${au_id}, ${title_id}, ${authorNames.indexOf(authorName) + 1}, ${royaltyper})
      `;
    }
    res.status(201).json({ message: 'Book and author link added successfully' });
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/books/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, type, pub_id, price, advance, royalty, ytd_sales, notes, pubdate, royaltyper, authorNames } = req.body;

  try {
    const pubIdValue = pub_id ? pub_id : null;

    await sql.query`
        UPDATE titles
        SET title = ${title}, type = ${type}, pub_id = ${pubIdValue}, price = ${price}, advance = ${advance}, royalty = ${royalty}, ytd_sales = ${ytd_sales}, notes = ${notes}, pubdate = ${pubdate}
        WHERE title_id = ${id}
      `;

    await sql.query`
      DELETE FROM titleauthor WHERE title_id = ${id}
    `;

    for (const authorName of authorNames) {
      const authorResult = await sql.query`
          SELECT au_id FROM authors WHERE CONCAT(au_fname, ' ', au_lname) = ${authorName}
        `;

      if (authorResult.recordset.length === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }

      const au_id = authorResult.recordset[0].au_id;

      await sql.query`
          INSERT INTO titleauthor (title_id, au_id, au_ord, royaltyper)
          VALUES (${id}, ${au_id}, ${authorNames.indexOf(authorName) + 1}, ${royaltyper})
        `;
    }
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
            delete form sales where title_id = ${id};
            delete from titles where title_id = ${id};
        `;
    console.log(`SQL Delete Result: ${JSON.stringify(result)}`);
    if (result.rowsAffected[2] > 0) {
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


// GET /api/books/author/:authorId
router.get('/author/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  console.log(`Fetching books for author with au_id: ${authorId}`);

  try {
    // Query to fetch books for the given authorId
    const result = await sql.query`
      SELECT 
        t.title_id,
        t.title, 
        t.type, 
        p.pub_name, 
        t.price, 
        t.ytd_sales, 
        t.notes, 
        t.pubdate
      FROM 
        titles t
      JOIN 
        titleauthor ta 
      ON 
        t.title_id = ta.title_id
      LEFT JOIN
        publishers p
      ON  t.pub_id = p.pub_id
      WHERE 
        ta.au_id = ${authorId}`;

    const books = result.recordset;

    // Check if any books were found
    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: 'No books found for this author' });
    }
  } catch (err) {
    console.error(`Error fetching books for author with id ${authorId}:`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
