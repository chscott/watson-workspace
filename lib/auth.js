const request = require('request-promise');
const crypto = require('crypto');
const tokenPromise = require('./token-promise');
const WW_OAUTH_URL = 'https://api.watsonwork.ibm.com/oauth/token';

/*
    Success: token
    Failure: AuthenticationError
*/
function getToken(token, id, secret) {
    
    // Check for null token
    return tokenPromise.getTokenPromise(token)
    
    // Promise rejection triggers request for a new token   
    .catch(function () {
        
        console.log('Requesting a new token from ' + WW_OAUTH_URL);
        
        const options = {
            method: 'POST',
            url: WW_OAUTH_URL,
            auth: {
                user: id,
                pass: secret
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        return request(options)
            .then(function (res) {
                console.log('Successfully obtained new token');
                return res.access_token;
            })
            .catch(function (err) {
                throw err;
            });
        
    });

}

// Verify the webhook by responding to challenge
function verifyWebhook(req, res, secret) {
    
    console.log('Received a verification request from Watson Workspace');
    
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