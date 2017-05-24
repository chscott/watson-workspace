const request = require('request-promise');
const WW_GRAPHQL_URL = 'https://api.watsonwork.ibm.com/graphql';

/*
    Success: JSON object representing the space requested
    Failure: SpacesQueryError on HTTP failure
             NoSuchSpaceError if the requested space isn't found
*/
function getSpace(query, spaceName, token) {
    
    const options = {
        method: 'POST',
        url: WW_GRAPHQL_URL,
        headers: {
            jwt: token,
            'Content-Type': 'application/graphql'
        },
        body: query
    };
            
    return request(options)
        .then(function (res) { 
            console.log('Spaces found for this app: ' + JSON.stringify(JSON.parse(res).data.spaces.items));
            return JSON.parse(res).data.spaces.items;
        })
        .then(function (spacesList) {
            var targetSpace = spacesList.filter(function (space) {
                return space.title === spaceName;
            })[0];
            if (!targetSpace) {
                throw new Error('NoSuchSpaceError: ' + 'Unable to find a space with title ' + spaceName);
            } else {
                console.log('Found space with title ' + spaceName);
                return targetSpace;
            }
        })
        .catch(function (err) {
            throw err;
        });

}

module.exports.getSpace = getSpace;