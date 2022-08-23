const host = '62.113.97.215'
const port = 80

const http = require('http')
const express = require('express')
const res = require('express/lib/response')
const nStatic = require('node-static')
const fileServer = new nStatic.Server('./public')



// const path = require('path')
// const app = express()
// app.use(express.static('/public'))
// app.use(express.static(path.join(__dirname, 'public')));

let header = `<header>
              <img src="/svg/logo.svg" alt="">
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
                ${content}
                ${footer}
                </body
                </html>`
}

const server = http.createServer((req, res) => {
    fileServer.serve(req, res)
    let mainContent
    if (req.method == 'GET') {
        switch (req.url) {
            case ('/home' || '/'): {
                res.statusCode = 200
                mainContent = `<div class="image-container banner">
                               <h1>Home</h1>
                               </div>`
                createPage(mainContent)
                break
            }
            case '/forum': {
                res.statusCode =200
                mainContent = `<div class="image-container banner">
                               <h1>Forum</h1>
                               </div>`
                createPage(mainContent)
                break
            }
            case '/london': {   
                res.statusCode = 200
                mainContent = `<div class="image-container banner">
                               <h1>London</h1>
                               </div>`
                createPage(mainContent)
                break
            }
            case '/paris': {
                res.statusCode = 200
                mainContent = `<div class="image-container banner">
                               <h1>Paris</h1>
                               </div>`
                createPage(mainContent)
                break
            }
            default: {
                res.statusCode = 200
                mainContent = `<div class="image-container banner">
                               <h1>${req.url} is not a page</h1>
                               </div>`
                createPage(mainContent)
            }
        }
        res.end(page)
    }
})

console.log('test log')

server.listen(port, host, () => {
    console.log(`Listening to ${host}, ${port}`)
})
