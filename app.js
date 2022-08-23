const host = '62.113.97.215'
const port = 80

const http = require('http')
const express = require('express')
const res = require('express/lib/response')
const app = express()
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));

let header = `<header>
              <img src="/css/svg/logo.svg" alt="">
              <a href="/home">
                  Home
              </a>
              <a href="/forum">
                  Forum
              </a>
              <a href="/london">
                  London
              </a>
              <a href="/paris">
                  Paris
              </a>
              <div class="button-container"><button>LOGIN</button></div>
              </header>`
let footer = `<footer>
              <ul>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
              </ul>
              <ul>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
              </ul>
              <ul>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
              </ul>
              <ul>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
                  <li>Page</li>
              </ul>
              </footer>`
let page
const createPage = (content) => {
    page = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Node test</title>
                    <link rel="stylesheet" type="text/css" href="/css/style.css">
                </head>
                <body>
                ${header}
                <div class="main-container">
                ${content}
                </div>
                ${footer}
                </body
                </html>`
    return page
}

app.get('/home', (req, res) => {
    res.status(200)
    mainContent = `<div class="image-container banner">
                    <h1>Home</h1>
                    </div>`
    res.send(createPage(mainContent))
})

app.get('/home', (req, res) => {
    res.status(200)
    mainContent = `<div class="image-container banner">
                    <h1>Home</h1>
                    </div>`
    res.send(createPage(mainContent))
})

app.get('/forum', (req, res) => {
    res.status(200)
    mainContent = `<div class="image-container banner">
                    <h1>Forum</h1>
                    </div>`
    res.send(createPage(mainContent))
})

app.get('/london', (req, res) => {
    res.status(200)
    mainContent = `<div class="image-container banner">
                    <h1>London</h1>
                    </div>`
    res.send(createPage(mainContent))
})

app.get('/paris', (req, res) => {
    res.status(200)
    mainContent = `<div class="image-container banner">
                    <h1>Paris</h1>
                    </div>`
    res.send(createPage(mainContent))
})

app.listen(port, host, () => {
    console.log(`Listening to ${host}, ${port}`)
})
