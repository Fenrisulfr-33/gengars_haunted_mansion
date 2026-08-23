/**
 * Mongoose model for src/pokemon/evolutions entries.
 *
 * The schema is recursive and polymorphic: a "chain" is an array whose items
 * are either a "stage" (plain object) or a "branch" (array of stages/chains).
 * Mongoose can't express a real oneOf(object, array) union as typed
 * sub-schemas, so `evolution` is stored as Mixed and validated by hand,
 * mirroring the JSON Schema's stage/branch/chain/chainNode definitions.
 */

const { Schema, model } = require('mongoose');

const POKEMON_TYPES = [
	'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
	'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
	'Dragon', 'Dark', 'Steel', 'Fairy'
];

const STAGE_ALLOWED_KEYS = new Set(['id', 'name', 'type', 'how', 'form']);

function validateStage(node, path) {
	if (!node || typeof node !== 'object' || Array.isArray(node)) {
		throw new Error(`${path}: expected a stage object`);
	}
	if (typeof node.id !== 'number') {
		throw new Error(`${path}.id: required number (e.g. 19 or 19.1 for alt forms)`);
	}
	if (typeof node.name !== 'string' || !node.name.length) {
		throw new Error(`${path}.name: required non-empty string`);
	}
	if (!Array.isArray(node.type) || node.type.length < 1) {
		throw new Error(`${path}.type: required non-empty array`);
	}
	node.type.forEach((t, i) => {
		if (!POKEMON_TYPES.includes(t)) {
			throw new Error(`${path}.type[${i}]: "${t}" is not a valid Pokemon type`);
		}
	});
	if (node.how !== undefined && typeof node.how !== 'string') {
		throw new Error(`${path}.how: must be a string`);
	}
	if (node.form !== undefined && typeof node.form !== 'string') {
		throw new Error(`${path}.form: must be a string`);
	}
	Object.keys(node).forEach((key) => {
		if (!STAGE_ALLOWED_KEYS.has(key)) {
			throw new Error(`${path}: unexpected property "${key}" on stage`);
		}
	});
}

function validateBranch(node, path) {
	if (!Array.isArray(node) || node.length < 1) {
		throw new Error(`${path}: branch must be a non-empty array`);
	}
	node.forEach((option, i) => {
		const optionPath = `${path}[${i}]`;
		if (Array.isArray(option)) {
			validateChain(option, optionPath); // continuing chain, e.g. Nincada -> [Ninjask, Shedinja]
		} else {
			validateStage(option, optionPath); // terminal stage, e.g. Gloom -> Bellossom
		}
	});
}

function validateChainNode(node, path) {
	if (Array.isArray(node)) {
		validateBranch(node, path);
	} else {
		validateStage(node, path);
	}
}

function validateChain(chain, path) {
	if (!Array.isArray(chain) || chain.length < 1) {
		throw new Error(`${path}: chain must be a non-empty array`);
	}
	chain.forEach((node, i) => validateChainNode(node, `${path}[${i}]`));
}

let lastEvolutionValidationError = '';

const evolutionEntrySchema = new Schema(
	{
		_id: {
			type: Number,
			required: true,
			min: 1
		},
		generation: {
			type: Number,
			required: true,
			min: 1
		},
		evolution: {
			type: [Schema.Types.Mixed],
			required: true,
			validate: {
				validator(evolution) {
					try {
						if (!Array.isArray(evolution) || evolution.length < 1) {
							throw new Error('evolution must be a non-empty array');
						}
						evolution.forEach((chain, i) => validateChain(chain, `evolution[${i}]`));
						return true;
					} catch (err) {
						lastEvolutionValidationError = err.message;
						return false;
					}
				},
				message: () => lastEvolutionValidationError || 'evolution failed schema validation'
			}
		}
	},
	{
		collection: 'evolutions',
		versionKey: false,
		strict: 'throw' // enforces additionalProperties: false at the document root
	}
);

module.exports = model('Evolutions', evolutionEntrySchema, 'evolutions');