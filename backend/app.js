const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware
const authRoutes = require('./routes/authRouter');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Apply CORS middleware to allow all origins

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/', authRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send('404: Not Found');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
