// app.js

const express = require('express');
const { connectToDB } = require('./db');
const authorsRouter = require('./routes/authors');

const app = express();
const port = 3000;

// Connect to database
connectToDB();

// Mount routes
app.use('/api/authors', authorsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
