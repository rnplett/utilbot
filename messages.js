const webex = require('webex/env');
const sample = require('./cards/sample')

const HELP_MESSAGE = `
Hi I am the **Utility Bot**! Type one of the following to see me in action:

- **help** -> To see this message
- **SS Reg [regex date filter]** -> To see a registration email report from a Smartsheet 
registration form

`;


const sendHelpInfo = (data) => {
    webex.messages.create({
        roomId: data.roomId,
        markdown: HELP_MESSAGE
    })
    .catch((err) => {
        console.log(err)
    })
}

const sendCard = (data) => {
    webex.messages.create({
        roomId: data.roomId,
        text: sample.TEXT,
        markdown: sample.MARKDOWN,
        attachments: sample.CARD,
    })
    // .then((message) => {
    //     return webex.attachmentActions.create({
    //         type: 'submit',
    //         messageId: message.id,
    //         inputs:{
    //             dueDate: '17/02/2020'
    //         }
    //     })
    // })
    .catch((err) => {
        console.log(err)
    })
}

exports.respond = (data) => {
    webex.messages.get(data.id)
        .then((m) => {
            if (m.text.match(/^help/i)) sendHelpInfo(data);
            if (m.text.match(/^card/i)) sendCard(data);
        })
        .catch((err) => {
            console.log(err);
        })
}