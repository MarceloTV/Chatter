const User = require('../models/user')
const passport = require('passport')

//Signup User
const signup = (req,res) => {
    const {email,name,password} = req.body

    //Auth verify
    if(req.isAuthenticated()){
        return res.status(200).redirect('/app')
    }

    User.findOne({email}, (err,exist) => {
        if(exist){
            return res.status(400).render('index',{error: {exist:true,message:'Email already exists',type:'register'}})
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

//Login User
const login = (req,res,next) => {

    //Auth verify
    if(req.isAuthenticated()){
        return res.status(200).redirect('/app')
    }

    passport.authenticate('local', (err,user,info) => {
        if(err){
            next(err)
        }

        if(!user){
            return res.status(400).render('index',{error: {exist:true,message:'Invalid email or passoword',type:'login'}})
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