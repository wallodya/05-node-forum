
const loginButton = document.getElementById('id-login-button')
// const sendButtons = document.getElementsByClassName('send-button')
const submitButton = document.getElementById('submit-button')
const loginField = document.getElementById('login-field')
const passwordField = document.getElementById('password-field')
const popupContainer = document.getElementById('id-popup-container')
// const popup = document.getElementById('popup-login')
const wrongLoginText =document.getElementById('wrong-login-text')
const wrongPasswordText =document.getElementById('wrong-password-text')
const correctLoginText =document.getElementById('correct-login-text')
const correctPasswordText =document.getElementById('correct-password-text')
const parisButton = document.getElementById('paris-button')
const usernameField = document.getElementById('header-username')

let cookies = {}

console.log('loading page........')

const refreshCookies = () => {
    cookies = {}
    document.cookie.split(';').forEach((cookie) => {
        let[key,value] = cookie.split('=')
        cookies[key.trim()] = value
        console.log(`Refreshing cookies`)
        console.log(`Cookie:\n key: ${key}, value: ${value}\n`)
    })
} 

const setHeader = () => {
    if(!cookies.login) {
        parisButton.classList.add('link-disabled')
        parisButton.setAttribute('href', '')
        usernameField.style.width = '0'
        usernameField.innerText = ''
        loginButton.innerText = 'LOGIN'
        loginButton.onclick = () => {
            popupContainer.style.transform = 'scale(1)'
            popupContainer.style.opacity = '1'
        }
    } else {
        parisButton.classList.remove('link-disabled')
        parisButton.setAttribute('href', '/paris')
        usernameField.style.width = 'fit-content'
        usernameField.innerText = `Your login: ${cookies.login}`
        loginButton.innerText = 'LOGOUT'
        loginButton.onclick = () => {
            if (location.href == 'http://forum.zerq.ru/paris' || location.href == 'http://www.forum.zerq.ru/paris' || location.href == 'http://zerq.ru/paris' || location.href == 'http://www.zerq.ru/paris') {
                console.log('page is for users only')
                location.replace('http://www.forum.zerq.ru/home')
            }
            console.log('logout')
            document.cookie += ';expires=' + new Date(0).toUTCString()
            refreshCookies()
            setHeader()
            console.log(`Cookies after logout:`)
            console.dir(cookies)
            console.log('////')
        }
    }
}

// //Assigning 'wrong-input' class to input field and showing/hiding warning labels
// //depending on isIncorrect flag and changing the isLoginPossible flag
markIncorrectField = (inputField, isIncorrect) => {
    if (isIncorrect)    {
        inputField.classList.add('wrong-input')
        switch (inputField){ 
            case loginField: {
                isLoginValid = false
                wrongLoginText.style.height = 'fit-content'
                break
            }
            case passwordField: {
                isPasswordValid = false
                wrongPasswordText.style.height = 'fit-content'
                break
            }
        }  
            
    } else {
        inputField.classList.remove('wrong-input')
        switch (inputField){ 
            case loginField: {
                isLoginValid = true
                wrongLoginText.style.height = '0'
                break
            }
            case passwordField: {
                isPasswordValid = true
                wrongPasswordText.style.height = '0'
                break
            }
        }  
    }
}      


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

const setDefaultLoginField = () => {
    loginField.setAttribute('class', 'neomorph')
    correctLoginText.style.height = '0'
    wrongLoginText.innerText = 'Login incorrect'
    wrongLoginText.style.height = '0'
}

const setDefaultPasswordField = () => {
    passwordField.setAttribute('class', 'neomorph')
    correctPasswordText.style.height = '0'
    wrongPasswordText.innerText = 'Wrong password format'
    wrongPasswordText.style.height = '0'
}

const closePopup = () => {
    popupContainer.style.opacity = '0'
    setTimeout(() => {popupContainer.style.transform = 'scale(0)'}, 200) 
    loginField.value = ''
    passwordField.value = ''
    setDefaultLoginField()
    setDefaultPasswordField()
}



if (document.cookie) {
    refreshCookies()
    console.log(`Cookies on page load:`)
    console.dir(cookies)
}

setHeader()

submitButton.onclick = async (event) => {
    event.preventDefault()

    console.log('loggin in ')
    await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login: loginField.value, password: passwordField.value})
    }).then(res => {return res.json()})
      .then(data => {  
        if (data.isAuthorised) {
            refreshCookies()
            console.log(`Cookies after login:`)
            console.dir(cookies)
            console.log('////')
            correctLoginText.style.height = 'fit-content'
            correctPasswordText.style.height = 'fit-content'
            loginField.classList.add('correct-input')
            passwordField.classList.add('correct-input')
            setHeader()
            setTimeout(() => {closePopup()}, 500)
        } else {
            markIncorrectField(loginField, true)
            markIncorrectField(passwordField, true)
        }
    })
    
        // console.log(`Server response:`)
        // console.log(res.json()["PromiseResult"])
        // console.log(res.isAuthorised)

}

loginField.addEventListener('input', () => {
    setDefaultLoginField()
})

passwordField.addEventListener('input', () => {
    setDefaultPasswordField()
})

window.onclick = (event) => {
    if (event.target == popupContainer) {
        closePopup()
    }
}
