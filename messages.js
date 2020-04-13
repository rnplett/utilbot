const webex = require('webex/env');
const Webex = require('webex');
const sample = require('./cards/sample');
const request = require('request');
const creds = require('./inputs/creds');
const csvParse = require('csv-parse');
const pdf = require('pdfkit');
const fs = require('fs');

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
    .then((message) => {
        webex.attachmentActions.create({...sample.ACTION, messageId: message.id})
    })
    .catch((err) => {
        console.log(err)
    })
}

const echoJSONData = (data,a) => {
    webex.messages.create({
        roomId: data.roomId,
        text: "The following data was submitted:\n"+JSON.stringify(a),
        markdown: "The following data was submitted:\n"+JSON.stringify(a)
    })
    .catch((err) => {
        console.log(err)
    })
}

const echoTextData = (data,a) => {
    webex.messages.create({
        roomId: data.roomId,
        text: "The following data was submitted:\n" + a,
        markdown: "The following data was submitted:\n\n" + a
    })
    .catch((err) => {
        console.log(err)
    })
}

const createEmailSummary = (csv) => {
    return new Promise(resolve => {
        csvParse(csv, { columns: true }, (err, records) => {
            let text = "Domain List\n===========\n";
            let domainList = {};
            col1 = 'Email Address';
            records.forEach(element => {
                d = element[col1].match(/\@(.*)$/)[1].toLowerCase();
                if (!domainList[d]) {
                    domainList[d] = 1;
                } else {
                    domainList[d] += 1;
                }
            })
            domains = [];
            for (let p in domainList) {domains.push(p)};
            domains.sort();
            domains.forEach( p => {
                text += p + " - " + domainList[p].toString() + "\n"
            });
            resolve(text);
        })
    })
    
}

const createNameList = (csv) => {
    return new Promise(resolve => {
        csvParse(csv, { columns: true }, (err, records) => {
            let text = "Name List\n===========\n";
            records.forEach( row => {
                for (p in row) {
                    if(p.match(/Full/)) {
                        text += row[p];
                    }
                    if(p.match(/Company/)) {
                        text += "  -  " + row[p] + "\n";
                    }
                }
            });
            resolve(text);
        })
    })
    
}

const sendEmailReport = async (data,csv) => {
    const doc = new pdf;
    doc.pipe(fs.createWriteStream('./public/doc.pdf'));
    doc.fontSize(8);
    p1 = await createEmailSummary(csv);
    p2 = await createNameList(csv);
    doc.text(p1, {
        columns: 3
    });
    doc.addPage();
    doc.text(p2, {
        columns: 2
    })
    doc.end();
    webex.messages.create({
        roomId: data.roomId,
        files: [creds.PUBLIC_URL + '/doc.pdf']
    })
    .then(() => {
        fs.unlinkSync('./public/doc.pdf')
    })
    .catch((err) => {
        console.log(err)
    })
}

exports.respond = (data) => {
    if (data.files) {
        const options = {
            json: true,
            headers: { Authorization: "Bearer " + creds.BOT_ACCESS_TOKEN}
        };
        request(data.files[0], options, (err, res, body) => {
            console.log(res.headers);
            if (res.headers['content-type'].match(/csv/)) {
                sendEmailReport(data, body)
            }
        })
    } else {
        webex.messages.get(data.id)
        .then((m) => {
            if (m.text.match(/^help/i)) sendHelpInfo(data);
            if (m.text.match(/^card/i)) sendCard(data);
        })
        .catch((err) => {
            console.log(err);
        }) 
    }

}

exports.attachment = (data) => {
    webex.messages.get(data.messageId)
    .then((m) => {
        const options = {
            json: true,
            headers: { Authorization: "Bearer " + creds.BOT_ACCESS_TOKEN}
        };
        request('https://api.ciscospark.com/v1/attachment/actions/' + data.id, options, (err, res, body) => {
            if (m.text.match(/^F001/)) echoJSONData(data,body.inputs);
            if (m.text.match(/^F002/)) echoJSONData(data,body.inputs);            
        })
    })
}