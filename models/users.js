const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    user: String,
    password: String,
    token: String,
    active: {
        type: Boolean,
        default: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    uuaas: {
        type: Array
    },
    role: {
        type: String,
    }
})

module.exports = mongoose.model('users', UserSchema);