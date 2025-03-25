const {PokemonQuery} = require("../db/queries")
const pokemonQuery = new PokemonQuery()


exports.getAllPokemon = async(req,res)=>{
    const allPokemon = await pokemonQuery.getAllPokemon(parseInt(req.params.page) || 0)
    res.render("../views/poke/index.ejs", {allPokemon})
}

exports.findPokemons = async(req,res)=>{
    const allPokemon = await pokemonQuery.findPokemons(req.query, parseInt(req.params.page))
    res.render("../views/poke/index.ejs", {allPokemon})
}

exports.randomPokemon = async (req,res)=>{
    const pokemon = await pokemonQuery.getRandomPokemon()
    console.log(pokemon)
    res.send(pokemon)
}

exports.updateSitePokemon = async(req,res)=>{
    const pokemonData = await pokemonQuery.findPokemonById(parseInt(req.params.id))
    res.render("../views/poke/pokemonUpdate.ejs", {pokemonData: pokemonData[0]})
}

exports.updatePokemon = async(req,res)=>{
    const pokemonData = req.body
    await pokemonQuery.updatePokemonById(parseInt(req.params.id), pokemonData)
    res.redirect("/poke/0")
}

exports.createSitePokemon = async(req,res)=>{
    res.render("../views/poke/pokemonCreate.ejs")
}

exports.createPokemon = async(req,res)=>{
    const pokemonData = req.body
    await pokemonQuery.createPokemon(pokemonData)
    res.redirect("/poke/0")
}

exports.deletePokemon = async(req,res)=>{
    await pokemonQuery.deletePokemon(parseInt(req.params.id))
    res.redirect("/poke/0")
}