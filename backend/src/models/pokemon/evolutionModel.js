const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const evolutionsSchema = Schema({
    _id: { type: Number },
});

module.exports = model('Evolutions', evolutionsSchema, 'evolutions');