const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const User = new mongoose.Schema({
    email: {type:String, required:true},
    name: {type:String, required:true},
    password: {type:String, required:true},
    servers: [String]
})

User.pre('save',function(next){
    if(!this.isModified('password')){
        return next()
    }

    bcrypt.genSalt(10, (err,salt) => {
        if(err){
            next(err)
        }

        bcrypt.hash(this.password,salt,null,(err,hash) => {
            if(err){
                next(err)
            }
            this.password = hash
            next()
        })
    })
})

User.methods.compare = function(pass,cb){
    bcrypt.compare(pass,this.password,(err,equal) => {
        if(err){
            return cb(err)
        }

        cb(null,equal)
    })
}

module.exports = mongoose.model('users',User)