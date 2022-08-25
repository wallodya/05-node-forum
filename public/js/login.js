const loginButton = document.getElementById('login-button')
const sendButtons = document.getElementsByClassName('send-button')
const loginField = document.getElementById('login-field')
const passwordField = document.getElementById('password-field')
const popupContainer = document.getElementById('popup-background')
const popup = document.getElementById('popup-login')

for (let i = 0; i < sendButtons.length; i++) {
    sendButtons[i].onclick = async () => {

        userInput = {
            login : loginField.value,
            password : passwordField.value
        }
        
        const jsonBody = {   
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body : JSON.stringify(userInput)
        }
        console.log(jsonBody)

        await fetch('/login', jsonBody)
    }
}

loginButton.onclick = () => {
    popupContainer.style.display = 'block'
}

window.onclick = (event) => {
    if (event.target == popupContainer) {
        popupContainer.style.display ='none'
        loginField.value = ''
        passwordField.value = ''
    }
}