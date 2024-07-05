// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToDB } = require('./db');
const authorsRouter = require('./routes/authors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:4200' 
}));

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
connectToDB();

// Mount routes
app.use('/api/authors', authorsRouter); // tells the Express app to use the authorsRouter middleware for any route that starts with /api/authors.

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
