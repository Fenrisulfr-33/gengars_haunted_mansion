const asyncHandler = require('express-async-handler');
const Evolutions = require('./model');

const getEvolutions = asyncHandler(async (req, res) => {
	let evolutions = await Evolutions.find().sort();
	res.json(evolutions);
});

const getEvolutionById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	let evolution = await Evolutions.findById(id);
	res.json(evolution);
}); 

module.exports = {
	getEvolutions,
	getEvolutionById,
};
