const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.upeallf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const serviceCollection = client.db("geniusCar").collection("services");
    const orderCollection = client.db("geniusCar").collection("orders");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);

      res.send(service);
    });

    //orderapi

    //shb order dekhar jonno plus oi specif registered email diye rakhar jonno ....

    //perticular email diye koyta order oigula shb read or load
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          // kon email ke diye milaite chai
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Runningggggggggg");
});

app.listen(port, () => {
  console.log("server is running on port : ", port);
});
