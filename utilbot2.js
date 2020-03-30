const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const creds = require('./inputs/creds');
const webexMod = require('./webex');
const messages = require('./messages');

const app = express();

webexMod.init();

app.use(bodyParser.json()); // application/json

app.use('/hello', (req, res, next) => { 
    res.json({ message: 'Hello World!!?'})
});

app.use('/', (req, res, next) => {
    if ((req.body.resource == 'messages') && (req.body.event == 'created')) messages.respond(req.body.data);   
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.listen(8080);

// mongoose
//     .connect(
//         creds.MONGODB_CONNECT_STRING // insert mongoose connection string - connected using google creds
//     )
//     .then(result => {
//         const server = app.listen(8080);
//     })
//     .catch((err) => {
//         console.log('MongoDB Connect Issues!')
//         console.log(err)
//     }); 