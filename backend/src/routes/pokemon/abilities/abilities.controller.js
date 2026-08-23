
const asyncHandler = require("express-async-handler");
const Abilities = require("../../../models/pokemon/abilitiesModel");

const getAbilityByKey = async (abilityKey) => {
	const ability = await Abilities.findOne({ key: abilityKey }).lean();
	return ability;
}

/**
 * Get a single ability by its ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} The ability object if found, otherwise an error message.
 */
const getAbility = asyncHandler(async (request, response) => {
	try {
		const ability = await Abilities.findById(request.params.id).lean();

		if (!ability) {
			response.status(400);
			throw new Error("Ability not found.");
		}
		response.status(200).json(ability);
	} catch (error) {
		response.status(500);
		throw new Error("Server error.");
	}
});

/**
 * List all abilities in the database.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Array} List of all abilities with their English name, generation, and short effect.
 */
const listAbilities = asyncHandler(async (request, response) => {
	const abilities = await Abilities.find()
		.select("name.english generation effect.shortEffect")
		.sort({ _id: 1 })
		.lean();

	response.status(200).json(abilities);
});

module.exports = {
	read: [getAbility],
	list: listAbilities,
};
