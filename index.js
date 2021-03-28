const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const cors = require('cors')
const port = 4000

app.use(cors())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const productsCollection = client.db("emasohnstore").collection("emajohnproduct");
  const ordersCollection = client.db("emasohnstore").collection("emajohnproductorders");

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product);
    productsCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productsKeys = req.body;
    productsCollection.find({ key: { $in: productsKeys } })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  // perform actions on the collection object
});



app.listen(process.env.PORT || port)