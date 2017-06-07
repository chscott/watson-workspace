// Public modules
const request = require('request-promise');

// Local modules
const misc = require('../misc');

/*
    Get a specified space this app belongs to
    Input:   Space name and token obtained from getToken()
    Success: JSON object representing the space requested
    Failure: NoSuchSpaceError if the requested space isn't found
             StatusCodeError for HTTP errors
*/
function getSpace(spaceName, token) {
    
    const whoami = 'watson-workspace.lib.spaces.getSpace(): ';
    
    // Create the request object
    const options = {
        method: 'POST',
        url: misc.urls.WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: misc.queries.spacesQuery
    };
            
    // Make the request
    return Promise.resolve()
    .then( () => request(options) )
    .then( (res) => { 
        misc.debug(whoami + 'Spaces found for this app: ' + JSON.stringify(JSON.parse(res).data.spaces.items));
        return JSON.parse(res).data.spaces.items;
    })
    .then( (spacesList) => {
        var targetSpace = spacesList.filter( (space) => {
            return space.title === spaceName;
        })[0];
        if (!targetSpace) {
            misc.debug(whoami + 'Throwing NoSuchSpaceError');
            throw new misc.error('NoSuchSpaceError', 'This app has not been added to the ' + spaceName + ' space');
        } else {
            misc.debug(whoami + 'Found space with title ' + spaceName);
            return targetSpace;
        }
    })
    .catch( (err) => {
        throw err;
    });

}

module.exports.getSpace = getSpace;