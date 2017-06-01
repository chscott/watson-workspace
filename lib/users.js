const request = require('request-promise');
const misc = require('../misc');
const queries = require('./queries');
const urls = require('./urls');

/*
    Input:   User id and token obtained from getToken()
    Success: JSON object representing the user requested
    Failure: UserQueryError on HTTP failure
             NoSuchUserError if the requested user isn't found
*/
function getUserById(id, token) {
    
    const whoami = 'watson-workspace.lib.users.getUserById(): ';
    
    // Replace the placeholder in the user query with the actual user ID
    id = '"' + id + '"';
    const query = (queries.userQuery.replace('$ATTRIBUTE', 'id')).replace('$USER', id);
    misc.debug(whoami + 'Generated user query is: ' + query);
    
    // Create the request object
    const options = {
        method: 'POST',
        url: urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: query
    };
      
    // Make the request
    return request(options)
        // HTTP request was successful. Inspect contents to see if we have valid user data
        .then(function (res) { 
            const data = JSON.parse(res).data;
            // Invalid data. Throw error
            if (!data.person) {
                misc.debug(whoami + 'Caught GraphQL error. Throwing...');
                throw new Error('NoSuchUserError: ' + 'No user exists with ID ' + id);
            // Valid data. Return user data
            } else {
                misc.debug(whoami + 'User data: ' + JSON.stringify(data)); 
                return JSON.parse(res).data;
            }
        })
        // HTTP request failed. Throw error
        .catch(function (err) {
            misc.debug(whoami + 'Caught HTTP request error. Throwing...');
            throw err;
        });

}

/*
    Input:   User email address and token obtained from getToken()
    Success: JSON object representing the user requested
    Failure: UserQueryError on HTTP failure
             NoSuchUserError if the requested user isn't found
*/
function getUserByEmail(email, token) {
    
    const whoami = 'watson-workspace.lib.users.getUserByEmail(): ';
    
    // Replace the placeholders in the user query with the actual info
    email = '"' + email + '"';
    const query = (queries.userQuery.replace('$ATTRIBUTE', 'email')).replace('$USER', email);
    misc.debug(whoami + 'Generated user query is: ' + query);
    
    // Create the request object
    const options = {
        method: 'POST',
        url: urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: query
    };
     
    // Make the request
    return request(options)
        // HTTP request was successful. Inspect contents to see if we have valid user data
        .then(function (res) { 
            const data = JSON.parse(res).data;
            // Invalid data. Throw error
            if (!data.person) {
                misc.debug(whoami + 'Caught GraphQL error. Throwing...');
                throw new Error('NoSuchUserError: ' + 'No user exists with email address ' + email);
            // Valid data. Return user data
            } else {
                misc.debug(whoami + 'User data: ' + JSON.stringify(data)); 
                return JSON.parse(res).data;
            }
        })
        // HTTP request failed. Throw error
        .catch(function (err) {
            misc.debug(whoami + 'Caught HTTP request error. Throwing...');
            throw err;
        });

}

module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;