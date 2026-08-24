mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
	_id: { 
		type: mongoose.Schema.Types.ObjectId, 
		auto: true 
	},
	key: { 
		type: String, 
		required: [true, 'Key is required'] 
	},
	name: { 
		type: Object, 
		required: [true, 'Name is required'] 
	},
	generation: { 
		type: Number, 
		required: [true, 'Generation is required'] 
	},
	effect: { 
		type: effectSchema, 
		required: [true, 'Effect is required'] 
	}
});

const effectSchema = new mongoose.Schema({
	short_effect: { 
		type: String, 
		required: [true, 'Short effect is required'] 
	},
	full: { 
		type: String, 
		required: [true, 'Full effect is required'] 
	}
});

module.exports = mongoose.model('Ability', abilitySchema);