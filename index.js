require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

//Deta Setup
const { Deta } = require("deta")
const deta_project_key = process.env.deta_project_key
const deta = Deta(deta_project_key);
const dbProduct = deta.Base('products')

//Cors Setup
    //Warning: on production select only specific domain
app.use(cors());

//Routing

app.post('/products', async (req, res) => {
    const { title, body } = req.body;
    
    const newData = {
        title: title,
        body: body,
        reviews: [],
        created_at: new Date()
    }
    const data = await dbProduct.put(newData)

    res.status(201).json(data)
});

app.get('/products', async (req, res) => {
    const data = await dbProduct.fetch()
    res.status(201).json(data)
});

app.get('/products/:key', async (req, res) => {
    const { key } = req.params;
    const data = await dbProduct.get(key);
    res.status(201).json(data)
});

app.post('/reviews/:key', async (req, res) => {
    const { key } = req.params;
    let { star_count, review } = req.body;

    //Validate star between 1-5
    star_count = parseInt(star_count)
    if(star_count < 1 || star_count > 5) {
        return res.status(500).json({ error: 'star count must be between 1 to 5' })
    }
    
    //Get and join with previous reviews
    const product = await dbProduct.get(key);
    let oldReviews = product.reviews
    oldReviews.push({star_count, review})

    const updates = { reviews: oldReviews }
    const data = await dbProduct.update(updates, key);
    
    res.status(201).json(data)
});



const port = 5000
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})
module.exports = app