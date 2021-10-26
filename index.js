const express = require('express');
const { MongoClient } = require('mongodb')
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json())
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyncv.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run()=>{
    try{
        await client.connect();
        const database = client.db(`${process.env.DB_NAME}`)
        const services = database.collection("services");

        //get api

        app.get('/services', async(req, res)=>{
            const findData = services.find({})
            const result = await findData.toArray()
            console.log(result);
            res.send(result)
            
        })

        //Post Api
        app.post('/services',async (req, res)=>{
           
            const data = req.body.allInfo
            const result = await services.insertOne(data);
            res.send(result)            
        })


        // delete

        app.delete('/service/:id', async(req, res)=>{
            const id = req.params.id
            const params = {_id: ObjectId(id)}
            const result = await services.deleteOne(params)
            res.send(result)
            
        })
        
        
        
    }
    finally{

    }
}

run().catch(err => console.log(err)
)


app.listen(port, ()=>{
    console.log("listening from port", port)
    
})