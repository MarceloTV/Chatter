const User = require('../models/user')
const passport = require('passport')

const signup = (req,res) => {
    const {email,name,password} = req.body

    User.findOne({email}, (err,exist) => {
        if(exist){
            return res.status(403).send('Email already exists')
        }

        new User({
            email,
            name,
            password,
            servers: []
        }).save((err,user) => {
            if(err){
                return console.log(err)
            }
    
            req.logIn(user, err => {
                if(err){
                    return console.log(err)
                }
    
                res.status(200).redirect('/app')
            })
        })
    })
}

const login = (req,res,next) => {
    passport.authenticate('local', (err,user,info) => {
        if(err){
            next(err)
        }

        if(!user){
            return res.status(404).send('Invalid email or passoword')
        }

        req.logIn(user, err => {
            if(err){
                next(err)
            }

            res.status(200).redirect('/app')
        })
    })(req,res,next)
}

module.exports = { signup , login }