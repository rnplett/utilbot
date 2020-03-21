const client = require('smartsheet');

const creds = require('./inputs/creds');
const TOKEN = creds.SMART_SHEET_TOKEN;
const SHEETID = creds.SMART_SHEET_ID;

const smartsheet = client.createClient({
  accessToken: TOKEN,
  logLevel: 'info'
});

// 
// Registration Count - Count the number of registrants from each email domain
// and present them as a list that can be pasted into a message to the event leadership team.
// 
exports.getCount = (bot, message) => {
  const getOptions = {
    url: `sheets/${SHEETID}`
  };
  smartsheet.request.get(getOptions)
  .then(function(sheetInfo) {
    let replyStr = "```\nCount of Registrants:\n------------------------\n";
    
    // Extract data from smartsheet
    let total = 0
    let s = {};
    const re = message.text.split(" ")[2]?message.text.split(" ")[2]:".*";
    sheetInfo.rows.forEach(row => {
      if (row.cells[6].value.match(re)) {
        total += 1;
        let domain = row.cells[1].value.match(/@(.*)/)[1];
        domain = domain ? domain.toLowerCase() : null;
        if (s[domain]) {
          s[domain] += 1;
        } else {
          s[domain] = 1
        };
      };
    });

    // Present data into a reply string
    e = Object.entries(s);
    for (const [k,v] of e) {
      replyStr += `${k} - ${v}\n`;
    };
    replyStr += `\nTotal: ${total}` + " \n```";
    bot.reply(message, {'markdown': replyStr});
  })

  // Error Handling
  .catch(function(error) {
    console.log(error);
  });
};

// 
// Email list - Pull the names and email addresses from the registration smartsheet 
// and present them as a list that can be pasted into an email BCC field.
// 
exports.getRegEmails = (bot, message) => {
  const getOptions = {
    url: `sheets/${SHEETID}`
  }
  smartsheet.request.get(getOptions)
  .then(function(sheetInfo) {
    let emailList = [];
    let replyStr = "```\nList of Registrants:\n------------------------\n";

    // Extract data from the smartsheet
    let s = {};
    s["rows"] = [];
    const re = message.text.split(" ")[2]?message.text.split(" ")[2]:".*";
    sheetInfo.rows.forEach(row => {
      if (row.cells[6].value.match(re)) {
        s["rows"].push(row);
      }
    });

    // Present the data into a reply string
    s.rows.forEach(row => {
      if (!emailList.includes(row.cells[1].value)) {
        emailList.push(row.cells[1].value);
        replyStr += `${row.cells[0].value} <${row.cells[1].value}>;\n`;
      }
    });
    replyStr += "```"
    bot.reply(message, {'markdown': replyStr});
  })

  // Error handling
  .catch(function(error) {
    console.log(error);
  });
};