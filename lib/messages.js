// Public modules
const request = require('request-promise');

// Local modules
const misc = require('../misc');

// Module constants
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
    Success: JSON object indicating success (and message is created in space)
    Failure: StatusCodeError for HTTP errors
*/
function sendMessageToSpace(message, spaceId, token) {
    
    const whoami = 'watson-workspace.lib.messages.sendMessageToSpace(): ';
    
    misc.debug(whoami + 'Request to send ' + JSON.stringify(message) + ' to space ID ' + spaceId);
    
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_SPACES_URL + spaceId + '/messages',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: message
    };

    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => {
        if (misc.http.statusCodeOK(res)) {
            // Check if what we got back is valid JSON
            misc.json.assertJSONObject(res.body);
            return res.body;
        }
    })
    .then( (body) => {
        misc.debug(whoami + 'Message successfully posted to space');
        return JSON.parse('{ "result" : "success" }');
    })
    .catch( (err) => {
        misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_LEVEL_LOW);
        throw err;
    });
    
}

module.exports.sendMessageToSpace = sendMessageToSpace;
module.exports.messageTemplate = messageTemplate;