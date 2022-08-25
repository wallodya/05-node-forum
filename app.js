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

        fs.readFile(PAGES[address]["header"], (err, data) =>{
            if (err) {throw err}
            header = data
        })

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
        fs.readFile(PAGES[address]["content"], (err, data) => {
            if (err) { throw err}
            let page = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${PAGES[address]["title"]}</title>
                    <link rel="stylesheet" type="text/css" href="/css/style.css">
                    <link rel="stylesheet" type="text/css" href="/css/city.css">
                    <link rel="stylesheet" type="text/css" href="/css/404.css">
                    <link rel="stylesheet" type="text/css" href="/css/forum.css">
                    <script src="/js/rollout.js" defer></script>
                    <script src="/js/forum.js" defer></script>
                </head>
                <body>
                ${header}
                <div class="main-container">
                ${data}
                </div>
                ${footer}
                </body
                </html>`
            res.send(page)
        })
    })
}

app.post('/message', urlencodedParser, (req, res) => {
    res.sendStatus(200)
    console.log(req.method)
    console.log(req.headers)
    console.log(req.header)
    console.log(req.read())
    console.log(req.body.message)

})

app.listen(port, host, () => {
    console.log(`Listening to ${host}, ${port}`)
})
