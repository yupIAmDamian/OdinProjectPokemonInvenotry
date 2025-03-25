const pool = require("./pool")



class PokemonQuery{
    constructor(){
        this.pool = pool
        this.limit = 20
        this.offset = 0
        this.plannedOffset = Math.round(this.offset * this.limit)
        this.db_len = 0
    }

    async offsetSetter(page){
        this.offset = page
        this.plannedOffset = Math.round(page * this.limit)
    }

    async getDBLength(){
        const {rows} = await this.pool.query("SELECT COUNT(*) FROM pokedex;")
        return rows[0].count
    }

    async getRandomPokemon(){
        this.db_len = await this.getDBLength()
        const randomPokemon = Math.round(Math.random() * this.db_len)
        return this.pool.query("SELECT name FROM pokedex WHERE id = $1",[randomPokemon])
    }

    async getAllPokemon(page){
        this.offsetSetter(page)
        const {rows} = await this.pool.query("SELECT * FROM pokedex LIMIT $1 OFFSET $2;",[this.limit, this.plannedOffset])
        return rows
    }

    async findPokemons(query, page){
        const name = `%${query.name}%`
        const type = `%${query.type}%`

        this.offsetSetter(page)

        const {rows} = await this.pool.query(
            "SELECT * FROM pokedex WHERE LOWER(name) LIKE LOWER($1) AND LOWER(array_to_string(types, ',')) LIKE LOWER($2) LIMIT $3 OFFSET $4;",[name, type, this.limit, this.plannedOffset] )
        return rows
    }

    async findPokemonById(id){
        const {rows} = await this.pool.query(
            "SELECT * FROM pokedex where id = $1", [id]
        )
        return rows
    }

    async updatePokemonById(id, pokemonData){
        let {pokemonName, types, height, weight, abilities, image} = pokemonData
        abilities = "{" + abilities.split(" ").join(",") + "}"
        types = "{" + types.split(" ").join(",") + "}"
        await this.pool.query(
            "UPDATE pokedex SET name = $1, types = $2, height = $3, weight = $4, abilities = $5, img = $6 WHERE id = $7;",[pokemonName, types, height, weight, abilities, image, id]
        )
    }

    async createPokemon(pokemonData){
        let {pokemonName, types, height, weight, abilities, image} = pokemonData
        abilities = "{" + abilities.split(" ").join(",") + "}"
        types = "{" + types.split(" ").join(",") + "}"

        await this.pool.query(
            "INSERT INTO pokedex (name, types, height, weight, abilities, img) VALUES ($1, $2, $3, $4, $5, $6)", [pokemonName, types, height, weight, abilities, image]
        )
    }

    async deletePokemon(id){
        await this.pool.query("DELETE FROM pokedex WHERE id = $1;",[id])
    }
}

class TrainerQuery{
    constructor(){
        this.pool = pool
        this.limit = 20
        this.offset = 0
        this.plannedOffset = Math.round(this.offset * this.limit)
    }

    async getAllTrainers(){
        const {rows} = await this.pool.query("SELECT * FROM trainers;")
        return rows
    }

    async findTrainerById(id){
        const {rows} = await this.pool.query(
            "SELECT * FROM trainers where id = $1", [id]
        )
        return rows[0] 
    }

    async createTrainer(data){
        await this.pool.query(
            "INSERT INTO trainers (name, age, battles, wins, losses) VALUES ($1, $2, 0, 0, 0)", [data.trainerName, data.age || 0]
        )
    }

    async updateTrainer(id,data){
        let {name, age, pokemon_owned, battles, wins, losses} = await this.findTrainerById(id)
        const {trainerName, trainerAge, pokemonName, battleState} = data
        
        if (pokemon_owned){
            if (pokemon_owned.includes(pokemonName)){
                return
            }
            pokemon_owned.push(pokemonName)
        }else{
            pokemon_owned = [pokemonName]
        }

        if(battleState === "win"){
            wins += 1
            battles += 1
        }else if(battleState === "lose"){
            losses += 1
            battles += 1
        }

        await this.pool.query(
            "UPDATE trainers SET name = $1, age = $2, pokemon_owned = $3, battles = $4, wins = $5, losses = $6 WHERE id = $7;", 
            [trainerName || name, trainerAge || age, pokemon_owned, battles, wins, losses, id]
        )
    }

    async deletePokemonInTeam(trainerId, pokemonName){
        const {pokemon_owned} = await this.findTrainerById(trainerId)
        const newPokemonOwned = pokemon_owned.filter(pokemon => pokemon !== pokemonName)
        console.log(newPokemonOwned)
        await this.pool.query(
            "UPDATE trainers SET pokemon_owned = $1 WHERE id = $2;", [newPokemonOwned, trainerId]
        )
    }

    async transferPokemon(trainerId, newTrainerId, pokemonName){
        await this.deletePokemonInTeam(trainerId, pokemonName)
        await this.updateTrainer(newTrainerId, {pokemonName})
    }


    async deleteTrainer(id){
        await this.pool.query("DELETE FROM trainers WHERE id = $1;", [id])
    }

    async battleTrainer(trainerId, enemyId){
        let playerPokemon, enemyPokemon
        try{
            playerPokemon = await this.pool.query(
                "SELECT ARRAY_LENGTH(pokemon_owned,1) FROM trainers WHERE id = $1;", [trainerId]
            )
            enemyPokemon = await this.pool.query(
                "SELECT ARRAY_LENGTH(pokemon_owned,1) FROM trainers WHERE id = $1;", [enemyId]
            )
        }catch(err){
            console.log(err)
        }

        const player_arr = playerPokemon?.rows[0]?.array_length || 0
        const enemy_arr = enemyPokemon?.rows[0]?.array_length || 0
        if(player_arr >= enemy_arr){
            await this.updateTrainer(trainerId, {battleState: "win"})
            await this.updateTrainer(enemyId, {battleState: "lose"})
            console.log("Player wins")
        }else{
            await this.updateTrainer(trainerId, {battleState: "lose"})
            await this.updateTrainer(enemyId, {battleState: "win"})
            console.log("Enemy wins")
        }
    }
}

module.exports = {PokemonQuery, TrainerQuery}