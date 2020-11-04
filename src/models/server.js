const mongoose = require('mongoose')

const Server = new mongoose.Schema({
    name: {type:String, required:true},
    password: {type:String, required:true},
    users: {type:Array, required:true}
})

module.exports = mongoose.model('servers', Server)