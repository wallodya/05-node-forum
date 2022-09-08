const HOST  = '62.113.97.215'
const PORT = 6002

const sendButton = document.getElementById('send-button')
const messageField = document.getElementById('message-field')

if (cookies.login) {
    const messagesList = document.getElementById('messages-list-id')
    const socket = io(`ws://${HOST}:${PORT}`, {
        withCredentials: true,
        forceNew: true,
        transports: ["websocket", "polling", "flashsocket"],
        rejectUnauthorized: false
    })

    socket.on('message', (message) => {
        message = JSON.parse(message)
        const messageBox = document.createElement('div')
        const textContainer = document.createElement('p')
        const usernameContainer = document.createElement('span')
        const timeContainer = document.createElement('span')
        messageBox.setAttribute('class', 'message-container')
        messageBox.setAttribute('id', message.id)
        textContainer.setAttribute('class', 'message-text')
        usernameContainer.setAttribute('class', 'message-username')
        timeContainer.setAttribute('class', 'message-time')
        textContainer.innerText = message.text
        usernameContainer.innerText = message.username || "Stranger"
        message.time = new Date(message.time)
        timeContainer.innerText = `${message.time.getHours()}:${('0' + message.time.getMinutes()).slice(-2)}`
        messagesList.appendChild(messageBox)
        messageBox.appendChild(textContainer)
        messageBox.appendChild(usernameContainer)
        messageBox.appendChild(timeContainer)
        if (cookies.login == "admin") {
            messagesList.style.width = '50%'
            messageBox.classList.add('message-container-admin')
            const deleteButton = document.createElement('button')
            deleteButton.setAttribute('class', 'forum-delete-button')
            deleteButton.innerText = 'Delete'
            messageBox.appendChild(deleteButton)
            deleteButton.onclick = () => {
                console.log(`deleting:`)
                console.dir(message)
                socket.emit('deleteMessage', message.id)
            }
        }
        switch (message.username) {
            case (cookies.login): {
                messageBox.style.backgroundColor = '#80b6de'
                timeContainer.style.gridColumn = '1'
                timeContainer.style.justifySelf = 'flex-start'
                usernameContainer.innerText = ''
                break
            }
            case ("admin"): {
                messageBox.style.backgroundColor = '#ff8c8c'
                usernameContainer.style.fontWeight = 'bold'
                usernameContainer.style.fontStyle = 'italic'
                break
            }
        }
    })
    
    
    socket.on('deleteMessage', messageId => {
        console.log(`removing message ${messageId}`)
        document.getElementById(messageId).style.scale = '0'
        setTimeout(() => {document.getElementById(messageId).remove()}, 300)
    })
    socket.on('disconnect', () => {
        messagesList.innerHTML = ''
    })
    socket.on('connect_error', err => {
        console.log(`connection failed due to ${err.message}`)
    })

    
    sendButton.onclick = (event) => {
        event.preventDefault()
        const message = {
            "username" : cookies.login,
            "text" : messageField.value,
            "time" : new Date(Date.now())
        }
        console.log(`Emitting message: ${message}`)
        socket.emit('message', JSON.stringify(message))
    }
} else {
    sendButton.onclick = (event) => {
        event.preventDefault()
        alert("'You have to sign in to read and write messages")
    }
}






// sendButton.onclick = async (event) => {
//     event.preventDefault()
//     if (cookies.login) {
//         let message = messageField.value
//         messageField.value = ''
    
//         const jsonBody = {   
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: `{
//                 "message" : "${message}",
//                 "username" : "${cookies.login}"
//             }`
//         }
    
//         await fetch( '/message', jsonBody)
//     } else {
//         alert('You have to sign in to write messages')
//     }
// }   
