const { TrainerQuery } = require("../db/queries");

const trainerQuery = new TrainerQuery();

exports.getAllTrainers = async (req, res) => {
  const trainers = await trainerQuery.getAllTrainers();
  res.render("../views/train/index.ejs", { trainers });
};

exports.findTrainers = async (req, res) => {
  const trainers = [1, 2, 3, 4, 5];
  res.render("../views/train/index.ejs", { trainers });
};

exports.createSiteTrainers = async (req, res) => {
  res.render("../views/train/createTrainer");
};

exports.createTrainer = async (req, res) => {
  await trainerQuery.createTrainer(req.body);
  res.redirect("/train");
};

exports.deleteTrainer = async (req, res) => {
  await trainerQuery.deleteTrainer(req.params.id);
  res.redirect("/train");
};

exports.updateSiteTrainer = async (req, res) => {
  const trainer = await trainerQuery.findTrainerById(req.params.id);
  res.render("../views/train/updateTrainer", { trainer });
};

exports.updateTrainer = async (req,res)=>{
  //console.log(req.body, "body")
  await trainerQuery.updateTrainer(parseInt(req.params.id), req.body);
    
}

exports.deletePokemonInTeam = async(req,res)=>{
    console.log(req.body)
    await trainerQuery.deletePokemonInTeam(parseInt(req.params.id), req.body.pokemonName)
    res.redirect("/train/"+req.params.id + "/profile")
}

exports.transferSitePokemon = async(req,res)=>{
    const trainer = await trainerQuery.findTrainerById(parseInt(req.params.id));
    let trainers = await trainerQuery.getAllTrainers()
    trainers = trainers.filter(trainer => trainer.id !== parseInt(req.params.id));
    const pokemon = req.params.pokemonName
    console.log(trainer,pokemon)
    res.render("../views/train/transferPokemon", {trainers})

}

exports.transferPokemon = async(req,res)=>{
    await trainerQuery.transferPokemon(parseInt(req.params.id), parseInt(req.params.trainerId), req.params.pokemonName)
}

exports.trainerSiteProfile = async(req,res)=>{
    const trainer = await trainerQuery.findTrainerById(parseInt(req.params.id));
    res.render("../views/train/trainerPage", {trainer});
}

exports.battleSite = async(req,res)=>{
    let trainers = await trainerQuery.getAllTrainers()
    trainers = trainers.filter(trainer => trainer.id !== parseInt(req.params.id));
    res.render("../views/train/battleTrainer", {trainers, trainerId: parseInt(req.params.id)});
}

exports.battle = async(req,res)=>{
  await trainerQuery.battleTrainer(parseInt(req.params.id), parseInt(req.body.trainer))
  res.redirect(`/train/${req.params.id}/profile`)
}
