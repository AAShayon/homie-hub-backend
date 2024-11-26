const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import database connection
require('./db');

// Import Routers
const AuthRouter = require('./Routes/AuthRouter');
const ProfileRouter = require('./Routes/ProfileRouter');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// API Routes
app.use('/auth', AuthRouter);
app.use('/profile', ProfileRouter);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.31.60:${PORT}`);
});
