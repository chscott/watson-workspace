const spacesQuery = `
    query {
        spaces(first: 50) {
            items {
                id
                title
            }
        }
    }`;

const userQuery = `
    query getProfile {
        person($ATTRIBUTE: $USER) {
            id
            displayName
            email
        }
    }`;

module.exports.spacesQuery = spacesQuery;
module.exports.userQuery = userQuery;