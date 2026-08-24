// This lets use use try catch without always have to catch an error
const asyncHandler = require("express-async-handler");
const National = require("../../../models/pokemon/nationalModel");

const searchPokemon = asyncHandler(async (request, response) => {
	const returnArray = [];
	let {
		moveOne,
		moveTwo,
		moveThree,
		moveFour,
		game,
	} = request.query;
	if (!moveOne && !moveTwo && !moveThree && !moveFour) {
		disconnect();
		response.status(200).json([]);
	} else {
		const gameList = await National.find()
			.where(`moves.${game}`)
			.exists(true)
			.select(`name.english pokedexNumber type abilities baseStats moves.${game}`)
			.sort({ _id: 1 });
		if (gameList.length > 0) {
			gameList.forEach((pokemon) => {
				const returnPokemon = {
					_id: pokemon._doc._id,
					name: pokemon._doc.name,
					pokedexNumber: pokemon._doc.pokedexNumber,
					type: pokemon._doc.type,
					abilities: pokemon._doc.abilities,
					baseStats: pokemon._doc.baseStats,
				};
				let foundMove1 = false;
				let foundMove2 = false;
				let foundMove3 = false;
				let foundMove4 = false;
				for (const [key, value] of Object.entries(pokemon.moves[game])) {
					const searchKey = key === 'level-up' ? 'level-up' : key;
					if (moveOne) {
						pokemon.moves[game][searchKey].find((move) => {
							if (move.name === moveOne) {
								foundMove1 = true;
							}
						});
					}
					if (moveTwo) {
						pokemon.moves[game][searchKey].find((move) => {
							if (move.name === moveTwo) {
								foundMove2 = true;
							}
						});
					}
					if (moveThree) {
						pokemon.moves[game][searchKey].find((move) => {
							if (move.name === moveThree) {
								foundMove3 = true;
							}
						});
					}
					if (moveFour) {
						pokemon.moves[game][searchKey].find((move) => {
							if (move.name === moveFour) {
								foundMove4 = true;
							}
						});
					}
				}
				if (foundMove4 && foundMove3 && foundMove2 && foundMove1) {
					returnArray.push(returnPokemon);
				} else if (
					moveFour === undefined &&
					foundMove3 &&
					foundMove2 &&
					foundMove1
				) {
					returnArray.push(returnPokemon);
				} else if (
					moveFour === undefined &&
					moveThree === undefined &&
					foundMove2 &&
					foundMove1
				) {
					returnArray.push(returnPokemon);
				} else if (
					moveFour === undefined &&
					moveThree === undefined &&
					moveTwo === undefined &&
					foundMove1
				) {
					returnArray.push(returnPokemon);
				}
			});
		}

		response.status(200).json(returnArray);
	}

});

module.exports = {
	read: searchPokemon,
};
