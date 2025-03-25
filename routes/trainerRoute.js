const {Router} = require("express");
const trainerRouter = Router();
const trainerController = require("../controllers/trainerController")

trainerRouter.get("/", trainerController.getAllTrainers)

trainerRouter.get("/create", trainerController.createSiteTrainers)
trainerRouter.post("/create", trainerController.createTrainer)


trainerRouter.post("/:id/delete", trainerController.deleteTrainer)

trainerRouter.post("/:id/deletePokemon", trainerController.deletePokemonInTeam)
trainerRouter.get("/:id/transferPokemon/:pokemonName", trainerController.transferSitePokemon)
trainerRouter.post("/:id/transferPokemon/:pokemonName/:trainerId", trainerController.transferPokemon)



trainerRouter.get("/:id/update", trainerController.updateSiteTrainer);
trainerRouter.post("/:id/update", trainerController.updateTrainer);

trainerRouter.get("/:id/profile", trainerController.trainerSiteProfile);

trainerRouter.get("/:id/battle", trainerController.battleSite)
trainerRouter.post("/:id/battle", trainerController.battle)

//trainerRouter.post("/:id/catch", trainerController.catchPokemon)


module.exports = trainerRouter;