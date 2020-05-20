const webex = require('webex/env');
const Webex = require('webex');
const sample = require('./cards/sample');
const reportCsv = require('./cards/reportCsv')
const request = require('request');
const creds = require('./inputs/creds');
const csvParse = require('csv-parse');
const pdf = require('pdfkit');
const fs = require('fs');

const HELP_MESSAGE = `
Hi I am the **Utility Bot**! Type one of the following to see me in action:

- **help** -> To see this message
- **[upload a CSV file]** -> this will generate a card with task options

`;

const csvParsePromise = (data) => {
    return new Promise( (resolve, reject) =>{
        csvParse(data, {columns: true}, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        }) 
    })      
}

const readFilePromise = (filePath) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}



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

const sendCardReportCsv = (data) => {
    webex.messages.create({
        roomId: data.roomId,
        text: reportCsv.TEXT,
        markdown: reportCsv.MARKDOWN,
        attachments: reportCsv.CARD,
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

const sendCventInviteImport = (data, inputs) => {
        let url = fs.readFileSync('./data/url.txt').toString();
        const options = {
            json: true,
            headers: { Authorization: "Bearer " + creds.BOT_ACCESS_TOKEN}
        };
        request(url, options, async (err, res, body) => {
            let csv = body;
            const records = await csvParsePromise(csv);
            let text = "Contacts,,,,,,,,,,,,,,,,,,,,,,\n";
            text += "UUID,Name,Email,Company,JobTitle,URL,OffCntry,OffLocal,CellCntry,CellLocal,FaxCntry,FaxLocal,Address1,Address2,City,State/Province,Zip/Postal,Country,Time Zone,Language,Locale,UserName,Notes\n";
            colFilter = inputs['columnName'];
            rowFilter = inputs['rowContent'];
            let c = "";
            let name;
            let email;
            records.forEach(row => {
                if (c == "") {
                    let re = new RegExp(inputs['columnName'],'i');
                    for (p in row) { if (p.match(re)) { 
                        c = p;
                    }};
                };
                re = new RegExp(inputs['rowContent'],'i');
                let reName = new RegExp(inputs['nameField'],'i');
                let reEmail = new RegExp(inputs['emailField'],'i');
                if (row[c].match(re)) {
                    for (p in row) {
                        if(p.match(reName)) {
                            name = row[p];
                            continue;
                        };
                        if(p.match(reEmail)) {
                            email = row[p];
                            continue;
                        };                  
                    };
                    text += ',"' + name + '",' + email + ",,,,,,,,,,,,,,,,,,,,\n";
                };
            })
            fs.writeFileSync('./public/webexEventImport.csv',text)
            webex.messages.create({
                roomId: data.roomId,
                files: [creds.PUBLIC_URL + '/webexEventImport.csv']
            })
            .then(() => {
                fs.unlinkSync('./public/webexEventImport.csv')
            })
            .catch((err) => {
                console.log(err)
            })
        })
}

const createEmailSummary = (csv) => {
    return new Promise(async resolve => {
        const minerCsv = await readFilePromise('./inputs/miners.csv');
        const mObjectArray = await csvParsePromise(minerCsv);
        miners = []
        mObjectArray.forEach(element => {
            miners.push(element['Miner']);
        })

        const records = await csvParsePromise(csv);
        let text = "\n\n\nDomain List\n===========\n";
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

        leaders = creds.CSV_LEADERS;
        text += '\nLeaders Group\n---------------\n';
        let leadersTotal = 0;
        leaders.sort();
        leaders.forEach( p => {
            text += p + " - " + domainList[p].toString() + "\n";
            leadersTotal += domainList[p];
        })
        text += '\nMining Companies\n-----------------\n';
        let minersTotal = 0;
        miners.sort();
        miners.forEach( p => {
            text += p + " - " + domainList[p].toString() + "\n";
            minersTotal += domainList[p];
        })
        text += '\nOther Organizations\n-------------------\n';
        let othersTotal = 0;
        domains.forEach( p => {
            if ((!miners.includes(p)) & (!leaders.includes(p))) {
                text += p + " - " + domainList[p].toString() + "\n";
                othersTotal += domainList[p];
            }
        });

        summary = 'Group Totals:\n=============\n'
        summary += 'Cisco and Westburne: ' + leadersTotal.toString() + "\n";
        summary += 'Mining Company Registrants: ' + minersTotal.toString() + '\n';
        summary += 'Other Registrants: ' + othersTotal.toString() + '\n';
        let total = leadersTotal + minersTotal + othersTotal
        summary += '\nTotal: ' + total.toString(); + '\n\n '

        text = summary + text;

        resolve(text);
    })    
}

const createNameList = (csv) => {
    return new Promise(resolve => {
        csvParse(csv, { columns: true }, (err, records) => {
            let text = "Name List\n===========\n";
            let data = [...records];
            data.map(row => {
                row["domain"] = row['Email Address'].match(/\@(.*)$/)[1].toLowerCase()
            })
            function compare(a, b) {
                if (a.domain > b.domain) return 1;
                if (b.domain > a.domain) return -1;
                return 0;
              }
            data.sort(compare);
            let d = "";
            data.forEach( row => {
                if (d != row.domain) {
                    text += row.domain + "\n";      
                    d = row.domain;           
                };
                let line = "    ";
                for (p in row) {
                    if(p.match(/Full/)) {
                        line += row[p];
                    }
                    if(p.match(/Company/)) {
                        line += "  -  " + row[p] + "\n";
                    }
                }
                if (line.length > 50) {
                    line = line.substr(0,50) + "\n";
                }
                text += line;
            });
            resolve(text);
        })
    })
    
}

const sendEmailReport = async (data,csv) => {
    // get csv file
    let url = fs.readFileSync('./data/url.txt').toString();
    const options = {
        json: true,
        headers: { Authorization: "Bearer " + creds.BOT_ACCESS_TOKEN}
    };
    request(url, options, async (err, res, body) => {
        let csv = body
        // construct report
        const doc = new pdf;
        doc.pipe(fs.createWriteStream('./public/doc.pdf'));
        doc.fontSize(10);
        p1 = await createEmailSummary(csv);
        p2 = await createNameList(csv);
        doc.text(p1, {
            columns: 2
        });
        doc.addPage();
        doc.fontSize(8);
        doc.text(p2, {
            columns: 2
        });
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
    });
}

exports.respond = (data) => {
    if (data.files) {
        const options = {
            json: true,
            headers: { Authorization: "Bearer " + creds.BOT_ACCESS_TOKEN}
        };

        request(data.files[0], options, (err, res, body) => {
            if (res.headers['content-type'].match(/csv/)) {
                fs.writeFile('./data/url.txt', data.files, err => {
                    if (err) throw err;
                });
                sendCardReportCsv(data)
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
            //console.log(body.inputs)
            if (body.inputs.inviteDif == 'true') sendCventInviteImport(data,body.inputs);
            if (body.inputs.groupSummary == 'true') sendEmailReport(data,body.inputs);
            if (m.text.match(/^F002/)) echoJSONData(data,body.inputs);            
        })
    })
}