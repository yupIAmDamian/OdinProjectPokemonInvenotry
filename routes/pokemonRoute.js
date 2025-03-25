const {Router} = require("express");
const pokemonRouter = Router();

const pokemonController = require("../controllers/pokemonController");

pokemonRouter.get("/", pokemonController.getAllPokemon)

pokemonRouter.get("/random", pokemonController.randomPokemon)

pokemonRouter.get("/create", pokemonController.createSitePokemon)
pokemonRouter.post("/create", pokemonController.createPokemon)

pokemonRouter.get("/:page", pokemonController.getAllPokemon)
pokemonRouter.get("/:page/find/", pokemonController.findPokemons)


pokemonRouter.get("/:id/update", pokemonController.updateSitePokemon)
pokemonRouter.post("/:id/update", pokemonController.updatePokemon)

pokemonRouter.post("/:id/delete/", pokemonController.deletePokemon)

module.exports = pokemonRouter;