const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quqb4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const furnitureCollection = client.db('furnituredb1').collection('store1');

        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = furnitureCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page*size).limit(size).toArray(); 
            }
            else {
                products = await cursor.toArray();
            }
             
            res.send(products);
        })

        app.get('/productCount', async (req, res) => {
            const query = {};
            const cursor = furnitureCollection.find(query);
            const count = await furnitureCollection.estimatedDocumentCount();
            res.send({ count });
        })

    }
    finally {
        
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('wirehouse is running')
});
// async function run() {
//     try {
//         await client.connect();
//         const furnitureCollection =client.db('furnituredb').collection
//     }
// }

app.listen(port, () => {
    console.log('server is ready',port);
})