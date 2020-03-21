const client = require('smartsheet');

const creds = require('./inputs/creds');
const TOKEN = creds.SMART_SHEET_TOKEN;
const SHEETID = creds.SMART_SHEET_ID;

const smartsheet = client.createClient({
  accessToken: TOKEN,
  logLevel: 'info'
});

exports.getCount = (bot, message) => {
  const getOptions = {
    url: `sheets/${SHEETID}`
  };
  smartsheet.request.get(getOptions)
  .then(function(sheetInfo) {
    let replyStr = "```\nCount of Registrants:\n------------------------\n";
    let total = 0
    let s = {};
    const re = message.text.split(" ")[1]?message.text.split(" ")[1]:".*";
    sheetInfo.rows.forEach(row => {
      if (row.cells[6].value.match(re)) {
        total += 1;
        let domain = row.cells[1].value.match(/@.*/)[0];
        if (s[domain]) {
          s[domain] += 1;
        } else {
          s[domain] = 1
        };
      };
    });
    e = Object.entries(s);
    for (const [k,v] of e) {
      replyStr += `${k} - ${v}\n`;
    };
    replyStr += `\nTotal: ${total}` + " \n```";
    bot.reply(message, {'markdown': replyStr});
  })
  .catch(function(error) {
    console.log(error);
  });
};

exports.getRegEmails = (bot, message) => {
  const getOptions = {
    url: `sheets/${SHEETID}`
  }
  smartsheet.request.get(getOptions)
  .then(function(sheetInfo) {
    let emailList = [];
    let replyStr = "```\nList of Registrants:\n------------------------\n";
    let s = {};
    s["rows"] = [];
    const re = message.text.split(" ")[2]?message.text.split(" ")[2]:".*";
    console.log(message.text);
    console.log(re);
    sheetInfo.rows.forEach(row => {
      if (row.cells[6].value.match(re)) {
        s["rows"].push(row);
      }
    });
    s.rows.forEach(row => {
      if (!emailList.includes(row.cells[1].value)) {
        emailList.push(row.cells[1].value);
        replyStr += `${row.cells[0].value} <${row.cells[1].value}>;\n`;
      }
    });
    replyStr += "```"
    bot.reply(message, {'markdown': replyStr});
  })
  .catch(function(error) {
    console.log(error);
  });
};