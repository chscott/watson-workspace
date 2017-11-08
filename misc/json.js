// Local modules
const misc = require('../misc');

/*
    Throws an error if the object is not JSON. Otherwise, no-op.
*/
function assertJSONObject(obj) {
                
    // If obj is not an object, it can't be a JSON object
    if (typeof(obj) !== 'object') {
        throw new misc.error('InvalidJSONError', "typeof is not 'object'");
    }
    
    // If we can convert to string and parse back into a JSON, it's JSON
    try {
        JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        throw new misc.error('InvalidJSONError', 'Unable to convert to string and parse into JSON');
    }
    
}

module.exports.assertJSONObject = assertJSONObject;