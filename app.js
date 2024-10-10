const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        app.get('/', (req, res) => {
            res.send('Hello from Heroku');
          });
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

// Optional: Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (error) => {
    console.log('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Gracefully handle termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
});
