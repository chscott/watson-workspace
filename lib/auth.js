'use strict';

const request = require('request-promise');
const crypto = require('crypto');
const misc = require('../misc');
const whoami = 'watson-workspace.lib.auth: ';

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

    let tokenUrl = misc.urls.WW_OAUTH_URL;

    // Update the token URL if one was passed in
    if (url) {
        tokenUrl = url;
    }

    return Promise.resolve()
        .then(() => {
            return getTokenPromise(token);
        })
        .catch(() => {
            // Get a new token
            misc.trace.logTrace(whoami + 'Requesting a new token from ' + tokenUrl, misc.trace.TRACE_AUTH);

            // Create the request object
            const options = {
                method: 'POST',
                url: tokenUrl,
                json: true,
                resolveWithFullResponse: true,
                auth: {
                    user: id,
                    pass: secret
                },
                form: {
                    grant_type: 'client_credentials'
                }
            };

            // Make the request
            return request(options)
                .then(res => {
                    if (!misc.http.isStatusCodeOK(res.statusCode)) {
                        throw new misc.error('NonOKStatusCodeError', 'Status code: [' + res.statusCode + ']');
                    }
                    if (!misc.json.isJSONObject(res.body)) {
                        throw new misc.error('InvalidJSONError', 'Response body is not valid JSON');
                    }
                    return res.body;
                })
                .catch(err => {
                    misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_AUTH);
                    throw err;
                });

        });

}

/*
    Return a resolved or rejected Promise based on the current state of a token.
    Input: token
    Output on success: Resolved Promise
    Output on failure: Rejected Promise
*/
function getTokenPromise(token) {

    return new Promise((resolve, reject) => {
        // If the token is invalid, reject Promise with error
        if (!token || !token.access_token || (token.invalid && token.invalid === true)) {
            misc.trace.logTrace(whoami + 'Invalid token', misc.trace.TRACE_AUTH);
            return reject(new misc.error('InvalidTokenError', 'The current token is invalid'));
            // If the token is valid, resolve Promise
        } else {
            misc.trace.logTrace(whoami + 'Token is valid: ' + JSON.stringify(token), misc.trace.TRACE_AUTH);
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

    misc.trace.logTrace(whoami + 'Received a verification request from Watson Workspace', misc.trace.TRACE_AUTH);

    return Promise.resolve()
        .then(() => {
            // First requirement: JSON response body must contain the verification challenge in response value
            let body = {
                'response': req.body.challenge
            };
            res.body = body;
            // Second requirement: X-OUTBOUND-TOKEN header contains HMAC-SHA256 hash of body with secret key
            const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
            res.header('X-OUTBOUND-TOKEN', hmac);
            return JSON.parse('{ "result" : "success" }');
        })
        .catch(err => {
            misc.trace.logTrace(whoami + 'Throwing WebhookVerificationError', misc.trace.TRACE_AUTH);
            throw new misc.error('WebhookVerificationError', 'Unable to verify webhook');
        });

}

module.exports.getToken = getToken;
module.exports.verifyWebhook = verifyWebhook;
