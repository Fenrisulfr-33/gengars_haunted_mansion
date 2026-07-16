// This lets use use try catch without always have to catch an error
const asyncHandler = require("express-async-handler");
const National = require("../../../models/pokemon/nationalModel");
const Moves = require("../../../models/pokemon/movesModel");
const FormTabs = require('../../../models/pokemon/formTabsModel');
// const Evolution = require('../../../models/pokemon/evolutionModel');

/* ---------- Helpers ---------- */

const getPokemonMoves = (pokemonMoves, dbMoves) => {
	const returnMoves = {};
	for (const [game, methodList] of Object.entries(pokemonMoves)) {
		returnMoves[game] = {};
		for (const [method, list] of Object.entries(pokemonMoves[game])) {
			if (typeof list[0] === typeof {}) {
				const returnList = list.map((move) => {
					const foundMove = dbMoves.find(
						(dbMove) => dbMove.name.english === move.name
					);
					if (foundMove) {
						return {
							...move,
							id: foundMove._id,
							name: foundMove.name.english,
							type: foundMove.type,
							category: foundMove.category,
							pp: foundMove.pp,
							power: foundMove.pp,
							accuracy: foundMove.accuracy,
							contact: foundMove.contact,
							shortEffect: foundMove.effect?.shortEffect,
							target: foundMove.target,
							contest: foundMove.contest,
							priority: foundMove.priority,
						};
					}
				});
				returnMoves[game][method] = returnList;
			} else {
				// Must be an array
				const returnList = list.map((move) => {
					const foundMove = dbMoves.find(
						(dbMove) => dbMove.name.english === move
					);
					if (foundMove) {
						return {
							id: foundMove._id,
							name: foundMove.name.english,
							type: foundMove.type,
							category: foundMove.category,
							pp: foundMove.pp,
							power: foundMove.pp,
							accuracy: foundMove.accuracy,
							contact: foundMove.contact,
							shortEffect: foundMove.effect?.shortEffect,
							target: foundMove.target,
							contest: foundMove.contest,
							priority: foundMove.priority,
						};
					}
				});
				returnMoves[game][method] = returnList;
			}
		}
	}
	return returnMoves;
};

const getPokemonForms = async (pokemonId, formsTab, dbMoves) => {
	const returnForms = {
		startingIndex: 0,
		formsTab: []
	}

	for (let i = 0; i < formsTab.length - 1; i++) {
		console.log(i);
		const form = formsTab[i];
		if (form.id === pokemonId) {
			returnForms.startingIndex = i;
		}
		const pokemon = await National.findById(Number(form.id)).lean();
		pokemon.moves = getPokemonMoves(pokemon.moves, dbMoves);
		pokemon.baseStats = getPokemonBaseStats(pokemon.baseStats);
		pokemon.index = i;
		pokemon.formsTab = formsTab;
		returnForms.formsTab.push(pokemon);
	}

	return returnForms;
}

