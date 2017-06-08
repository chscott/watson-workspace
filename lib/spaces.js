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
             StatusCodeError for HTTP errors
*/
function getSpaceByName(spaceName, token) {
    
    const whoami = 'watson-workspace.lib.spaces.getSpaceByName(): ';
    
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: misc.queries.getMySpacesQuery
    };
            
    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => { 
        misc.debug(whoami + 'Spaces found for this app: ' + JSON.stringify(JSON.parse(res).data.spaces.items));
        return JSON.parse(res).data.spaces.items;
    })
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
             StatusCodeError for HTTP errors
*/
function getSpaceById(spaceId, token) {
    
    const whoami = 'watson-workspace.lib.spaces.getSpaceById(): ';
    
    // Replace the placeholder in the space query with the actual space ID
    spaceId = '"' + spaceId + '"';
    const query = (misc.queries.getSpaceByIdQuery.replace('$ID', spaceId));
    misc.debug(whoami + 'Generated space query is: ' + query);
    
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: query
    };
    
    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => { 
        json = JSON.parse(res);
        misc.debug(whoami + 'Space info: ' + JSON.stringify(json.data.space));
        // If space attribute is null, this space doesn't exist
        if (!json.data.space) {
            misc.debug(whoami + 'Throwing NoSuchSpaceError');
            throw new misc.error('NoSuchSpaceError', 'No space exists with ID ' + spaceId);
        } else {
            return json.data.space;
        }
    })
    .catch( (err) => {
        throw err;
    });

}

module.exports.getSpaceByName = getSpaceByName;
module.exports.getSpaceById = getSpaceById;