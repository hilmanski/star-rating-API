require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Deta Setup
const { Deta } = require("deta")
const deta_project_key = process.env.deta_project_key
const deta = Deta(deta_project_key);
const db = deta.Base('products')

//Cors Setup
    //Warning: on production select only specific domain
app.use(cors());

//Routing

app.post('/products', async (req, res) => {
    const { title, body } = req.body;
    
    const newData = {
        title: title,
        body: body,
        created_at: new Date()
    }
    const data = await db.put(newData)

    res.status(201).json(data)
});

app.get('/products', async (req, res) => {
    const data = await db.fetch()
    res.status(201).json(data)
});



const port = 5000
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})
module.exports = app