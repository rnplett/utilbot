const webex = require('webex/env');

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
    }).catch((err) => {
        console.log(err)
    })
}

exports.respond = (data) => {
    webex.messages.get(data.id)
        .then((m) => {
            if (m.text.toLowerCase() == 'help') sendHelpInfo(data);
        })
        .catch((err) => {
            console.log(err);
        })
}