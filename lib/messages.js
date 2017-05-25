const request = require('request-promise');
const spaces = require('./spaces');
const WW_SPACES_URL = 'https://api.watsonwork.ibm.com/v1/spaces/';
const messageTemplate = {
    type: 'appMessage',
    version: 1,
    annotations: [{
        type: 'generic',
        version: 1,
        text: '',
        actor: {
            name: ''
        }
    }]
};

/*
    Success: Undefined (and message is created in space)
    Failure: MessageNotCreatedError on HTTP failure
*/
function sendMessageToSpace(message, spaceId, token) {
    
    console.log('Request to send ' + JSON.stringify(message) + ' to space ID ' + spaceId);
    
    const options = {
        method: 'POST',
        url: WW_SPACES_URL + spaceId + '/messages',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: message,
        json: true
    };

    return request(options)
        .then(function (res) {
            console.log('Message successfully posted to space');
        })
        .catch(function (err) {
            throw err;
        });
    
}

module.exports.sendMessageToSpace = sendMessageToSpace;
module.exports.messageTemplate = messageTemplate;