//Select DOm element by Id
const $id = (DOMId) => {
    return document.querySelector(`#${DOMId}`)
}

//User/Server Data
const user_name = $id('user_name').value
const user_id = $id('user_id').value
const server_id = $id('server_id').value

//Initialize socket.io
const socket = io()

//New connection to server
socket.emit('conn', {
    user_name,
    user_id,
    server_id
})

//Get Users connected
socket.on(`users-${server_id}`, data => {
    console.log('xd')
    //Print to the DOM
    $id('users-container').innerHTML = ''
    data.forEach(v => {
    $id('users-container').innerHTML += `
        <p>${v.name}</p>
    `
    })

    console.log(data)
})

//Send Message
$id('form').addEventListener('submit', e => {
    e.preventDefault()
    if(e.currentTarget.msg.value == ''){
        return false
    }

    //emit the message
    socket.emit('message', {
        path: server_id,
        user: user_name,
        msg: e.currentTarget.msg.value
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    e.currentTarget.msg.value = ''
})


//Scroll Chat
let scrollChat = 0

//Print messages
socket.on(`msg-${server_id}`, data => {
    if(data.user == user_name){
        $id('chat-messages').innerHTML += `
            <div class="messages" style="float: right; margin-right: 10px;">
                <h4>${data.user}</h4>
                <p>${data.msg}</p>
            </div>
        `
    }else{
        $id('chat-messages').innerHTML += `
            <div class="messages" style="float: left;">
                <h4>${data.user}</h4>
                <p>${data.msg}</p>
            </div>
        `
    }

    //Change Scroll Chat
    $id('chat-messages').scrollTop = scrollChat
    scrollChat += 2000
})