const request = require('request-promise');
const crypto = require('crypto');
const misc = require('../misc');
const urls = require('./urls');

/*
    Input:   Token object of unknown validity, app ID, app secret
    Success: Valid token
    Failure: AuthenticationError
*/
function getToken(token, id, secret) {
    
    const whoami = 'watson-workspace.lib.auth.getToken(): ';
    
    // Check for null token
    return getTokenPromise(token)
    
        // Promise rejection triggers request for a new token   
        .catch(function () {

            misc.debug(whoami + 'Requesting a new token from ' + urls.WW_OAUTH_URL);

            // Create the request object
            const options = {
                method: 'POST',
                url: urls.WW_OAUTH_URL,
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
                    throw err;
                });

        });

}

function getTokenPromise(token) {
    
    const whoami = 'watson-workspace.lib.auth.getTokenPromise(): ';

    return new Promise(function (resolve, reject) {
        if (!token) {
            misc.debug(whoami + 'Invalid token. Will request a new one');
            return reject(new Error('InvalidTokenError'));
        } else {
            misc.debug(whoami + 'Valid token exists');
            resolve(token);
        }
    });

}

// Verify the webhook by responding to challenge
function verifyWebhook(req, res, secret) {
    
    const whoami = 'watson-workspace.lib.auth.verifyWebhook(): ';
    
    misc.debug(whoami + 'Received a verification request from Watson Workspace');
    
    // First requirement: JSON response body must contain the verification challenge in response value
    var body = { 'response': req.body.challenge };
    res.body = body;
    
    // Second requirement: X-OUTBOUND-TOKEN header contains HMAC-SHA256 hash of body with secret key
    const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    res.header('X-OUTBOUND-TOKEN', hmac);
    
    // Third requirement is for response to send status 200. No code required here for that.
    
}

module.exports.getToken = getToken;
module.exports.verifyWebhook = verifyWebhook;