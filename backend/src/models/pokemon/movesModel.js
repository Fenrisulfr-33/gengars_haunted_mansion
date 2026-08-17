const mongoose = require('mongoose');

const movesSchema = mongoose.Schema({
    _id: { type: Number },
    key: { type: String },
    name: { type: Object },
    type: { type: String },
    category: { type: String },
    contest: { type: String },
    pp: { type: Number },
    power: { type: Number },
    accuracy: { type: Number },
    contact: { type: Boolean },
    generation: { type: String },
    target: { type: String },
    changes: { type: Array },
    description: { type: Object },
    effect: { type: Object },
    priority: { type: Number },
});

module.exports = mongoose.model('Moves', movesSchema, 'moves');