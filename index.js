const express = require('express');
const cors = require('cors');
const { ObjectId,MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5007;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lxrexps.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('sakibsKitchen').collection('services');
        const reviewCollection = client.db('sakibsKitchen').collection('review');
        const newServiceCollection = client.db('sakibsKitchen').collection('newService');
       

        //api list
        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
         app.get('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await serviceCollection.findOne(query);
            res.send(review);
        });
        app.get('/allServices', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        })
        
        //review api
        app.get('/reviews',async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.patch('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const status = req.body.status
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        // newservice api list
        app.post('/newService', async(req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })
        
    }
    finally{

    }


}
run().catch(err => console.error(err));

app.get('/', (req, res) =>{
    res.send('sakibs kitchen server is running')
})

app.listen(port, () =>{
    console.log(`sakibs kitchen server running on ${port}`);
})