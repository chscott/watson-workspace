const getMySpacesQuery = `
    query {
        spaces(first:200) {
            items {
                id
                title
            }
        }
    }`;

const getSpaceByIdQuery = `
    query getSpace {
        space(id: $ID) {
            title
            description
            created
            updated
            id
            members(first: 200) {
              items {
                email
                displayName
              }
            }
            membersUpdated
            createdBy {
              id
              email
            }
            updatedBy {
              id
              email
            }
        }
    }`;

const getUserQuery = `
    query getProfile {
        person($ATTRIBUTE: $USER) {
            id
            displayName
            email
        }
    }`;

module.exports.getMySpacesQuery = getMySpacesQuery;
module.exports.getSpaceByIdQuery = getSpaceByIdQuery;
module.exports.getUserQuery = getUserQuery;
