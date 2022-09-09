const host = '62.113.109.122'
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

const express = require('express')
const res = require('express/lib/response')
const fs = require('fs')
const urlencodedParser = express.urlencoded({extended: false})
const cookieParser = require('cookie-parser')
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

//Getting requests for urls
for (let address in PAGES) {
        getPage(address)
}

io.on('connection', (socket) => {
    console.log(`\x1b[32m>~<\x1b[0mUser connected to socket.\nSocket id: \x1b[33m ${socket.id} \x1b[0m \n`)
    let messagesJSON = fs.readFileSync('./messages.json')
    messagesJSON = JSON.parse(messagesJSON)
    for (let messageId in messagesJSON) {
        socket.emit('message', JSON.stringify(messagesJSON[messageId]))
    }

    socket.on('message', (message) => {
        
        let messageCounter
        let lastMessageNumber = parseInt(Object.keys(messagesJSON)[Object.keys(messagesJSON).length - 1])          
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

        console.log('------------------')
        console.log(`\x1b[36m@message \x1b[0m was recieved from \x1b[32m ${message["username"]}\x1b[0m: ${message["text"]}.\nMessage ID:\x1b[33m ${message["id"]} \x1b[0m`)
        console.log('------------------\n')
        
        io.emit('message', JSON.stringify(message))
    })
    
    socket.on('deleteMessage', (messageId) => {
        delete messagesJSON[messageId]
        fs.writeFile('./messages.json', JSON.stringify(messagesJSON, null, '\n'), (err) => {
            if (err) {throw err}
        })
        io.emit('deleteMessage', messageId)
        console.log('------------------')
        console.log(`\x1b[36m@message \x1b[0m was deleted by\x1b[31m admin\x1b[0m.\nMessage ID:\x1b[33m ${messageId} \x1b[0m`)
        console.log('------------------\n')
    })
})

io.on('connect_error', (err) => {
    console.log(`Socket error: ${err}`)
})


//Managing login post requests
app.post('/login', urlencodedParser, (req, res) => {
    const clientLogin = req.body.login
    const clientPassword = req.body.password

    let users = fs.readFileSync('./users.json')
    users = JSON.parse(users)

    if (users.hasOwnProperty(clientLogin) && users[clientLogin].password == clientPassword) {
        clientData = {
            login: clientLogin
        }
        res.cookie('login', clientLogin)
        res.json({isAuthorised: true})

        console.log('\x1b[32m#####################Successful login####################\x1b[0m')
        console.log(`\x1b[32m#\x1b[0m   USERNAME: \x1b[34m${clientLogin}\x1b[0m`)
        console.log(`\x1b[32m#\x1b[0m   PASSWORD: \x1b[35m${clientPassword}\x1b[0m`)
        console.log('\x1b[32m#########################################################\x1b[0m\n')

    } else {
        console.log(`\x1b[31m----x\x1b[34m${clientLogin}\x1b[0m tried to login with password \x1b[31m${clientPassword}\x1b[0m\n`)
        res.json({isAuthorised: false})
    }
})

io.listen(6002)

app.listen(port, host, () => {
    console.log('\n\x1b[32m#########################################################\x1b[0m')
    console.log(`\x1b[1m\x1b[32mListening to ${host}:${port}\x1b[0m`)
    console.log('\x1b[32m#########################################################\x1b[0m\n')
})
