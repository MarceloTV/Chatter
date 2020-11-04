const Server = require('../models/server')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const server = async (req,res) => {
    if(!req.isAuthenticated()){
        return res.status(403).redirect('/')
    }

    try{
        const {name} = req.body

        const serverExist = await Server.findOne({name})

        if(!serverExist){
            return res.status(403).redirect('/')
        }

        let login = false;

        serverExist.users.forEach(v => {
            if(v == String(req.user._id)){
                login = true
            }
        })

        if(!login){
            return res.status(403).send('no login in Server')
        }

        const token = await jwt.sign({_id: serverExist._id},'Minatozaki')

        res.status(200).render('chat',{token,user: req.user,server: serverExist})

    }catch(err){
        console.log(err)
    }


}


module.exports = { server }