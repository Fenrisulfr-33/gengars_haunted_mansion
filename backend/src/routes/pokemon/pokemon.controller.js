const asyncHandler = require("express-async-handler");
const National = require("../../models/pokemon/nationalModel");
const Moves = require("../../models/pokemon/movesModel");
const Abilities = require("../../models/pokemon/abilitiesModel");

const getSearchBarList = asyncHandler(async (request, response) => {
    const nationalNames = await National.distinct("name.english");
    const returnNationNames = nationalNames.map((name) => {
      return {
        name: name,
        route: `national/${name.replaceAll(' ', '-').toLowerCase()}`,
      };
    });
    const movesNames = await Moves.distinct("name.english");
    const returnMovesNames = movesNames.map((name) => {
      return {
        name: name,
        route: `moves/${name.replaceAll(' ', '-').toLowerCase()}`,
      };
    });
    const abilitiesNames = await Abilities.distinct("name.english");
    const returnAbilitiesNames = abilitiesNames.map((name) => {
      return {
        name: name,
        route: `abilities/${name.replaceAll(' ', '-').toLowerCase()}`,
      };
    });
    const searchBarList = returnNationNames.concat(returnMovesNames).concat(returnAbilitiesNames);
    response.status(200).json(searchBarList);
  });


module.exports = {
  listNames: getSearchBarList,
};
