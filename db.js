
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0-pbpji.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  console.log('connected');
  const collection = client.db("test").collection("users");
  console.log(collection);
  // perform actions on the collection object
  client.close();
});
