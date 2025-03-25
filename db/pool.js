const {Pool} = require("pg");
require('dotenv').config("../.env");

module.exports = new Pool({
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    post: 5432
}) 