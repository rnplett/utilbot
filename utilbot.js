// check out https://github.com/webex/webex-node-bot-framework/blob/HEAD/docs/buttons-and-cards-example.md

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const creds = require('./inputs/creds');
const webexMod = require('./webex');
const messages = require('./messages');
const path = require('path');

const app = express();

webexMod.init();

app.use(bodyParser.json()); // application/json

app.use(express.static(path.join(__dirname, 'public')));

app.use('/hello', (req, res, next) => { 
    res.json({ message: 'Hello World!!?'})
});

app.use('/attachment', (req, res, next) => {
    if ((req.body.resource == 'attachmentActions') && (req.body.event == 'created')) messages.attachment(req.body.data)
    //console.log(req.body);
});

app.use('/', (req, res, next) => {
    if ((req.body.resource == 'messages') && (req.body.event == 'created') && !(req.body.data.personEmail.match(/webex.bot/))) messages.respond(req.body.data);  
    //console.log(req.body);
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