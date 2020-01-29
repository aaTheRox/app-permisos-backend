
const MongoClient = require('mongodb').MongoClient;

try {
    const uri = "mongodb://root:root@mycluster0-shard-00-00.mongodb.net:27017,mycluster0-shard-00-01.mongodb.net:27017,mycluster0-shard-00-02.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        console.log('connected')
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
    });
    
} catch (error) {
    console.log('ERROR: ', error)
}
