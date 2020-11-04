const express = require('express')
const app = express()
const http = require('http').Server(app)
const session = require('express-session')
const store = require('connect-mongo')(session)
const path = require('path')
const morgan = require('morgan')
const passport = require('passport')
const io = require('socket.io')(http)

app.use(morgan('dev'))

//Sessions
app.use(session({
    secret: 'Minatozaki',
    resave: true,
    saveUninitialized: true,
    store: new store({
        url: 'mongodb://localhost:27017/chatter',
        autoReconnect: true
    })
}))

//Sockets
require('./config/socket')(io)

//Configs
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded( {extended:false} ))
app.use(express.json())
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

//Oauth
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

//Database
require('./config/database')

//Routes
app.use('',require('./routes/index.routes'))

http.listen(3000, () => {
    console.log('Server is connected on port',3000)
})