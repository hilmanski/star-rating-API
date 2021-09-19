require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const app = express()

//Deta Setup
const { Deta } = require("deta")
const deta_project_key = process.env.deta_project_key
const deta = Deta(deta_project_key);

//Cors Setup
    //Warning: on production select only specific domain
app.use(cors());

//Routing
app.get('/', (req, res) => res.send('Hello World!'))




module.exports = app