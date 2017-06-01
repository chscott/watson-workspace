const debug = process.env.DEBUG || 'false';

function logDebug(msg) {
    
    if (debug.toLowerCase() === 'true') {
        console.log(msg);
    }
    
}

module.exports = logDebug;