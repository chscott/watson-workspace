// Public modules
const util = require('util');

// Local modules
const misc = require('../misc');

function assertJSONObject(obj) {
        
    const whoami = 'watson-workspace.misc.json.assertJSONObject(): ';
    var jsonError;
    
    misc.debug(whoami + 'Object:\n' + util.inspect(obj, { depth: null }));
    
    // If obj is not an object, it can't be a JSON object
    if (typeof(obj) !== 'object') {
        jsonError = new Error("Object is not valid JSON. The typeof is not 'object'");
        jsonError.name = 'InvalidJSONError';
        throw jsonError;
    }
    
    // If we can convert to string and parse back into a JSON, it's JSON
    try {
        JSON.parse(JSON.stringify(obj));
    }
    catch (error) {
        jsonError = new Error('Object is not valid JSON. Unable to convert to string and parse into JSON');
        jsonError.name = 'InvalidJSONError';
        throw jsonError;
    }
    
}

module.exports.assertJSONObject = assertJSONObject;