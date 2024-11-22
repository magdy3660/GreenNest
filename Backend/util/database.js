const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv').config()
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
const uri = MONGO_CONNECTION_STRING
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function mongoConnect(callback) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    .then (client => {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        _db = client.db()
    }).catch(err => {
        console.log(err)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw new Error('No database found')
}

exports.mongoConnect= mongoConnect
exports.getDb = getDb