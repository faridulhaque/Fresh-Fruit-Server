const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// ----------using middleware--------------------------------

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.baebe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const fruitCollection = client.db('freshFruit').collection('fruit');
        app.get('/fruits', async (req, res) =>{
            const query = {};
            const cursor = fruitCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })
        app.get('/fruit/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const fruit = await fruitCollection.findOne(query);
            res.send(fruit);
        })
        app.get('/myItems', async (req, res) =>{
            const email = req.query.email;
            
            const query = {email: email};
            const cursor = fruitCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        })
        

        app.put('/fruit/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedInfo = req.body;
            const query = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedInfo.quantity,
                    
                    sold: updatedInfo.sold,
                    
                }
            };
            const result = await fruitCollection.updateOne(query, updatedDoc, options);
            res.send(result);

        })
        app.post('/fruits', async (req, res) =>{
            const newItem = req.body;
            const result = await fruitCollection.insertOne(newItem);
            res.send(result);
        })
       
        app.delete('/fruit/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await fruitCollection.deleteOne(query);
            res.send(result);
        })
        
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running my server');
})
app.listen(port, ()=>{
    console.log('listening on port', port)
})