const Webex = require('webex');
const creds = require('./inputs/creds');

process.env.WEBEX_ACCESS_TOKEN=creds.TEST_ACCESS_TOKEN;
const webex = require('webex/env');

exports.init = () => {
    // eslint-disable-next-line no-multi-assign
    webex.webhooks.list()
        .then((webhooks) => {
            webhooks.items.forEach(element => {
                webex.webhooks.remove(element)
            });
        })
        .then(() => {
            webex.webhooks
                .create({
                    resource: 'all',
                    event: 'all',
                    targetUrl: creds.PUBLIC_URL,
                    name: 'Firehose Webhook'
                })
                // Make sure to log errors in case something goes wrong.
                .catch((err) => {
                    console.log('no listening from here!')
                    console.error(reason);
                    process.exit(1);
                });
        })
        .catch((err) => {
            console.log(err);
        })
}


//clean up existing webhooks for this TOKEN that were left by a previous script.
