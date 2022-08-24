const sendButton = document.getElementById('send-button')
const messageField = document.getElementById('message-field')

sendButton.onclick = () => {
    let message = messageField.value
    console.log(message)
    messageField.value = ''
    const jsonBody = {   
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }
    fetch( '/message', jsonBody)
    console.log(jsonBody.body)
}