const sendButton = document.getElementById('send-button')
const messageField = document.getElementById('message-field')

sendButton.onclick = async () => {
    let message = messageField.value
    messageField.value = ''

    const jsonBody = {   
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {message}
    }

    await fetch( '/message', jsonBody)
    console.log(jsonBody.body)
    console.log(jsonBody.headers)
}