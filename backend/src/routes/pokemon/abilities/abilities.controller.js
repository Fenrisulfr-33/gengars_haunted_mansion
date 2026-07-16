// This lets use use try catch without always have to catch an error
const asyncHandler = require("express-async-handler");
const Abilities = require("../../../models/pokemon/abilitiesModel");
const National = require("../../../models/pokemon/nationalModel");

/* ---------- Helpers ---------- */

const getPokemonThatLearnAbility = async (abilityKey) => {
  const pokedex = await National.find()
    .select(`key name.english type abilities`)
    .sort({ _id: 1 })
    .lean();
  const returnPokemonWithAbility = {
    normal: [],
    hidden: [],
  }

  pokedex.forEach((pokemon) => {
      // "abilities": {
      //     "one": {
      //       "name": "Beads of Ruin",
      //       "id": 287
      //     },
      //     "hidden": {
      //       "name": "Beads of Ruin",
      //       "id": 287
      //     }
      //   },
      if (pokemon.abilities.one){
          const abilityOne = pokemon.abilities.one.name.replaceAll(' ', '-').replaceAll("'", '').toLowerCase();
          if (abilityOne === abilityKey){
            returnPokemonWithAbility.normal.push({id: pokemon._id, name: pokemon.name.english, type: pokemon.type})
          }
      }
      if (pokemon.abilities.two){
          const abilityTwo = pokemon.abilities.two.name.replaceAll(' ', '-').replaceAll("'", '').toLowerCase();
          if (abilityTwo === abilityKey){
            returnPokemonWithAbility.normal.push({id: pokemon._id, name: pokemon.name.english, type: pokemon.type})
          }
      }
      if (pokemon.abilities.hidden){
          const abilityHidden = pokemon.abilities.hidden.name.replaceAll(' ', '-').replaceAll("'", '').toLowerCase();
          if (abilityHidden === abilityKey){
            returnPokemonWithAbility.hidden.push({id: pokemon._id, name: pokemon.name.english, type: pokemon.type})
          }
      }
  })
  return returnPokemonWithAbility;  
}

/* ---------- Middleware ---------- */

const abilityExists = asyncHandler(async (request, response, next) => {
  const { id } = request.params;
  let ability = null;
  /**
   * This ID can be either a Number Id or the name of the move
   * However the variable is always ID as the route doesn't change
   * This check verifies if Id is equal to a Number.
   */
  isNaN(id)
    ? (ability = await Abilities.findOne({ key: id }).lean())
    : (ability = await Abilities.findById(Number(id)).lean());

  if (!ability) {
    // If ability does not return from DB.
    response.status(400);
    throw new Error("Ability not found.");
  } else {
    response.locals.ability = ability;
    next();
  }
});

/* ----------- CRUDL Ops ---------- */

const readAbility = asyncHandler(async (request, response) => {
  const { ability } = response.locals;
  // Get pokemon that can learn this ability as normal/hidden.
  ability.pokemonWithAbility = await getPokemonThatLearnAbility(ability.key);

  response.status(200).json(ability);
});

const listAbilities = asyncHandler(async (request, response) => {
  const abilities = await Abilities.find()
    .select("name.english generation effect.shortEffect")
    .sort({ _id: 1 });

  response.status(200).json(abilities);
});

module.exports = {
  read: [abilityExists, readAbility],
  list: listAbilities,
};
