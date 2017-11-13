const mySpacesQuery = {
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

const spaceByIdQuery = {
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

const userByIdQuery = { 
    "query": `
query getProfile($userId: ID!) {
    person(id: $userId) {
        id
        displayName
        email
    }
}`
};

const userByEmailQuery = { 
    "query": `
query getProfile($userEmail: String!) {
    person(email: $userEmail) {
        id
        displayName
        email
    }
}`
};

module.exports.getMySpacesQuery = () => new String(mySpacesQuery);
module.exports.getSpaceByIdQuery = () => new String(spaceByIdQuery);
module.exports.getUserByIdQuery = () => new String(userByIdQuery);
module.exports.getUserByEmailQuery = () => new String(userByEmailQuery);