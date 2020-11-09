const Server = require('../models/server')
//Socket server config
const socket =  async (io) => {

    //Servers search
    let serversSearch = await Server.find()
    let servers = serversSearch.map( v => {
        return {
            name: v.name,
            users: [],
            serverId: v._id
        }
    })
    let users = []

    io.on('connection', (socket) => {
        //Servers Update
        Server.find().exec((err,docs) => {
            serversSearch = docs
            servers = docs.map( v => {
                return {
                    name: v.name,
                    users: [],
                    serverId: v._id
                }
            })
        })
        
        //New connection
        socket.on('conn',(data) => {
            const search = servers.findIndex(v => {
                return v.serverId == data.server_id
            })

            users.push({
                name: data.user_name,
                id: socket.id,
                server: data.server_id
            })


            users.forEach(v => {
                const $search = servers.findIndex(a => {
                    return a.serverId == v.server
                })
                servers[$search].users.push(v)
            })

            console.log(servers)

            //Emit users connected to determinate server
            io.emit(`users-${data.server_id}`,servers[search].users)
        })

        //Rev=cive and emit message
        socket.on('message', data => {
            io.emit(`msg-${data.path}`,{
               user: data.user,
               msg: data.msg 
            })
        })

        //When a user is disconnected is remove to the serveres and user array then is emited to all servers :D
        socket.on('disconnect', reason => {
            let index = -1
            const searchUser= users.find(v => v.id == socket.id)
            const searchUserIndex= users.findIndex(v => v.id == socket.id)
            servers.forEach((v,i) => {
                const userFindIndex = v.users.findIndex(v => v.name == searchUser.name)
                if(userFindIndex){
                    v.users.splice(userFindIndex,1)
                    users.splice(searchUserIndex,1)
                    index = i
                }
            })

            io.emit(`users-${searchUser.server}`,servers[index].users)
        })

    })
}

module.exports = socket