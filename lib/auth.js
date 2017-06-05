// Public modules
const request = require('request-promise');
const crypto = require('crypto');

// Local modules
const misc = require('../misc');

/*
    Get a token from Watson Workspace
    Required inputs:   
        - Token object of unknown validity 
        - App ID
        - App secret
    Optional input:
        - Token URL (for testing HTTP error paths)
    Success: Valid token
    Failure: AuthenticationError
*/
function getToken(token, id, secret, url) {
    
    const whoami = 'watson-workspace.lib.auth.getToken(): ';
    var tokenUrl = misc.urls.WW_OAUTH_URL;
    
    // Update the token URL if one was passed in
    if (url) {
        tokenUrl = url;
    }
    
    return Promise.resolve()
    // First see if the token is valid
    .then(function () {
        return getTokenPromise(token);
    })
    // If the token is invalid, get a new one
    .catch(function () {
        misc.debug(whoami + 'Requesting a new token from ' + tokenUrl);
        // Create the request object
        const options = {
            method: 'POST',
            url: tokenUrl,
            auth: {
                user: id,
                pass: secret
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        // Make the request
        return request(options)
        .then(function (res) {
            misc.debug(whoami + 'Successfully obtained new token');
            return res.access_token;
        })
        .catch(function (err) {
            misc.debug(whoami + 'Failed to obtain new token');
            throw err;
        });
    });

}

function getTokenPromise(token) {
    
    const whoami = 'watson-workspace.lib.auth.getTokenPromise(): ';

    return new Promise(function (resolve, reject) {
        // If the token is invalid, reject Promise with error
        if (!token) {
            misc.debug(whoami + 'Invalid token. Will request a new one');
            return reject(new Error('InvalidTokenError'));
        // If the token is valid, resolve Promise
        } else {
            misc.debug(whoami + 'Token is valid');
            return resolve(token);
        }
    });

}

// Verify the webhook by responding to challenge
function verifyWebhook(req, res, secret) {
    
    const whoami = 'watson-workspace.lib.auth.verifyWebhook(): ';
    
    misc.debug(whoami + 'Received a verification request from Watson Workspace');
    
    return Promise.resolve()
    .then(function () {
        // First requirement: JSON response body must contain the verification challenge in response value
        var body = { 'response': req.body.challenge };
        res.body = body;
        // Second requirement: X-OUTBOUND-TOKEN header contains HMAC-SHA256 hash of body with secret key
        const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
        res.header('X-OUTBOUND-TOKEN', hmac);
    })
    .catch(function (err) {
        misc.debug(whoami + 'Failed to verify webhook');
        throw err;
    });
    
}

module.exports.getToken = getToken;
module.exports.verifyWebhook = verifyWebhook;