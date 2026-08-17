const mongoose = require('mongoose');

const abilitiesSchema = mongoose.Schema({
    _id: { type: Number },
    key: { type: String },
    name: { type: Object },
    generation: { type: String },
    description: { type: Object },
    effect: { type: Object },
    pokemonWithAbility: { type: Object },
});

module.exports = mongoose.model('Abilities', abilitiesSchema, 'abilities');