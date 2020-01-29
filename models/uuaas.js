const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UuaaSchema = new Schema({
    name: String
})

module.exports = mongoose.model('uuaas', UuaaSchema);