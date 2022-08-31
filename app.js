const host = '62.113.97.215'
const port = 80

const http = require('http')
const express = require('express')
const res = require('express/lib/response')
const fs = require('fs')
const urlencodedParser = express.urlencoded({extended: false})
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const app = express()

app.use(express.static('./public'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const msInDay = 24 * 60 * 60 * 1000
app.use(sessions ({
    secret: "secretkey",
    saveUninitialized: true,
    cookie: {maxAge: msInDay},
    resave: false
}))
let session
app.use(cookieParser())

// const handlebars = require('express-handlebars')

// app.engine('handlebars', () => {handlebars()})

// app.set('views', './html')
// app.set('view engine', 'handlebars')


let header = ''
let footer = ''
const PAGES = require('./pages.json')
const { status } = require('express/lib/response')


let messageCounter = 0

// let isUser = false
// let userName = ''

// Getting requests for images 
const imageRegex = new RegExp('^\/[A-z0-9]+\.((png)|(webp)|(jpg))$')

const getPage = (address) => {
    app.get(address, (req, res) => {

        let isUser = false
        
        session = req.session

        if (session.userid) {
            isUser = true
        }

        let scripts = ''
        if (isUser) {
            header = fs.readFileSync('./public/html/header_user.html')
            scripts += `<script defer>const userName = "${session.userid}"</script>`
        } else {
            header = fs.readFileSync('./public/html/header_guest.html')
        }


        // console.log(address, 1)
        // if (!isUser && PAGES[address]["userOnly"]) {    
        //     res.redirect(301, '/')
        // }
        // console.log(address, 2)

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

app.get('/logout', (req, res) => {
    console.log('logout')
    req.session.destroy()
    res.redirect(req.get('referer'))
    console.log('logged out')
})

//Getting requests for urls
for (let address in PAGES) {
        getPage(address)
}

// Managing post request from forum
app.post('/message', urlencodedParser, (req, res) => {
    res.sendStatus(200)
    let message = req.body
    message["time"] = new Date(Date.now()).toString()

    const messageId = ('00000' + String(messageCounter).slice(-6))
    messageCounter++

    let messagesJSON = fs.readFileSync('./messages.json')
    messagesJSON = JSON.parse(messagesJSON)
    messagesJSON[messageId] = message

    fs.writeFile('./messages.json', JSON.stringify(messagesJSON, null, '\n'), (err) => {
        if (err) {throw err}
    })
})

//Managing login post requests
app.post('/login', urlencodedParser, (req, res) => {
    const clientLogin = req.body.login
    const clientPassword = req.body.password

    console.log(clientLogin, clientPassword)

    let users = fs.readFileSync('./users.json')
    users = JSON.parse(users)

    if (users.hasOwnProperty(clientLogin) && users[clientLogin].password == clientPassword) {
        session = req.session
        session.userid = clientLogin
        console.log(req.session)
        res.redirect(req.get('referer'))
        console.log(200)
    } else {
        res.sendStatus(401)
    }
})

app.listen(port, host, () => {
    console.log(`Listening to ${host}: ${port}`)
})
