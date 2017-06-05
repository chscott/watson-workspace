const request = require('request-promise');
const misc = require('../misc');

/*
    Input:   Space name and token obtained from getToken()
    Success: JSON object representing the space requested
    Failure: SpacesQueryError on HTTP failure
             NoSuchSpaceError if the requested space isn't found
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
    return request(options)
        .then(function (res) { 
            misc.debug(whoami + 'Spaces found for this app: ' + JSON.stringify(JSON.parse(res).data.spaces.items));
            return JSON.parse(res).data.spaces.items;
        })
        .then(function (spacesList) {
            var targetSpace = spacesList.filter(function (space) {
                return space.title === spaceName;
            })[0];
            if (!targetSpace) {
                throw new Error('NoSuchSpaceError: ' + 'This app has not been added to the ' + spaceName + ' space');
            } else {
                misc.debug('Found space with title ' + spaceName);
                return targetSpace;
            }
        })
        .catch(function (err) {
            throw err;
        });

}

module.exports.getSpace = getSpace;