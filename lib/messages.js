const request = require('request-promise');
const misc = require('../misc');
const urls = require('./urls');
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
    Input:   Message text, space ID, token obtained from getToken()
    Success: Undefined (and message is created in space)
    Failure: MessageNotCreatedError on HTTP failure
*/
function sendMessageToSpace(message, spaceId, token) {
    
    const whoami = 'watson-workspace.lib.messages.sendMessageToSpace(): ';
    
    misc.debug(whoami + 'Request to send ' + JSON.stringify(message) + ' to space ID ' + spaceId);
    
    // Create the request object
    const options = {
        method: 'POST',
        url: urls.WW_SPACES_URL + spaceId + '/messages',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: message,
        json: true
    };

    // Make the request
    return request(options)
        // HTTP request was successful. No further action required
        .then(function (res) {
            misc.debug(whoami + 'Message successfully posted to space');
        })
        // HTTP request failed. Throw error
        .catch(function (err) {
            misc.debug(whoami + 'Caught HTTP request error. Throwing...');
            throw err;
        });
    
}

module.exports.sendMessageToSpace = sendMessageToSpace;
module.exports.messageTemplate = messageTemplate;