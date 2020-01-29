const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    name: {
        type: String,
        
    },
    uuaas: {
        type: Array
    },
})

module.exports = mongoose.model('roles', RoleSchema);