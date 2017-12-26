"use strict";
const Express = require('express')
const { ExpressPeerServer } = require('peer')

let app = Express()

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    res.set('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/ping', (req, res) => {
    res.send('pong')
})

let port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Listening on ${port}`)
})

app.use('/peer', ExpressPeerServer(server, {
    debug: true
}))
