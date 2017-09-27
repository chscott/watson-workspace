const misc = require('../misc');

function statusCodeOK(res) {
    
    const whoami = 'watson-workspace.misc.statusCodeOK(): ';
        
    if (res.hasOwnProperty('statusCode') && res.statusCode === 200) {
        misc.debug(whoami + 'Received HTTP status code OK');
        return true;
    } else {
        misc.debug(whoami + 'Received non-OK HTTP status code');
        return false;
    }
    
}

module.exports.statusCodeOK = statusCodeOK;