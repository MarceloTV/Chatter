const Server = require("../models/server");
const User = require("../models/user")

let users = {} 
let servers = {}

//Socket server config
const socket = async (io) => {
  const getServers = await Server.find().exec()
  
  getServers.forEach(v => {
    servers[v._id] = {
      users: v.users,
      name: v.name,
      usersConnected: []
    }
  })

  io.on("connection", async (socket) => {
    socket.on("conn", async (idUser) => {
      if(users[idUser]){
        users[idUser].socket = socket.id

        const myUser = await User.findById(idUser)
        const server = users[idUser].server

        if(!servers[users[idUser].server].users.find(v => v == idUser)){
          console.log(servers)

          return false
        }

        servers[users[idUser].server].usersConnected.push(myUser)
        
        socket.emit("joined",(true, server))
        socket.join(server)
        socket.emit("joined_room", server)
        io.to(server).emit("update_users",servers[server].usersConnected)

        socket.on("message", (msg) => {
          io.to(server).emit("get_message",msg)
        })

        socket.on("disconnect", reason => {
          let theServersUsersConnected = servers[users[idUser].server].usersConnected
          const findIndex = theServersUsersConnected.findIndex(v => v._id == idUser)
          theServersUsersConnected.splice(findIndex,1)
          servers[users[idUser].server].usersConnected = theServersUsersConnected
          io.to(server).emit("update_users",servers[server].usersConnected)
          delete myUser
          delete server
          delete users[idUser]
        })
      }
    })

  })
};

const connectNewUser = (_id,server) => {
  users[_id] = {
    server,
    socket: null
  }
}

const updateServers = (newServer) => {
  servers[newServer._id] = {
    users: newServer.users,
    name: newServer.name,
    usersConnected: []
  }
}

const updateServerUsers = (idServer,users) => {
  servers[idServer].users = users
}

module.exports = { socket, connectNewUser, updateServers , updateServerUsers };
