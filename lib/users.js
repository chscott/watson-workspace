const request = require('request-promise');
const misc = require('../misc');

/*
    Input:   User id and token obtained from getToken()
    Success: JSON object representing the user requested
    Failure: NoSuchUserError if the requested user isn't found
             GraphQLError if the GraphQL query returned errors
             StatusCodeError for HTTP errors
*/
function getUserById(userId, token) {
    
    const whoami = 'watson-workspace.lib.users.getUserById(): ';
    
    // The GraphQL query is a JSON object defining the query and variables
    var query = misc.queries.getUserByIdQuery;
    query.variables = { "userId": userId };
    misc.debug(whoami + 'GraphQL query with variables: ' + JSON.stringify(query));
        
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/json'
        },
        body: query,
        json: true
    };
      
    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => inspectGraphQLResponse(res, userId) )
    .catch( (err) => {
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
    
    const whoami = 'watson-workspace.lib.users.getUserByEmail(): ';
    
    // The GraphQL query is a JSON object defining the query and variables
    var query = misc.queries.getUserByEmailQuery;
    query.variables = { "userEmail": userEmail };
    misc.debug(whoami + 'GraphQL query with variables: ' + JSON.stringify(query));
    
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/json'
        },
        body: query,
        json: true
    };
     
    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => inspectGraphQLResponse(res, userEmail) )
    .catch( (err) => {
        throw err;
    });

}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLResponse(res, identifier) {
    
    const whoami = 'watson-workspace.lib.users.inspectGraphQLResponse(): ';
    
    // First see if we got back valid JSON
    misc.json.assertJSONObject(res);
    
    // Then check to see if the response contains errors
    if (res.errors) {
        misc.debug(whoami + 'Throwing GraphQLError');
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    } 
    
    // Then check to see if the response contains a user
    if (!res.data.person) {
        misc.debug(whoami + 'Throwing NoSuchUserError');
        throw new misc.error('NoSuchUserError', 'The user ' + identifier + ' does not exist');
    }
    
    // If we haven't thrown an error yet, the data is good
    misc.debug(whoami + 'User data: ' + JSON.stringify(res.data.person)); 
    return res.data.person; 
    
}

module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;