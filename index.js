const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middle wares
app.use(cors());
app.use(express.json());

//mongodb information
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yjnxy2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('tourReview').collection('services');

        //creating api for loading services data
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //services api for service details
        app.get('/services/:id', async(req, res) =>{
            const id= req.params.id;
            const query = {_id:ObjectId(id)};
            const services = await serviceCollection.findOne(query);
            console.log(services);
            res.send(services);
        });
    }
    finally{

    }
}

run().catch(error => console.error(error));

app.get('/', (req, res) =>{
    res.send('Tourist review server is running');
});

app.listen(port, () =>{
    console.log(`Tourist review server is running on: ${port}`);
})