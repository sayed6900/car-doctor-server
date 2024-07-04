const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000 ;

//Middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tts22yk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('Car-Doctor').collection('services')
    const bookingCollection = client.db('Car-Doctor').collection('checkout')

    // to find all the elements 
    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
   
    // to find just single one element
    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: {  title: 1, price: 1 , service_id: 1},
          };
        const query = {_id: new ObjectId(id)};
        const result = await serviceCollection.findOne(query)
        res.send(result)
    })

     // Booking 
     app.post('/checkout',async(req,res)=>{
        const checkout = req.body
     })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send('Car Doctor server is running')
})

app.listen(port, ()=>{
    console.log(`car doc server is running on port: ${port}` )
})