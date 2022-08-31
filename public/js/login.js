
const loginButton = document.getElementById('login-button')
const logoutButton = document.getElementById('logout-button')
// const sendButtons = document.getElementsByClassName('send-button')
const submitButton = document.getElementById('submit-button')
// const loginField = document.getElementById('login-field')
// const passwordField = document.getElementById('password-field')
const popupContainer = document.getElementById('popup-background')
// const popup = document.getElementById('popup-login')
// const wrongLoginText =document.getElementById('wrong-login-text')
// const wrongPasswordText =document.getElementById('wrong-password-text')
// const correctLoginText =document.getElementById('correct-login-text')
// const correctPasswordText =document.getElementById('correct-password-text')
// let isLoginValid = false
// let isPasswordValid = false

try {
    if (userName) {
        console.log(userName + '...')
        document.getElementById('username-field').innerText = `Your login is ${userName}`
    }
} catch (err) {
    console.log(err)
}



// //Assigning 'wrong-input' class to input field and showing/hiding warning labels
// //depending on isIncorrect flag and changing the isLoginPossible flag
// markIncorrectField = (inputField, isIncorrect) => {
//     switch (isIncorrect) {
//         case true: {
//             inputField.classList.add('wrong-input')

//             switch (inputField){ 
//                 case loginField: {
//                     isLoginValid = false
//                     wrongLoginText.style.height = 'fit-content'
//                     break
//                 }
//                 case passwordField: {
//                     isPasswordValid = false
//                     wrongPasswordText.style.height = 'fit-content'
//                     break
//                 }
//             }  
            
//             break
//         }
//         case false: {
//             inputField.classList.remove('wrong-input')

//             switch (inputField){ 
//                 case loginField: {
//                     isLoginValid = true
//                     wrongLoginText.style.height = '0'
//                     break
//                 }
//                 case passwordField: {
//                     isPasswordValid = true
//                     wrongPasswordText.style.height = '0'
//                     break
//                 }
//             }  

//             break
//         }
//     }      
// }


// // Cheking the value inside the input field with RegEx
// // and callinng markIncorrectField function in case its invalid
// checkFieldValue = (inputField) => {
//     const loginRegEx = new RegExp('^[A-z][A-z0-9.-]{3,19}$')
//     const passwordRegEx = new RegExp('^[A-z0-9]{4,19}$')

//     switch (inputField) {
//         case loginField: {
//             if (!loginRegEx.test(loginField.value)) {
//                 markIncorrectField(loginField, true)
//             } else {
//                 markIncorrectField(loginField, false)
//             }
//             break
//         }

//         case passwordField: {
//             if (!passwordRegEx.test(passwordField.value)) {
//                 markIncorrectField(passwordField, true)
//             } else {
//                 markIncorrectField(passwordField, false)
//             }
//             break
//         }
//     }
// } 

// const sendData = async () => {
//         console.log('sending data')
//         userInput = {
//             login : loginField.value,
//             password : passwordField.value 
//         }
        
//         const jsonBody = {   
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body : JSON.stringify(userInput)
//         }
//         console.log(jsonBody)
//         try {
//            const res = await fetch('/login', jsonBody)
//            console.log('sending data')
//            console.log(res.status)
//            switch (res.status) {
//                case 401: {
//                     wrongLoginText.innerText = 'Authentification failed'
//                     wrongPasswordText.innerText = 'Authentification failed'
//                     markIncorrectField(passwordField, true) 
//                     markIncorrectField(loginField, true)
//                     break
//                }
//                case 200: {
//                     console.log(200)
//                     loginField.classList.add('correct-input')
//                     passwordField.classList.add('correct-input')
//                     correctLoginText.style.height = 'fit-content'
//                     correctPasswordText.style.height = 'fit-content'
//                     setTimeout(() => {
//                         closePopup()
//                     }, 750)
//                     setTimeout(() => {
//                         location.reload()
//                     }, 1000)
                
                   
//                 //    setTimeout(() => {reloadPage(true)}, 750)
//                }
//            }
//         } catch (err) {
//         }
// }

// const setDefaultLoginField = () => {
//     loginField.setAttribute('class', 'neomorph')
//     correctLoginText.style.height = '0'
//     wrongLoginText.innerText = 'Login incorrect'
//     wrongLoginText.style.height = '0'
// }

// const setDefaultPasswordField = () => {
//     passwordField.setAttribute('class', 'neomorph')
//     correctPasswordText.style.height = '0'
//     wrongPasswordText.innerText = 'Wrong password format'
//     wrongPasswordText.style.height = '0'
// }

// const closePopup = () => {
//     popupContainer.style.display ='none'
//     loginField.value = ''
//     passwordField.value = ''
//     setDefaultLoginField()
//     setDefaultPasswordField()
// }


// for (let i = 0; i < sendButtons.length; i++) {
//     sendButtons[i].onclick = () => {
//         checkFieldValue(loginField)
//         checkFieldValue(passwordField)
//         if (isLoginValid && isPasswordValid) {
//             sendData()
//         }
//     }
// }

if (loginButton) {
    loginButton.onclick = () => {
        popupContainer.style.display = 'block'
    }
}
if (logoutButton) {
    logoutButton.onclick = async () => {
        console.log('logout')
        await fetch('http://forum.souta.ru/logout').then(() => {
            location.reload()
        })
    }
}


// loginField.addEventListener('input', () => {
//     setDefaultLoginField()
// })

// passwordField.addEventListener('input', () => {
//     setDefaultPasswordField()
// })

// loginField.addEventListener('keypress', (event) => {
//     if (event.key === 'Enter') {
//         sendData()
//     } 
// })

// passwordField.addEventListener('keypress', (event) => {
//     if (event.key === 'Enter') {
//         sendData()
//     } 
// })

// window.onclick = (event) => {
//     if (event.target == popupContainer) {
//         closePopup()
//     }
// }