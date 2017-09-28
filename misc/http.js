const misc = require('../misc');
const util = require('util');

function statusCodeOK(res) {
    
    const whoami = 'watson-workspace.misc.http.statusCodeOK(): ';
        
    if (res.hasOwnProperty('statusCode') && res.statusCode === 200) {
        misc.debug(whoami + 'Received HTTP status code OK');
        return true;
    } else if (res.hasOwnProperty('statusCode')) {
        misc.debug(whoami + 'Received non-OK HTTP status code ' + res.statusCode);
        return false;
    } else {
        misc.debug(whoami + 'Response contains no status code');
        misc.debug(whoami + util.inspect(res, { depth: null }));
        return false;
    }
    
}

module.exports.statusCodeOK = statusCodeOK;