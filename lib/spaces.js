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
    misc.debug(whoami + 'GraphQL query (no variables): ' + JSON.stringify(query));
    
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
    .then( (res) => inspectGraphQLDataMultipleSpace(res) )
    // See if the requested space name is in the list of returned spaces
    .then( (spacesList) => {
        var targetSpace = spacesList.filter( (space) => {
            return space.title === spaceName;
        })[0];
        if (!targetSpace) {
            misc.debug(whoami + 'Throwing NoSuchSpaceError');
            throw new misc.error('NoSuchSpaceError', 'This app has not been added to the ' + spaceName + ' space');
        } else {
            misc.debug(whoami + 'Found space with title ' + spaceName);
            return targetSpace.id;
        }
    })
    // If the requested space name was found, get it
    .then( (spaceId) => getSpaceById(spaceId, token) )
    .catch( (err) => {
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
    .then( (res) => inspectGraphQLDataOneSpace(res, spaceId) )
    .catch( (err) => {
        throw err;
    });

}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLDataMultipleSpace(res) {
    
    const whoami = 'watson-workspace.lib.spaces.inspectGraphQLDataMultipleSpace(): ';
        
    // First see if we got back valid JSON
    misc.json.assertJSONObject(res);
    
    // Then check to see if the response contains errors
    if (res.errors) {
        misc.debug(whoami + 'Throwing GraphQLError');
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    } 
    
    // Then check to see if the response contains a list of spaces
    if (!res.data.spaces.items) {
        misc.debug(whoami + 'Throwing NoSpacesError');
        throw new misc.error('NoSpacesError', 'App does not belong to any spaces');
    }
    
    // If we haven't thrown an error yet, the data is good
    misc.debug(whoami + 'Spaces found for this app: ' + JSON.stringify(res.data.spaces.items)); 
    return res.data.spaces.items;
    
}

/*
    Check the GraphQL response data to see if it was successful
*/
function inspectGraphQLDataOneSpace(res, identifier) {
    
    const whoami = 'watson-workspace.lib.spaces.inspectGraphQLDataOneSpace(): ';
    
    // First see if we got back valid JSON
    misc.json.assertJSONObject(res);
    
    // Then check to see if the response contains errors
    if (res.errors) {
        misc.debug(whoami + 'Throwing GraphQLError');
        throw new misc.error('GraphQLError', JSON.stringify(res.errors));
    } 
    
    // Then check to see if the response contains a space
    if (!res.data.space) {
        misc.debug(whoami + 'Throwing NoSuchSpaceError');
        throw new misc.error('NoSuchSpaceError', 'The space ' + identifier + ' does not exist');
    }
    
    // If we haven't thrown an error yet, the data is good
    misc.debug(whoami + 'Space data: ' + JSON.stringify(res.data.space)); 
    return res.data.space; 
    
}

module.exports.getSpaceByName = getSpaceByName;
module.exports.getSpaceById = getSpaceById;