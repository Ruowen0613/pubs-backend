// app.js

const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./db');
const authorsRouter = require('./routes/authors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:4200' // Replace with your Angular app's URL
}));

// Connect to database
connectToDB();

// Mount routes
app.use('/api/authors', authorsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
