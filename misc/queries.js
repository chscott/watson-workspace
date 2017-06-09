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

const getUserByIdQuery = { 
    "query": `query getProfile($userId: ID!) {
                person(id: $userId) {
                    id
                    displayName
                    email
                }
            }`
};

const getUserByEmailQuery = { 
    "query": `query getProfile($userEmail: String!) {
                person(email: $userEmail) {
                    id
                    displayName
                    email
                }
            }`
};

module.exports.getMySpacesQuery = getMySpacesQuery;
module.exports.getSpaceByIdQuery = getSpaceByIdQuery;
module.exports.getUserByIdQuery = getUserByIdQuery;
module.exports.getUserByEmailQuery = getUserByEmailQuery;