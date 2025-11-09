const mongoose = require('mongoose');
const jokesJson = require('../DataJson/jokes.json')
const typesJson = require('../DataJson/types.json')
require('dotenv').config(); // Move this to top

const DB_NAME = process.env.DATABASE || 'jokesapp';
const MONGO_HOST = process.env.HOST_NAME || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const conStr = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`;

// Define schemas
const typeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 45
    }
});

const jokeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        maxlength: 45,
        index: true
    },
    setup: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    punchline: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    }
});

// Register models ONCE
const Type = mongoose.model('Type', typeSchema);
const Joke = mongoose.model('Joke', jokeSchema);

// Connection function
async function connectToMongoDB() {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected');
        return mongoose.connection.name;
    }

    try {
        console.log(`Connecting to ${conStr}...`);
        await mongoose.connect(conStr, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected');
        return mongoose.connection.name;
    } catch (err) {
        console.error('Connection failed:', err.message);
        throw err;
    }
}

// Data functions
async function getData(collectionName, conditions = []) {
    await isConnected(); // Ensure connection

    const collection = collectionName === 'jokes' ? Joke : Type;
    try {
        let query = {};

        if (conditions.length > 0 && conditions[0] !== 'any') {
            query.type = conditions[0];
        }

        const results = await collection.find(query);
        if (results.length == 0) {
            throw ('Not found');
        }
        else {
            return results;
        }
    } catch (err) {
        throw (err)
    }
}

async function createTypesCollection() {
    try {
        await Type.insertMany(typesJson);
        var typesCount = await Type.countDocuments();
        console.log(`Types collection initialized with ${typesCount} documents.`);
        return true;
    } catch (err) {
        throw err;
    }
}

async function createJokesCollection() {
    try {
        await Joke.insertMany(jokesJson);
        var jokesCount = await Joke.countDocuments();
        console.log(`Jokes collection initialized with ${jokesCount} documents.`);
        return true;
    } catch (err) {
        throw err;
    }
}

async function isConnected() {
    try {
        const dbName = await connectToMongoDB();

        if (await Type.countDocuments() === 0) await createTypesCollection();
        if (await Joke.countDocuments() === 0) await createJokesCollection();

        return dbName === DB_NAME;
    } catch (err) {
        throw err;
    }
}

module.exports = { isConnected, getData };