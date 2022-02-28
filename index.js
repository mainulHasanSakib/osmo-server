const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors =require('cors')
const port =process.env.PORT|| 5000
require('dotenv').config()
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sm9ey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
    res.send('Hello !')
  })

  async function run(){
    try {
      await client.connect();
      const database = client.db("osmouser");
      const postCollection = database.collection("posts");
      const userCollection =database.collection('user');
  //get

  app.get('/posts', async(req, res)=>{
    const cursor = postCollection.find({});
    const post =await cursor.toArray();
    res.send(post);
    })
  app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
})
  //post



  app.post('/users',async(req, res)=>{
    const user =req.body;
    const result =await userCollection.insertOne(user)
    res.json(result)
    }  )
  app.post('/posts',async(req, res)=>{
    const post =req.body;
    const result =await postCollection.insertOne(post)
    res.json(result)
    }  )


    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      });
  
      app.put('/users/admin', async(req,res)=>{
        const user=req.body
        const filter ={email: user.email}
        const updateDoc={$set: {role:'admin'}}
        const result = await userCollection.updateOne(filter, updateDoc)
        res.json(result)
     })



    }
    finally {
     
    }
  
  }








  run().catch(console.dir);
 
  app.listen(port, () => {
    console.log(` listening on port ${port}`)
  })