const getPokemonBaseStats = (baseStats) => {
	/**
	 * Declare rounded stats to get width
	 *  and pass into tierColor function
	 */
	const hpWidth = Math.round([baseStats.hp * 100] / 255);
	const atkWidth = Math.round([baseStats.atk * 100] / 180);
	const defWidth = Math.round([baseStats.def * 100] / 180);
	const spatkWidth = Math.round([baseStats.spatk * 100] / 230);
	const spdefWidth = Math.round([baseStats.spdef * 100] / 230);
	const spdWidth = Math.round([baseStats.spd * 100] / 200);

	const hp = {
		base: baseStats.hp,
		min: minStatFormula('hp', baseStats.hp),
		max: maxStatFormula('hp', baseStats.hp),
		tier: getTierColor(hpWidth),
		width: hpWidth
	};
	const atk = {
		base: baseStats.atk,
		min: minStatFormula('atk', baseStats.atk),
		max: maxStatFormula('atk', baseStats.atk),
		tier: getTierColor(atkWidth),
		width: atkWidth
	};
	const def = {
		base: baseStats.def,
		min: minStatFormula('def', baseStats.def),
		max: maxStatFormula('def', baseStats.def),
		tier: getTierColor(defWidth),
		width: defWidth
	};
	const spatk = {
		base: baseStats.spatk,
		min: minStatFormula('spatk', baseStats.spatk),
		max: maxStatFormula('spatk', baseStats.spatk),
		tier: getTierColor(spatkWidth),
		width: spatkWidth
	};
	const spdef = {
		base: baseStats.spatk,
		min: minStatFormula('spdef', baseStats.spdef),
		max: maxStatFormula('spdef', baseStats.spdef),
		tier: getTierColor(spdefWidth),
		width: spdefWidth
	};
	const spd = {
		base: baseStats.spd,
		min: minStatFormula('spd', baseStats.spd),
		max: maxStatFormula('spd', baseStats.spd),
		tier: getTierColor(spdWidth),
		width: spdWidth
	};

	return {
		hp,
		atk,
		def,
		spatk,
		spdef,
		spd,
		total: baseStats.total,
	}
}

const hpFormula = (baseStat, IV, EV, level) => {
	return Math.floor(
		((2 * baseStat + IV + EV / 4) * level) / 100 + level + 10
	);
};

const otherStat = (baseStat, IV, EV, level, nature) => {
	return Math.floor(
		(((2 * baseStat + IV + EV / 4) * level) / 100 + 5) * nature
	);
};

const minStatFormula = (title, stat) => {
	if (title === "hp") {
		return hpFormula(stat, 0, 0, 100);
	} else {
		return otherStat(stat, 0, 0, 100, 0.9);
	}
};

const maxStatFormula = (title, stat) => {
	if (title === "hp") {
		return hpFormula(stat, 31, 252, 100);
	} else {
		return otherStat(stat, 31, 252, 100, 1.1);
	}
};

const getTierColor = (stat) => {
	let tierColor = '';
	const tier = {
		one: "bg-green-600",
		two: "bg-green-400",
		three: "bg-green-300",
		four: "bg-sky-500",
		five: "bg-sky-300",
		six: "bg-purple-200",
	};

	if (stat <= 16.6) {
		tierColor = tier.one;
	} else if (16.6 < stat && stat < 33.2) {
		tierColor = tier.two;
	} else if (33.2 < stat && stat < 49.8) {
		tierColor = tier.three;
	} else if (49.8 < stat && stat < 66.4) {
		tierColor = tier.four;
	} else if (66.4 < stat && stat < 83) {
		tierColor = tier.five;
	} else if (83 <= stat && stat < 100) {
		tierColor = tier.six;
	}
	return tierColor;
}

/* ---------- Middleware ---------- */

const pokemonExists = asyncHandler(async (request, response, next) => {
	const { id } = request.params;
	let pokemon = null;

	isNaN(id)
		? (pokemon = await National.findOne({ key: id }).lean())
		: (pokemon = await National.findById(Number(id)).lean());

	if (!pokemon) {
		// If pokemon does not return from DB
		response.status(400);
		throw new Error("Pokemon not found.");
	} else {
		response.locals.pokemon = pokemon;
		next();
	}
});

const getMoves = asyncHandler(async (request, response, next) => {
	// Getting all the moves right away will be faster then requesting it every time we need information
	const moves = await Moves.find().lean();
	// Working on
	// const moves = await Moves.find().select('name.english type category contest pp power accuracy contact generation target effect priority').lean();
	if (!moves) {
		// If moves do not return from DB.
		response.status(400);
		throw new Error("Moves data not found, error on Server/Database side.");
	} else {
		response.locals.moves = moves;
		next();
	}
});

const reformatPokemonBaseStats = asyncHandler(async (request, response, next) => {
	const { pokemon } = response.locals;
	pokemon.baseStats = getPokemonBaseStats(pokemon.baseStats);
	response.locals.pokemon = pokemon;
	next();
});

