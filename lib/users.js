'use strict';

const request = require('request-promise');
const misc = require('../misc');
const whoami = 'watson-workspace.lib.users: ';

/*
    Input:   User id and token obtained from getToken()
    Success: JSON object representing the user requested
    Failure: NoSuchUserError if the requested user isn't found
             GraphQLError if the GraphQL query returned errors
             StatusCodeError for HTTP errors
*/
function getUserById(userId, token) {

    let query = misc.queries.getUserByIdQuery();
    query.variables = { "userId": userId };
    misc.trace.logTrace(whoami + 'GraphQL query with variables: ' + JSON.stringify(query), misc.trace.TRACE_USERS);

    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'jwt': token,
            'Content-Type': 'application/json'
        },
        body: query
    };

    // Make the request
    return Promise.resolve()
        .then(() => request(options))
        .then(res => {
            if (!misc.http.isStatusCodeOK(res.statusCode)) {
                throw new misc.error('NonOKStatusCodeError', 'Status code: [' + res.statusCode + ']');
            }
            if (!misc.json.isJSONObject(res.body)) {
                throw new misc.error('InvalidJSONError', 'Response body is not valid JSON');
            }
            return res.body;
        })
        .then(body => inspectGraphQLResponse(body, userId))
        .catch(err => {
            misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_USERS);
            throw err;
        });

}

/*
    Input:   User email address and token obtained from getToken()
    Success: JSON object representing the user requested
    Failure: NoSuchUserError if the requested user isn't found
             GraphQLError if the GraphQL query returned errors
             StatusCodeError for HTTP errors
             
*/
function getUserByEmail(userEmail, token) {

    let query = misc.queries.getUserByEmailQuery();
    query.variables = { "userEmail": userEmail };
    misc.trace.logTrace(whoami + 'GraphQL query with variables: ' + JSON.stringify(query), misc.trace.TRACE_USERS);

    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'jwt': token,
            'Content-Type': 'application/json'
        },
        body: query
    };

    // Make the request
    return Promise.resolve()
        .then(() => request(options))
        .then(res => {
            if (!misc.http.isStatusCodeOK(res.statusCode)) {
                throw new misc.error('NonOKStatusCodeError', 'Status code: [' + res.statusCode + ']');
            }
            if (!misc.json.isJSONObject(res.body)) {
                throw new misc.error('InvalidJSONError', 'Response body is not valid JSON');
            }
            return res.body;
        })
        .then(body => inspectGraphQLResponse(body, userEmail))
        .catch(err => {
            misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_USERS);
            throw err;
        });

}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLResponse(res, identifier) {

    // Then check to see if the response contains errors
    if (res.errors) {
        misc.trace.logTrace(whoami + 'Throwing GraphQLError', misc.trace.TRACE_USERS);
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    }

    // Then check to see if the response contains a user
    if (!res.data.person) {
        misc.trace.logTrace(whoami + 'Throwing NoSuchUserError', misc.trace.TRACE_USERS);
        throw new misc.error('NoSuchUserError', 'The user ' + identifier + ' does not exist');
    }

    // If we haven't thrown an error yet, the data is good
    misc.trace.logTrace(whoami + 'User data: ' + JSON.stringify(res.data.person), misc.trace.TRACE_USERS);
    return res.data.person;

}

module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;