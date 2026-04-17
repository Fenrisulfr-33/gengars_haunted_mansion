/**
 * @fileoverview Main application entry point for Gengar's Haunted Mansion API.
 * @author Brendan Archer <archer.brendan@proton.me>
 * @version 1.0.0
 * @since 2023-10-01
 * 
 * @description This file sets up the Express server, configures middleware, and defines routes for the API.
 * It also includes error handling for not found routes and general errors.
 * The server listens on a specified port and logs environment variables on startup for debugging purposes.
 * 
 * @see {@link https://expressjs.com/} for Express documentation.
 * @see {@link https://www.npmjs.com/package/cors} for CORS middleware documentation.
 * @see {@link https://www.npmjs.com/package/dotenv} for dotenv documentation.
 * 
 * @license MIT License
 * Copyright (c) 2023 Brendan Archer. All rights reserved.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * 1.0.0 - Initial release of Gengar's Haunted Mansion API.
 */

const express = require('express');
const notFound = require('./src/errors/notFound');
const errorHandler = require('./src/errors/errorHandler');
const cors = require('cors');
require('dotenv').config();
const colors = require('colors');
const { connect } = require('./src/routes/pokemon/connection');

const port = process.env.PORT || 5000;
const pokemonRouter = require('./src/routes/pokemon/index');

const app = express();

// Connect to MongoDB once at startup
connect().catch(err => {
  console.error('Failed to connect to MongoDB:'.red, err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log("Environment Variables:");
console.log("Port: " + process.env.PORT);
console.log("Mongo URI: " + process.env.MONGO_URI);
console.log("Node Environment: " + process.env.NODE_ENV);
console.log("---------------------");

// Routes
app.get('/', (request, response) => {
  response.send('Gengar\'s Haunted Mansion API');
});

app.use('/pokemon', pokemonRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Only start server in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Running on port ${port}.`);
  });
}

module.exports = app;