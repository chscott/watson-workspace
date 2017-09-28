// Public modules
const request = require('request-promise');

// Local modules
const misc = require('../misc');

/*
    Get a specified space this app belongs to. This is a two-step process
    since there is no direct way to retrieve a space by name. Step 1 is
    to get a list of all spaces the app belongs to. Step 2 is to filter 
    that list to extract the ID for the matching space and then get the
    space by ID.
    
    Input:   Space name and token obtained from getToken()
    Success: JSON object representing the space requested
    Failure: NoSuchSpaceError if the requested space isn't found
             GraphQLError if the GraphQL query returned errors
             StatusCodeError for HTTP errors
*/
function getSpaceByName(spaceName, token) {
    
    const whoami = 'watson-workspace.lib.spaces.getSpaceByName(): ';
    
    /* 
       JSON.parse(JSON.stringify(obj)) will create a new object. This is needed so multiple,
       overlapping calls to this function won't end up using the same object reference.
    */
    var query = JSON.parse(JSON.stringify(misc.queries.getMySpacesQuery));
    misc.trace.logTrace(whoami + 'GraphQL query (no variables): ' + JSON.stringify(query), misc.trace.TRACE_LEVEL_HIGH);
    
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
    .then( () => request(options) )
    .then( (res) => {
        if (misc.http.statusCodeOK(res)) {
            // Check if what we got back is valid JSON
            misc.json.assertJSONObject(res.body);
            return res.body;
        }
    })
    // Parse the response body to see if it was successful
    .then( (body) => inspectGraphQLDataMultipleSpace(body) )
    // See if the requested space name is in the list of returned spaces
    .then( (spacesList) => {
        var targetSpace = spacesList.filter( (space) => {
            return space.title === spaceName;
        })[0];
        if (!targetSpace) {
            misc.trace.logTrace(whoami + 'Throwing NoSuchSpaceError', misc.trace.TRACE_LEVEL_LOW);
            throw new misc.error('NoSuchSpaceError', 'This app has not been added to the ' + spaceName + ' space');
        } else {
            misc.trace.logTrace(whoami + 'Found space with title ' + spaceName, misc.trace.TRACE_LEVEL_MEDIUM);
            return targetSpace.id;
        }
    })
    // If the requested space name was found, get it
    .then( (spaceId) => getSpaceById(spaceId, token) )
    .catch( (err) => {
        misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_LEVEL_LOW);
        throw err;
    });

}

/*
    Get a specified space this app belongs to. 
    
    Input:   Space ID and token obtained from getToken()
    Success: JSON object representing the space requested
    Failure: NoSuchSpaceError if the requested space isn't found
             GraphQLError if the GraphQL query returned errors
             StatusCodeError for HTTP errors
*/
function getSpaceById(spaceId, token) {
    
    const whoami = 'watson-workspace.lib.spaces.getSpaceById(): ';
    
    /* 
       JSON.parse(JSON.stringify(obj)) will create a new object. This is needed so multiple,
       overlapping calls to this function won't end up using the same object reference.
    */
    var query = JSON.parse(JSON.stringify(misc.queries.getSpaceByIdQuery));
    query.variables = { "spaceId": spaceId };
    misc.trace.logTrace(whoami + 'GraphQL query with variables: ' + JSON.stringify(query), misc.trace.TRACE_LEVEL_HIGH);
    
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
    .then( () => request(options) )
    .then( (res) => {
        if (misc.http.statusCodeOK(res)) {
            // Check if what we got back is valid JSON
            misc.json.assertJSONObject(res.body);
            return res.body;
        }
    })
    .then( (body) => inspectGraphQLDataOneSpace(body, spaceId) )
    .catch( (err) => {
        misc.trace.logTrace(whoami + 'Throwing request error', misc.trace.TRACE_LEVEL_LOW);
        throw err;
    });

}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLDataMultipleSpace(res) {
    
    const whoami = 'watson-workspace.lib.spaces.inspectGraphQLDataMultipleSpace(): ';
        
    // Check to see if the response contains errors
    if (res.errors) {
        misc.trace.logTrace(whoami + 'Throwing GraphQLError', misc.trace.TRACE_LEVEL_LOW);
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    } 
    
    // Check to see if the response contains a list of spaces
    if (!res.data.spaces.items) {
        misc.trace.logTrace(whoami + 'Throwing NoSpacesError', misc.trace.TRACE_LEVEL_LOW);
        throw new misc.error('NoSpacesError', 'App does not belong to any spaces');
    }
    
    // If we haven't thrown an error yet, the data is good
    misc.trace.logTrace(whoami + 'Spaces found for this app: ' + JSON.stringify(res.data.spaces.items),
                        misc.trace.TRACE_LEVEL_MEDIUM); 
    return res.data.spaces.items;
    
}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLDataOneSpace(res, identifier) {
    
    const whoami = 'watson-workspace.lib.spaces.inspectGraphQLDataOneSpace(): ';
    
    // Then check to see if the response contains errors
    if (res.errors) {
        misc.trace.logTrace(whoami + 'Throwing GraphQLError', misc.trace.TRACE_LEVEL_LOW);
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    } 
    
    // Then check to see if the response contains a space
    if (!res.data.space) {
        misc.trace.logTrace(whoami + 'Throwing NoSuchSpaceError', misc.trace.TRACE_LEVEL_LOW);
        throw new misc.error('NoSuchSpaceError', 'The space ' + identifier + ' does not exist');
    }
    
    // If we haven't thrown an error yet, the data is good
    misc.trace.logTrace(whoami + 'Space data: ' + JSON.stringify(res.data.space), misc.trace.TRACE_LEVEL_MEDIUM); 
    return res.data.space; 
    
}

module.exports.getSpaceByName = getSpaceByName;
module.exports.getSpaceById = getSpaceById;