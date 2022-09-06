const sendButton = document.getElementById('send-button')
const messageField = document.getElementById('message-field')
// let cookieList = {}


// cookieList = document.cookie.split(';').map((cookie) => {
//     let [key, value] = cookie.split('=')
//     cookies[key.trim()] = value
// });


sendButton.onclick = async (event) => {
    event.preventDefault()
    if (cookies.login) {
        let message = messageField.value
        messageField.value = ''
    
        const jsonBody = {   
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `{
                "message" : "${message}",
                "username" : "${cookies.login}"
            }`
        }
    
        await fetch( '/message', jsonBody)
    } else {
        alert('You have to sign in to write messages')
    }
}   
