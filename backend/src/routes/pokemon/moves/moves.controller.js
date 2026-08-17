const asyncHandler = require("express-async-handler");
const Moves = require("../../../models/pokemon/movesModel");
const National = require("../../../models/pokemon/nationalModel");
const gameDropDown = require("../variables/gameDropDown");

/* ---------- Middleware ---------- */

const moveExists = asyncHandler(async (request, response, next) => {
  const { id } = request.params;
  let move = null;
  /**
   * This ID can be either a Number Id or the name of the move
   * However the variable is always ID as the route doesn't change
   * This check verifies if Id is equal to a Number.
   */
  isNaN(id)
    ? (move = await Moves.findOne({ key: id }).lean())
    : (move = await Moves.findById(Number(id)).lean());

  if (!move) {
    // If move does not return from DB.
    response.status(400);
    throw new Error("Move not found.");
  } else {
    response.locals.move = move;
    next();
  }
});

/* ------- Helper Functions ------- */

/**
 * This is designed to get all the pokemon that can learn this move
 * in any form and attach it to the return move.
 * As pokemon get added this should automatically work with the updated dex.
 * @param {String} move
 * @param {String} game
 * @returns Object containing pokemon that can learn move.
 */
const getPokemonThatKnowMoveByGame = async (move, game) => {
  // Create return object.
  const pokemonThatLearnMove = {};
  /**
   * Get all pokemon, the reason this is not game specific is,
   * because other pokemon can exist outside the dex numbers.
   */
  const gameDex = await National.find()
    .select(`pokedexNumber name type moves.${game}`)
    .sort({ _id: 1 });
  // Go through every pokemon.
  gameDex.forEach((pokemon) => {
    // Check if the associated game exists.
    if (pokemon.moves && pokemon.moves[game]) {
      // Create base return object outside of level-up, etc..
      const basePokemon = {
        id: pokemon._id,
        name: pokemon.name.english,
        type: pokemon.type,
      };
      // TODO: Find a way to write a function that does this once with different parameters.
      for (const [key, value] of Object.entries(pokemon.moves[game])) {
        if (key === "level-up") {
          const foundMove = value.find((listMove) => listMove.name === move);
          if (foundMove) {
            const levelUpPokemon = {
              ...basePokemon,
              level: foundMove.lvl,
            };
            if (pokemonThatLearnMove["level-up"]) {
              pokemonThatLearnMove["level-up"].push(levelUpPokemon);
            } else {
              pokemonThatLearnMove["level-up"] = [];
              pokemonThatLearnMove["level-up"].push(levelUpPokemon);
            }
          }
        } else if (key === "egg") {
          const foundMove = value.find((listMove) => listMove === move);
          if (foundMove) {
            const eggPokemon = {
              ...basePokemon,
              eggGroup: pokemon.eggGroup,
            };
            if (pokemonThatLearnMove.egg) {
              pokemonThatLearnMove.egg.push(eggPokemon);
            } else {
              pokemonThatLearnMove.egg = [];
              pokemonThatLearnMove.egg.push(eggPokemon);
            }
          }
        } else if (key === "technical-machine") {
          const foundMove = value.find((listMove) => listMove.name === move);
          if (foundMove) {
            if (pokemonThatLearnMove["technical-machine"]) {
              pokemonThatLearnMove["technical-machine"].push(basePokemon);
            } else {
              pokemonThatLearnMove["technical-machine"] = [];
              pokemonThatLearnMove["technical-machine"].push(basePokemon);
            }
          }
        } else if (key === "reminder") {
          const foundMove = value.find((listMove) => listMove === move);
          if (foundMove) {
            if (pokemonThatLearnMove.reminder) {
              pokemonThatLearnMove.reminder.push(basePokemon);
            } else {
              pokemonThatLearnMove.reminder = [];
              pokemonThatLearnMove.reminder.push(basePokemon);
            }
          }
        }
      }
    }
  });
  return pokemonThatLearnMove;
};

const getMoveGameDropDown = (generation) => {
  generation = Number(generation);
  // gameDropDown length current is 18
  switch (Number(generation)) {
    case 9:
      return gameDropDown.slice(0, -17);
    case 8:
      return gameDropDown.slice(0, -14);
    case 7:
      return gameDropDown.slice(0, -12);
    case 6:
      return gameDropDown.slice(0, -10);
    case 5:
      return gameDropDown.slice(0, -8);
    case 4:
      return gameDropDown.slice(0, -6);
    case 3:
      return gameDropDown.slice(0, -4);
    case 2:
      return gameDropDown.slice(0, -2);
    case 1:
      return gameDropDown;
    default:
      return gameDropDown;
  }
};

/* ----------- CRUDL Ops ---------- */

const readMove = asyncHandler(async (request, response) => {
  const { move } = response.locals;
  const { game } = request.params;
  const moveGameDropDown = getMoveGameDropDown(move.generation);
  let returnMoveObj = {
    ...move,
    gameDropDown: moveGameDropDown,
  };
  let pokemonThatLearnMove = {};
  if (game) {
    pokemonThatLearnMove = await getPokemonThatKnowMoveByGame(
      move.name.english,
      game
    );
  } else {
    pokemonThatLearnMove = await getPokemonThatKnowMoveByGame(
      move.name.english,
      moveGameDropDown[0].key
    );
  }
  returnMoveObj = {
    ...returnMoveObj,
    pokemonThatLearnMove,
  }

  response.status(200).json(returnMoveObj);
});

const listMoves = asyncHandler(async (request, response) => {
  // Get all moves, only return data for table
  const moves = await Moves.find()
    .select("name.english type category pp power accuracy")
    .sort({ _id: 1 });

  response.status(200).json(moves);
});

const listMoveNames = asyncHandler(async (request, response) => {
  const movesNames = await Moves.find()
    .select("name.english")
    .sort({ 'name.english': 1 });

  response.status(200).json(movesNames);
}); 

module.exports = {
  read: [moveExists, readMove],
  list: listMoves,
  listNames: listMoveNames
};
