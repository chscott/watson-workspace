const getMySpacesQuery = {
    "query": `
query getSpaces {
    spaces(first:200) {
        items {
            id
            title
        }
    }
}`
};

const getSpaceByIdQuery = {
    "query": `
query getSpace($spaceId: ID!) {
    space(id: $spaceId) {
        id
        title
        description
        created
        updated
        membersUpdated
        createdBy {
          id
          email
        }
        updatedBy {
          id
          email
        }
        members(first: 200) {
          items {
            email
            displayName
          }
        }
    }
}`
};

const getUserByIdQuery = { 
    "query": `
query getProfile($userId: ID!) {
    person(id: $userId) {
        id
        displayName
        email
    }
}`
};

const getUserByEmailQuery = { 
    "query": `
query getProfile($userEmail: String!) {
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