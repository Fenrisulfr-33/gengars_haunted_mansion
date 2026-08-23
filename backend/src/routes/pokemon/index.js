const router = require("express").Router();
const pokemon = require('./pokemon.controller');
const national = require("./national/national.controller");
const dexes = require("./gameDexes/game-dexes.controller");
const moves = require("./moves/moves.controller");
const abilities = require("./abilities/controller");
const search = require("./search/search.controller");
const evolutions = require("./evolutions/controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

const methodNotAllowedWrapper = (allowedMethods) => {
    return (request, response, next) => {
        methodNotAllowed(request, response, next, allowedMethods);
    };
};

router.route('/').get(pokemon.listNames).all(methodNotAllowedWrapper(['GET']));

router.route("/national").get(national.list).all(methodNotAllowedWrapper(['GET']));

router.route("/national/:id").get(national.read).all(methodNotAllowedWrapper(['GET']));
router.route("/national/:id/:game").get(national.read).all(methodNotAllowedWrapper(['GET']));

router.route("/:game/pokedex").get(dexes.list).all(methodNotAllowedWrapper(['GET']));

router.route("/moves").get(moves.list).all(methodNotAllowedWrapper(['GET']));

router.route("/moves/names").get(moves.listNames).all(methodNotAllowedWrapper(['GET']));

router.route("/moves/:id").get(moves.read).all(methodNotAllowedWrapper(['GET']));
router.route("/moves/:id/:game").get(moves.read).all(methodNotAllowedWrapper(['GET']));

router.route("/abilities").get(abilities.list).all(methodNotAllowedWrapper(['GET']));

router.route("/abilities/:id").get(abilities.read).all(methodNotAllowedWrapper(['GET']));

router.route("/evolutions").get(evolutions.getEvolutions).all(methodNotAllowedWrapper(['GET']));

router.route("/search").get(search.read).all(methodNotAllowedWrapper(['GET']));

module.exports = router;
