const $id = (DOMId) => {
    return document.querySelector(`#${DOMId}`)
}

const user_name = $id('user_name').value
const user_id = $id('user_id').value
const server_id = $id('server_id').value

const socket = io()

socket.emit('conn', {
    user_name,
    user_id,
    server_id
})

socket.on(`users-${server_id}`, data => {
    $id('users-container').innerHTML = ''
    data.forEach(v => {
    $id('users-container').innerHTML += `
        <p>${v.name}</p>
    `
    })

    console.log(data)
})

$id('form').addEventListener('submit', e => {
    e.preventDefault()
    if(e.currentTarget.msg.value == ''){
        return false
    }
    socket.emit('message', {
        path: server_id,
        user: user_name,
        msg: e.currentTarget.msg.value
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    e.currentTarget.msg.value = ''
})

let scrollChat = 0

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
    $id('chat-messages').scrollTop = scrollChat
    scrollChat += 2000
})