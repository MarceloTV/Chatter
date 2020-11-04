const Route = require('express').Router()
const auth = require('../functions/auth')
const client = require('../functions/client')
const server = require('../functions/server')
const app = require('../functions/app')

Route.get('/', client.index)
Route.post('/signup', auth.signup)
Route.post('/login', auth.login)
Route.get('/app', client.app)
Route.post('/create_server', server.createServer)
Route.post('/login_server', server.loginServer)
Route.post('/server', app.server)

Route.get('/getUser', (req,res) => {
    res.send(req.user)
})

Route.get('/logout', (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(404).redirect('/')
    }
    req.logOut()
    res.redirect('/')
})

module.exports = Route