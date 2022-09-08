const host = '62.113.97.215'
const port = 80

const http = require('http')
const { Server } = require("socket.io")
const io = new Server({
    cors: {
        origin: "*",
        credentials: true
    },
    transports: ["websocket", "polling"],
    cookie: true,
    allowUpgrades: false
})

// const io = require('socket.io')(http, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         credentials: true,
//         rejectUnauthorized: false
//     }
// })
const express = require('express')
const res = require('express/lib/response')
const fs = require('fs')
const urlencodedParser = express.urlencoded({extended: false})
const cookieParser = require('cookie-parser')
// const sessions = require('express-session')
const app = express()

app.use(express.static('./public'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

let header = ''
let footer = ''
const PAGES = require('./pages.json')
const { status } = require('express/lib/response')
const { Socket } = require('socket.io')

// Getting requests for images 
const imageRegex = new RegExp('^\/[A-z0-9]+\.((png)|(webp)|(jpg))$')

const getPage = (address) => {
    app.get(address, (req, res) => {
        // console.dir(req.cookies)
        let isUser = false
        
        // session = req.session

        if (req.cookies.login) {
            isUser = true
        } else {
            isUser= false
        }

        header = fs.readFileSync(PAGES[address]["header"])

        // Generating footer
        if (PAGES[address]["bigFooter"]) {
            fs.readFile('./public/html/big_footer.html', (err, data) => {
                if (err) {throw err}
                footer = data
            })
        } else {
            fs.readFile(PAGES[address]["footer"], (err, data) =>{
                if (err) {throw err}
                footer = data
            })
        }

        //Generating tags for required scripts
        let scripts = ''
        for (let i = 0; i < PAGES[address]["scripts"].length; i++) {
            scripts += `<script src="${PAGES[address]["scripts"][i]}" defer></script>\n`
        }

        //Generating tags for required styles
        let styles = ''
        for (let i = 0; i < PAGES[address]["styles"].length; i++) {
            styles += `<link rel="stylesheet" type="text/css" href="${PAGES[address]["styles"][i]}">\n`
        }

        // Generating page layout
        fs.readFile(PAGES[address]["content"], (err, data) => {
            if (err) { throw err}
            let page = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${PAGES[address]["title"]}</title>
                    ${styles}
                    ${scripts}
                </head>
                <body>
                ${header}
                <div class="main-container">
                ${data}
                </div>
                ${footer}
                </body
                </html>`
            // console.log('sending', address)
            if (!isUser && PAGES[address]["userOnly"]) {
                res.redirect(301, '/home')
            } else {
                res.send(page)
            }
        })
    })
}

app.get(imageRegex, (req, res) => {
    res.status(200)
    fs.readFile(`./public/img${req.url}`, (err, data) => {
        if (err) {
            res.send('<h1>No such image</h1>')
        } else{
            res.send(`<img src="/img${req.url}" alt="some image">`)
        }
    })
})

// app.get('/logout', (req, res) => {
//     console.log('logout')
//     // req.session.destroy()
//     res.clearCookie("login")
//     // res.redirect(req.get('referer'))
//     // res.end()
//     console.log('logged out')
// })

//Getting requests for urls
for (let address in PAGES) {
        getPage(address)
}

// Managing post request from forum
// app.post('/message', urlencodedParser, (req, res) => {
//     res.sendStatus(200)
//     let messageCounter = 1
//     let message = req.body
//     console.log(message)

//     message["time"] = new Date(Date.now()).toString()
    
//     let messagesJSON = fs.readFileSync('./messages.json')
//     messagesJSON = JSON.parse(messagesJSON)
    
//     let lastMessageNumber = parseInt(Object.keys(messagesJSON)[Object.keys(messagesJSON).length - 1])
//     if (lastMessageNumber) {
//         messageCounter = lastMessageNumber + 1
//     }
//     const messageId = ('00000' + String(messageCounter)).slice(-6)
    
//     messagesJSON[messageId] = message

//     fs.writeFile('./messages.json', JSON.stringify(messagesJSON, null, '\n'), (err) => {
//         if (err) {throw err}
//     })
// })



io.on('connection', (socket) => {
    console.log('user connected to socket')
    let messagesJSON = fs.readFileSync('./messages.json')
    messagesJSON = JSON.parse(messagesJSON)
    for (let messageId in messagesJSON) {
        io.emit('message', JSON.stringify(messagesJSON[messageId]))
    }

    socket.on('message', (message) => {
        console.log(message)
        
        let messageCounter
        let lastMessageNumber = parseInt(Object.keys(messagesJSON)[Object.keys(messagesJSON).length - 1])
        console.log(`last message number: ${lastMessageNumber}`)           
        lastMessageNumber
            ? messageCounter = lastMessageNumber + 1 
            : messageCounter = 1
        const messageId = ('000000' + String(messageCounter)).slice(-6)
        message = JSON.parse(message)
        message["id"] = messageId
        messagesJSON[messageId] = message
        fs.writeFile('./messages.json', JSON.stringify(messagesJSON, null, "\n"), (err) => {
            if (err) {throw err}
        })

        io.emit('message', JSON.stringify(message))
    })

    socket.on('deleteMessage', (messageId) => {
        delete messagesJSON[messageId]
        fs.writeFile('./messages.json', JSON.stringify(messagesJSON, null, '\n'), (err) => {
            if (err) {throw err}
        })
        io.emit('deleteMessage', messageId)
    })
})

io.on('connect_error', (err) => {
    console.log(`Socket error: ${err}`)
})


//Managing login post requests
app.post('/login', urlencodedParser, (req, res) => {
    const clientLogin = req.body.login
    const clientPassword = req.body.password

    console.log(clientLogin, clientPassword)

    let users = fs.readFileSync('./users.json')
    users = JSON.parse(users)

    if (users.hasOwnProperty(clientLogin) && users[clientLogin].password == clientPassword) {
        // session = req.session
        // session.userid = clientLogin
        // console.log(req.session)
        // res.redirect(req.get('referer'))
        clientData = {
            login: clientLogin
        }
        res.cookie('login', clientLogin)
        res.json({isAuthorised: true})
        // res.sendStatus(200)
        console.log('successful login')
    } else {
        res.json({isAuthorised: false})
        // res.sendStatus(200)
    }
})

io.listen(6002)

app.listen(port, host, () => {
    console.log(`Listening to ${host}: ${port}`)
})
