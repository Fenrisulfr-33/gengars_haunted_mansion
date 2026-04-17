const mongoose = require('mongoose');
require('colors');

let cachedConnection = null;

// Serverless-friendly connection caching
const connect = async () => {
    // If already connected, return existing connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection'.green);
        return cachedConnection;
    }

    mongoose.set('strictQuery', true);
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        throw new Error('MongoDB connection string is not defined in environment variables.');
    }

    console.log('Establishing new MongoDB connection...'.yellow.underline);

    try {
        const db = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        cachedConnection = db;
        console.log(`Mongo Connected: ${db.connection.host}`.cyan.underline);
        return db;
    } catch (error) {
        console.error('MongoDB connection error:'.red, error);
        throw error;
    }
};

// No-op disconnect for serverless - connection is reused
const disconnect = () => {
    // Don't disconnect in serverless environments
    // Connection will be reused across invocations
    console.log('Disconnect called but ignored (serverless mode)'.dim);
};

module.exports = {
    connect,
    disconnect
}