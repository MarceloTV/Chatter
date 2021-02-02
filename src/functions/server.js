const Server = require('../models/server')
const User = require('../models/user')

//Create Server
const createServer = async (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(403).redirect('/')
    }    
    try{
        const {name,password,id} = req.body
        const login = await User.findById(id)

        if(!login){
            return res.status(403).send('no login')
        }
        if(String(req.user._id) != String(login._id)){
            console.log(String(req.user._id))
            console.log(String(login._id))
            return res.status(403).send('fake id')
        }

        const exist = await Server.findOne({name})
        if(exist){
            return res.status(400).render('app',{user:req.user,error: {exist:true,message:'Server exist',type:'create_server'}})
        }

        const newServer = await new Server({
            name,
            password,
            users: [String(login._id)]
        }).save()

        var array = login.servers
        array.push(name)

        const updateUser = await User.findByIdAndUpdate(id,{servers: array})

        res.status(200).redirect('/app')
    }catch(err){
        console.log(err)
    }
}

//Enter to server
const loginServer = async (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(403).redirect('/')
    }
    try{
        const {name,password,id} = req.body
        const login = await User.findById(id)
        if(!login){
            return res.status(403).send('Stop it , no hacking')
        }
        if(String(req.user._id) != String(login._id)){
            return res.status(403).redirect('Stop it , no hacking')
        }

        const server = await Server.findOne({name})
        if(!server){
            return res.status(404).render('app',{user:req.user,error: {exist:true,message:'Server does not exist',type:'login_server'}})
        }

        let inServer = false

        server.users.forEach(v => {
            if(v == id){
                inServer = true;
            }
        })

        if(inServer){
            return res.status(300).render('app',{user:req.user,error: {exist:true,message:'You are in the server',type:'login_server'}})
        }

        if(server.password != password){
            return  res.status(400).render('app',{user:req.user,error: {exist:true,message:'Invalid password',type:'login_server'}})
        }

        let usersArray = server.users
        usersArray.push(id)

        const update = await Server.findByIdAndUpdate(server._id,{users:usersArray})

        let serverArray = login.servers
        serverArray.push(server.name)

        const updateUser = await User.findByIdAndUpdate(login._id,{servers: serverArray})

        res.status(200).redirect('/')

    }catch(err){
        console.log(err)
    }
}

module.exports = { createServer , loginServer }