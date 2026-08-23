const asyncHandler = require('express-async-handler');
const Evolutions = require('./model');

const getEvolutions = asyncHandler(async (request, response) => {
	try {
		const evolutions = await Evolutions.find().sort().lean();
		response.json(evolutions);
	} catch (error) {
		response.status(500);
		throw new Error("Server error.");
	}
});

const getEvolutionById = asyncHandler(async (request, response) => {
	try {
		const evolution = await Evolutions.findById(request.params.id).lean();
		if (!evolution) {
			response.status(404);
			throw new Error("Evolution not found.");
		}
		response.json(evolution);
	} catch (error) {
		response.status(500);
		throw new Error("Server error.");
	}
}); 

module.exports = {
	getEvolutions,
	getEvolutionById,
};
