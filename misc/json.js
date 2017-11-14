'use strict';

const misc = require('../misc');

/*
    Returns true if obj is valid JSON and false if not
*/
function isJSONObject(obj) {

    let isValidJSON = true;

    // If obj is not an object, it can't be a JSON object
    if (typeof obj !== 'object') {
        isValidJSON = false;
    }

    // If we can convert to string and parse back into a JSON, it's JSON
    try {
        JSON.parse(JSON.stringify(obj));
    } catch (err) {
        isValidJSON = false;
    }

    return isValidJSON;

}

module.exports.isJSONObject = isJSONObject;