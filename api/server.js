require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

const indexRouter = require('./routes/index');

const PORT = process.env.PORT || 5000;

// Log environment variables for debugging
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PORT:', PORT);
console.log('BASE_URL:', process.env.BASE_URL);

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use('/', indexRouter); // Routes

// Test route
app.get('/test', (req, res) => {
    res.send('Test route is working');
});

// MongoDB connection with increased timeouts and detailed error handling
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
    connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
    socketTimeoutMS: 45000 // 45 seconds timeout for socket inactivity
})
.then(() => console.log('Database connection successful'))
.catch((err) => console.error('Database connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
