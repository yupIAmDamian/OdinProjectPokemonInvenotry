const express = require('express');
const app = express();

const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.use("/train",require("./routes/trainerRoute"))
app.use("/poke",require("./routes/pokemonRoute"))

app.get("/",(req,res)=>{
    res.render("./index.ejs")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server started on location: http://localhost:${PORT}`);
});