// Local modules
const misc = require('../misc');

/*
    Throws an error if the status code is not HTTP 200. Otherwise, no-op.
*/
function assertStatusCodeOK(res) {
    
    if (!res.statusCode) {
        throw new misc.error('NoStatusCodeError', 'Response contains no status code property');
    } else if (res.statusCode !== 200) {
        throw new misc.error('NonOKStatusCodeError', 'Status code is not 200');
    }
    
}

module.exports.statusCodeOK = statusCodeOK;