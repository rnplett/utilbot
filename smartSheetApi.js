const client = require('smartsheet');

const creds = require('./inputs/creds');
const TOKEN = creds.SMART_SHEET_TOKEN;
const SHEETID = creds.SMART_SHEET_ID;

const smartsheet = client.createClient({
  accessToken: TOKEN,
  logLevel: 'info'
});

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
    sheetInfo.rows.forEach(row => {
      if (row.cells[6].value.match(/.*/i)) {
        s["rows"].push(row)
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