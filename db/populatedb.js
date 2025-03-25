const {Client} = require('pg');
require('dotenv').config();

const changePokemonData = async(pokemon, pokemonInfo)=>{
    try{
        const res = await fetch(pokemonInfo.url);
        const pokemonData = await res.json();
        pokemon['weight'] = pokemonData.weight;
        pokemon.height = pokemonData.height;
        pokemon.location_area_encounters = pokemonData.location_area_encounters;
        //download img
        pokemon.img = pokemonData.sprites.front_default;
        //get abilities
        let pokemonAbility = []
        pokemonData.abilities.forEach(ability =>{
            pokemonAbility.push(ability.ability.name);
        })
        pokemon.abilities = pokemonAbility;
        //get types
        let pokemonTypes = []
        pokemonData.types.forEach(type =>{
            pokemonTypes.push(type.type.name);
        })
        pokemon.types = pokemonTypes;
        return pokemon
    }catch(e){
        console.error(e);
    }
    
}

const fetchPokemons = async () =>{
    //https://pokeapi.co/api/v2/pokemon/?offset=0&limit=500
    const pokemonList = [];
    try{
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=500")
        const data = await res.json();
        for (const pokemonInfo of data.results) {
            let pokemon = {
                name: pokemonInfo.name,
                types: [], weight: 0, height: 0, location_area_encounters: "", img: "", abilities: []
            };
            pokemon = await changePokemonData(pokemon, pokemonInfo);
            pokemonList.push(pokemon);
        }

    }catch(e){
        console.error(e);
    }
    return pokemonList;
}

const SQLTableInit = `
CREATE TABLE IF NOT EXISTS pokedex (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255),
    types VARCHAR (255) [],
    weight INTEGER,
    height INTEGER,
    location_area_encounters VARCHAR (255),
    img VARCHAR (255),
    abilities VARCHAR (255) []
);

CREATE TABLE IF NOT EXISTS trainers(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255),
    age INTEGER,
    pokemon_owned VARCHAR [],
    battles INTEGER,
    wins INTEGER,
    losses INTEGER
);
`

const SQLInsertFunc = async ()=>{
    const pokemonList = await fetchPokemons();
    let SQL = "";
    pokemonList.forEach(pokemon => {
        SQL += `INSERT INTO pokedex (name, types, weight, height, location_area_encounters, img, abilities) VALUES ('${pokemon.name}', '{${pokemon.types}}', ${pokemon.weight}, ${pokemon.height}, '${pokemon.location_area_encounters}', '${pokemon.img}', '{${pokemon.abilities}}');`
    });
    return SQL;
}

async function main(){
    console.log("seeding...");
    const client = new Client({
        host: "localhost",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,  
        port: 5432
    })

    const pokeData = await SQLInsertFunc();

    await client.connect();
    await client.query(SQLTableInit);
    await client.query(pokeData);
    await client.end();

    console.log("done");
}


main()