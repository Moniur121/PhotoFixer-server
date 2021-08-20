const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

//https server port....
const port = 5000;

// Mongodb database import link...
const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.1brmu.mongodb.net/${process.env.DV_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => error && console.log(error)
);

client.connect((err) => {
  const serviceCollection = client.db("photoGraphy").collection("services");
  const buyServiceCollection = client
    .db("photoGraphy")
    .collection("buyService");
  const paymentOrderCollection = client
    .db("photoGraphy")
    .collection("orderCollection");
    const makingAdminCollection = client
    .db("photoGraphy")
    .collection("makeAdmin");
  app.post("/addServices", (req, res) => {
    const addService = req.body;
    serviceCollection.insertOne(addService).then((result) => {
      res.send(result);
      console.log(result);
    });
  });
  app.get("/getService", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => res.send(documents));
  });
  app.delete("/deleteCourse/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => console.log(result));
  });
  app.patch("/serviceUpdate", (req, res) => {
    console.log(req.body);
    const updateData = {
      serviceName: req.body.serviceName,
      price: req.body.price,
      description: req.body.description,
    };
    if (req.body.imgUrl !== null) {
      updateData.imgUrl = req.body.imgUrl;
    }
    serviceCollection
      .updateOne({ _id: ObjectId(req.body.id) }, { $set: { ...updateData } })
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  app.post("/buyService", (req, res) => {
    const buyService = req.body;
    buyServiceCollection.insertOne(buyService).then((result) => {
      res.send(result);
      console.log(result);
    });
  });
  app.get("/getBuyService", (req, res) => {
    buyServiceCollection
      .find({})
      .toArray((err, documents) => res.send(documents));
  });

  //dashboard product delete.....
  app.delete("/deleteProduct/:id", (req, res) => {
    buyServiceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => console.log(result));
  });
  //payment successfully...
  app.delete("/paymentSuccess/:id", (req, res) => {
    // const item =req.body;
    buyServiceCollection.deleteMany().then((result) => console.log(result));
  });
  // payment updated....
  app.patch("/updateOrder", (req, res) => {
    console.log(req.body);
    paymentOrderCollection
      .updateOne(
        { _id: ObjectId(req.body.id) },
        { $set: { status: req.body.status } }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // Payment order progress...
  app.post("/paymentOrder", (req, res) => {
    const paymentOrder = req.body;
    paymentOrderCollection.insertOne(paymentOrder).then((result) => {
      res.send(result);
      console.log(result);
    });
  });
  app.get("/getPaymentOrder", (req, res) => {
    paymentOrderCollection
      .find({})
      .toArray((err, documents) => res.send(documents));
  });

  app.post("/makeAdmin", (req, res) => {
    const admin = req.body;
    makingAdminCollection.insertOne(admin).then((result) => {
      res.send(result);
      // console.log(result);
    });
  });
  app.post('/getAdmin', (req,res)=>{
    const email = req.body.email;
    makingAdminCollection.find({email:email})
    .toArray((err, documents) => {
         res.send(documents.length > 0)
    })
    // console.log(admin)
  })
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});
// sending server port https request....
app.listen(process.env.PORT || port);