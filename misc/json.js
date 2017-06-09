const misc = require('../misc');
const util = require('util');

function assertJSONObject(obj) {
        
    var jsonError = new Error('Object is not valid JSON');
    jsonError.name = 'InvalidJSONError';
    
    // If obj is not an object, it can't be a JSON object
    if (typeof(obj) !== 'object') {
        throw jsonError;
    }
    
    // If we can convert to string and parse back into a JSON, it's JSON
    try {
        JSON.parse(JSON.stringify(obj));
    }
    catch (error) {
        throw jsonError;
    }
    
}

module.exports.assertJSONObject = assertJSONObject;