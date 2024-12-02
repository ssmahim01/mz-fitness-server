const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3500;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybs8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const gymSchedules = client.db("schedulesDB").collection("schedules");

    app.get("/schedules", async(req, res) => {
        const result = await gymSchedules.find().toArray();
        res.send(result);
    });

    app.post("/schedules", async(req, res) => {
        const newSchedule = req.body;
        const result = await gymSchedules.insertOne(newSchedule);
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("MZ fitness server is running");
});

app.listen(port, () => {
    console.log(`The server is running on ${port}`);
});