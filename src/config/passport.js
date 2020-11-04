const passport = require('passport')
const local = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser((user,done) => {
    done(null,user._id)
})

passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) => {
        done(err,user)
    })
})

passport.use(new local(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email,password,done) => {
        User.findOne({email},(err,user) => {
            if(!user){
                return done(null,false,{message: 'User not exist'})
            }else{
                user.compare(password,(err,equal) => {
                    if(equal){
                        return done(null,user)
                    }else{
                        return done(null,false,{message: 'Invalid Password'})
                    }
                })
            }
        })
    }
))