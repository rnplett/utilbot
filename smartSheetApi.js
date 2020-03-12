const rest = require('rest');

const creds = require('./inputs/creds');
const TOKEN = creds.SMART_SHEET_TOKEN;
const SHEETID = creds.SMART_SHEET_ID;

const path = '/2.0/sheets/' + SHEETID;
const auth = "Bearer " + token;
const options = {
    host: 'api.smartsheet.com',
    port: 443,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    }
  };

module.exports.getRegEmails = () => {
    console.log('Hi there')
    //rest.getJSON(options, (statusCode, result) => {
        // I could work with the resulting HTML/JSON here. I could also just return it
        //console.log(`onResult: (${statusCode})\n\n${JSON.stringify(result)}`);
      
        // res.statusCode = statusCode;
      
        // res.send(result);
    };