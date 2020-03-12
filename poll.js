//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/* 
 * a Webex Teams bot that:
 *   - sends a welcome message as he joins a room, 
 *   - answers to a 'hello' command, and greets the user that chatted him
 *   - supports 'help' and a fallback helper message
 * 
 */

const Botkit = require('botkit');

const creds = require('./inputs/creds');
ACCESS_TOKEN = creds.ACCESS_TOKEN;
PUBLIC_URL = creds.PUBLIC_URL;

// Fetch token from environement
// [COMPAT] supports SPARK_TOKEN for backward compatibility
//const accessToken = creds.ACCESS_TOKEN
if (!ACCESS_TOKEN) {
    console.log("Could not start as this bot requires a Webex Teams API access token.");
    console.log("Please invoke with an ACCESS_TOKEN environment variable or update it in the creds.js file");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

if (!PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line or update it in the creds.js file");
    console.log("Example: ");
    console.log("> ACCESS_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node helloworld.js");
    process.exit(1);
}

const controller = Botkit.sparkbot({
    log: true,
    public_address: PUBLIC_URL,
    access_token: ACCESS_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks if incoming payloads originate from Webex
    webhook_name: process.env.WEBHOOK_NAME || 'built with BotKit (development)'
});

const bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("Webhooks set up!");
    });
});



//
// Help command
//
controller.hears(['^help'], 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, "Hi, I am the RNP Pollbot!\n\nType `hello` to see me in action.");
});


//
// Bots commands here
//
controller.hears(['^hello'], 'direct_message,direct_mention', function(bot, message) {
    var email = message.data.personEmail; // Webex Teams User that created the message orginally 
    // console.log(message)
    bot.reply(message, "Hello there " + email);
});


//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, "sorry, I did not understand.<br/>Type help for supported skills." );
});


//
// Welcome message 
// Fired as the bot is added to a space
//
controller.on('bot_space_join', function(bot, message) {
    bot.reply(message, "Hi, I am the Hello World bot !\n\nType `hello` to see me in action.", function(err, newMessage) {
        if (newMessage.roomType == "group") {
            bot.reply(message, "\n\n**Note that this is a 'Group' space. I will answer only when mentionned.**");
        }
    });
});

