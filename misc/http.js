const misc = require('../misc');
const util = require('util');

function statusCodeOK(res) {
    
    const whoami = 'watson-workspace.misc.http.statusCodeOK(): ';
        
    if (res.hasOwnProperty('statusCode') && res.statusCode === 200) {
        misc.trace.logTrace(whoami + 'Received HTTP status code OK', misc.trace.TRACE_LEVEL_MEDIUM);
        return true;
    } else if (res.hasOwnProperty('statusCode')) {
        misc.trace.logTrace(whoami + 'Received non-OK HTTP status code ' + res.statusCode, misc.trace.TRACE_LEVEL_MEDIUM);
        return false;
    } else {
        misc.trace.logTrace(whoami + 'Response contains no status code', misc.trace.TRACE_LEVEL_MEDIUM);
        misc.trace.logTrace(whoami + util.inspect(res, { depth: null }), misc.trace.TRACE_LEVEL_HIGH);
        return false;
    }
    
}

module.exports.statusCodeOK = statusCodeOK;