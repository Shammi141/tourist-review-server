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
        //creating service collection
        const serviceCollection = client.db('tourReview').collection('services');
        //creating orderedReview collection
        const orderedReviewCollection = client.db('tourReview').collection('reviews');

        //creating api for loading services data
        app.get('/lim', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

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

        //for add review
        app.get('/services/addreview/:id', async(req, res) =>{
            const id= req.params.id;
            const query = {_id:ObjectId(id)};
            const services = await serviceCollection.findOne(query);
            console.log(services);
            res.send(services);
        });

        //creating userReview api to the server
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await orderedReviewCollection.insertOne(review);
            res.send(result);
        });

        //for showing review based on users email
        app.get('/reviews', async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderedReviewCollection.find(query).sort({ time: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        //for showing review based on review id
        app.get('/servicesreviews/:id', async(req, res) =>{
            const id = req.params.id;
            let query = {serviceId:id};
            const cursor = orderedReviewCollection.find(query).sort({ time: -1 });
            const serviceReview = await cursor.toArray();
            res.send(serviceReview);
        });

        //for delete review
        app.delete('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderedReviewCollection.deleteOne(query);
            res.send(result);
        });

        //for edit review
        app.get('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const review = await orderedReviewCollection.findOne(query);
            console.log(review);
            res.send(review);
        });
        app.put('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const newReview = req.body
            const query = {_id:ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    serviceId: newReview.serviceId,
                    reviewerName: newReview.reviewerName,
                    email: newReview.email,
                    image: newReview.image,
                    message: newReview.message

                }
            }
            const review = await orderedReviewCollection.updateOne(query, updatedDoc, options);
            
            console.log(review);
            res.send(review);
        });

        //add service
        app.post('/addservice', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
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