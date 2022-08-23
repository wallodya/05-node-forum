const host = '62.113.97.215'
const port = 80

const http = require('http')
const express = require('express')
const res = require('express/lib/response')
const fs = require('fs')
const app = express()
app.use(express.static('public'))

let header = ''
let footer = ''

fs.readFile('./public/html/header.html', (err, data) =>{
    if (err) {throw err}
    header = data
})

fs.readFile('./public/html/footer.html', (err, data) =>{
    if (err) {throw err}
    footer = data
})


const createPage = (content) => {
    let page = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Node test</title>
                    <link rel="stylesheet" type="text/css" href="/css/style.css">
                    <link rel="stylesheet" type="text/css" href="/css/city.css">
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
    fs.readFile('./public/html/pages/home.html', (err, data) =>{
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.get('/', (req, res) => {
    res.status(200)
    fs.readFile('./public/html/pages/home.html', (err, data) => {
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.get('/forum', (req, res) => {
    res.status(200)
    fs.readFile('./public/html/pages/forum.html', (err, data) => {
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.get('/london', (req, res) => {
    res.status(200)
    fs.readFile('./public/html/pages/london.html', (err, data) => {
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.get('/paris', (req, res) => {
    res.status(200)
    fs.readFile('./public/html/pages/paris.html', (err, data) => {
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.get('*', (req, res) => {
    res.status(200)
    fs.readFile('./public/html/pages/404.html', (err, data) => {
        if (err) {throw err}
        res.send(createPage(data))
    })
})

app.listen(port, host, () => {
    console.log(`Listening to ${host}, ${port}`)
})
