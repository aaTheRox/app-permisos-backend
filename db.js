const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log(" ---------------- Conectado a MongoDB con éxito ----------------'");
});
module.exports = mongoose;