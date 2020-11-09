//Route Module
const Route = require('express').Router()

//Auth functions
const auth = require('../functions/auth')

//Renders
const client = require('../functions/client')

//Server functions
const server = require('../functions/server')

//Chat
const app = require('../functions/app')

//Index
Route.get('/', client.index)

//Signup User
Route.post('/signup', auth.signup)

//Login User
Route.post('/login', auth.login)

//Chatter app
Route.get('/app', client.app)

//Create Server
Route.post('/create_server', server.createServer)

//Enter Server
Route.post('/login_server', server.loginServer)

//Chatter server
Route.post('/server', app.server)

//getUser
Route.get('/getUser', (req,res) => {
    res.send(req.user)
})

//Log Out
Route.get('/logout', (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(404).redirect('/')
    }
    req.logOut()
    res.redirect('/')
})

module.exports = Route