const host = '62.113.97.215'
const port = 80

const http = require('http')
const express = require('express')
const res = require('express/lib/response')
const fs = require('fs')
// const bodyParser =require('body-parser')
const urlencodedParser = express.urlencoded({extended: false})
const app = express()

app.use(express.static('./public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


let header = ''
let footer = ''
const PAGES = require('./pages.json')
const { status } = require('express/lib/response')

let messageCounter = 0

// Getting requests for images 
const imageRegex = new RegExp('^\/[A-z0-9]+\.((png)|(webp)|(jpg))$')

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
    app.get(address, (req, res) => {
        res.status(200)


        // Generating header
        fs.readFile(PAGES[address]["header"], (err, data) =>{
            if (err) {throw err}
            header = data
        })

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

        //Generating list for required scripts
        let scripts = ''
        for (let i = 0; i < PAGES[address]["scripts"].length; i++) {
            scripts += `<script src="${PAGES[address]["scripts"][i]}" defer></script>\n`
        }

        //Generating list for required styles
        let styles = ''
        for (let i = 0; i < PAGES[address]["styles"].length; i++) {
            styles += `<link rel="stylesheet" type="text/css" href="${PAGES[address]["styles"][i]}">\n`
        }
        console.log(styles)

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
            console.log('sending', address)
            res.send(page)
        })
    })
}

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

app.post('/login', urlencodedParser, (req, res) => {
    const clientLogin = req.body.login
    const clientPassword = req.body.password
    console.log(clientLogin, clientPassword)

    let users = fs.readFileSync('./users.json')
    users = JSON.parse(users)
    if (!users.hasOwnProperty(clientLogin)) {
        res.sendStatus(400)
    } else if (clientPassword != users[clientLogin].password) {
        res.sendStatus(401)
    } else {
        res.sendStatus(200)
    }

    // console.log(users)
})

app.listen(port, host, () => {
    console.log(`Listening to ${host}: ${port}`)
})