// const reformatPokemonEvolution = asyncHandler(async (request, response, next) => {
//   const { pokemon } = response.locals;
//   // If evolution is not null, pokemon without evo lines are null
//   if (pokemon.evolution) {
//     // Get evolution object tree
//     const evolutionTree = await Evolution.findById(pokemon.evolution);
//     // If pokemon has a tree, else DB does not yet contain tree
//     if (evolutionTree) {
//       pokemon.evolution = evolutionTree;
//     } else {
//       pokemon.evolution = pokemon.evolution;
//     }
//     response.locals.pokemon = pokemon;
//   }
//   next();
// });

/**
 *  Finds a pokemon base upon its national dex _id,
 *  and reassigns its move values as object with
 *  basic move information
 * @returns {JSON} all data for a specific Pokemon
 */
// TODO: Make this page work so when you go from a dex to that page it has the moves
const readPokemonByGame = asyncHandler(async (request, response, next) => {
	const { pokemon, moves } = response.locals;
	const { game } = request.params;
	// Reformat moves to have pop up information.
	const newMoves = getPokemonMoves(pokemon.moves, moves);
	pokemon.moves = newMoves;

	response.status(200).json(pokemon);
});

/* ----------- CRUD Ops ----------- */

/**
 *  Finds a pokemon base upon its national dex _id ,
 *  and reassigns its move values as object with
 *  basic move information
 * @returns {JSON} all data for a specific Pokemon
 */
const readPokemon = asyncHandler(async (request, response, next) => {
	const { pokemon, moves } = response.locals;
	// See if pokemon has multiple forms
	const pokemonForms = await FormTabs.findById(Math.floor(pokemon._id)).lean();
	// Get pokemon forms tab data if formsTab exists.
	if (pokemon.formsTab) {
		const forms = await getPokemonForms(pokemon._id, pokemonForms.tab, moves);
		response.status(200).json(forms);
	} else {
		// Get more detailed information for each pokemon move for MoveModal.
		pokemon.moves = getPokemonMoves(pokemon.moves, moves);
		response.status(200).json(pokemon);
	}
});
/**
 *  lists all pokemon in order of national dex _id
 *
 * @returns {JSON}
 *  The Pokemon National Dex up to 898
 */
const listNational = asyncHandler(async (request, response) => {
	// Define parameters for types, and stats
	const { typeOne, typeTwo, asc, desc } = request.query;
	// Create return array to avoid repetitive code
	let national = [];
	// Creates whats returned from model
	const nationalSelect = "key name.english type abilities baseStats";
	// Create sorting object for array return
	const sort = asc ? { [asc]: 1 } : desc ? { [desc]: -1 } : { _id: 1 };
	// Checks for pokemon types from parameters
	let typeStatement = null;
	// Type check else statement
	if (typeOne && typeTwo) {
		typeStatement = [
			{ "type.one": typeOne, "type.two": typeTwo },
			{ "type.one": typeTwo, "type.two": typeOne },
		];
	} else if (!typeOne && typeTwo) {
		typeStatement = [{ "type.one": typeTwo }, { "type.two": typeTwo }];
	} else if (!typeTwo && typeOne) {
		typeStatement = [{ "type.one": typeOne }, { "type.two": typeOne }];
	}
	// if the typeStatement exists apply typeStatement
	if (typeStatement) {
		national = await National.find()
			.or(typeStatement)
			.select(nationalSelect)
			.sort(sort);
	} else {
		// return national dex without filters
		national = await National.find().select(nationalSelect).sort(sort);
	}

	response.status(200).json(national);
});

module.exports = {
	read: [pokemonExists, getMoves, reformatPokemonBaseStats, readPokemon],
	readGame: [pokemonExists, getMoves, readPokemonByGame],
	list: listNational,
};
