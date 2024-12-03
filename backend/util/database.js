const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

// Initialize _db variable if you still need it
let _db;

async function mongoConnect() {
    try {
        const connection = await mongoose.connect(MONGO_CONNECTION_STRING, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            },
            // Additional helpful options
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
             dbName: 'GreenNest'
        });
        
        _db = connection.connection;
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return _db;

    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}

// Connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// If you still need getDb function
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw new Error('No database found');
};

// Clean up on app termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = {
    mongoConnect,
    getDb,
};