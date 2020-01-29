const mongoose = require("mongoose");
const dbPath = "mongodb://root:root@cluster0-shard-00-00-pbpji.mongodb.net:27017,cluster0-shard-00-01-pbpji.mongodb.net:27017,cluster0-shard-00-02-pbpji.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});
module.exports = mongoose;
