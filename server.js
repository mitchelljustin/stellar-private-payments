"use strict";
const Express = require('express');
const { ExpressPeerServer } = require('peer');

let app = Express();


let port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

app.use('/peer', ExpressPeerServer(server, {
    debug: true
}));
