// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Now uncommented
const portfolioRoutes = require('./routes/portfolioRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Body parser for JSON data

// Define a simple root route
app.get('/', (req, res) => {
    res.send('WealthManager API is running');
});

// Use portfolio routes for /api/portfolio path
app.use('/api/portfolio', portfolioRoutes);

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});