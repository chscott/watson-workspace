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
    Output on success: JSON object representing a valid token
    Output on failure: InvalidJSONError is an object is retrieved but isn't valid JSON
                       StatusCodeError for HTTP errors
*/
function getToken(token, id, secret, url) {
    
    const whoami = 'watson-workspace.lib.auth.getToken(): ';
    var tokenUrl = misc.urls.WW_OAUTH_URL;
    
    // Update the token URL if one was passed in
    if (url) {
        tokenUrl = url;
    }
    
    return Promise.resolve()
    // If the token is valid, return it
    .then( () => getTokenPromise(token) )
    // If the token is invalid, get a new one
    .catch( () => {
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
        .then( (res) => {
            if (misc.http.statusCodeOK(res)) {
                // Check if what we got back is valid JSON
                misc.json.assertJSONObject(res);
            }
        })
        .catch( (err) => {
            throw err;
        });
    });

}

/*
    Return a resolved or rejected Promise based on the current state of a token. If
    the token is null, reject. If the token is not null, resolve.
    Input: token
    Output on success: Resolved Promise
    Output on failure: Rejected Promise
*/
function getTokenPromise(token) {
    
    const whoami = 'watson-workspace.lib.auth.getTokenPromise(): ';

    return new Promise( (resolve, reject) => {
        // If the token is invalid, reject Promise with error
        if (!token.access_token) {
            misc.debug(whoami + 'Invalid token. Will request a new one');
            return reject(new Error('InvalidTokenError'));
        // If the token is valid, resolve Promise
        } else {
            misc.debug(whoami + 'Token is valid');
            return resolve(token);
        }
    });

}

/* 
    Verify a webhook by responding to challenge.
    Inputs:
        - Request object
        - Response object
        - Webhook secret
    Output on success: 
        - Response object contains challenge in a response field in the body
        - Response object contains computed HMAC of webhook secret in the X-OUTBOUND-TOKEN header
        - JSON object indicating success
    Output on failure: WebhookVerificationError
*/
function verifyWebhook(req, res, secret) {
    
    const whoami = 'watson-workspace.lib.auth.verifyWebhook(): ';
    
    misc.debug(whoami + 'Received a verification request from Watson Workspace');
    
    return Promise.resolve()
    .then( () => {
        // First requirement: JSON response body must contain the verification challenge in response value
        var body = { 'response': req.body.challenge };
        res.body = body;
        // Second requirement: X-OUTBOUND-TOKEN header contains HMAC-SHA256 hash of body with secret key
        const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
        res.header('X-OUTBOUND-TOKEN', hmac);
        return JSON.parse('{ "result" : "success" }');
    })
    .catch( (err) => {
        misc.debug(whoami + 'Throwing WebhookVerificationError');
        throw new misc.error('WebhookVerificationError', 'Unable to verify webhook');
    });
    
}

module.exports.getToken = getToken;
module.exports.verifyWebhook = verifyWebhook;