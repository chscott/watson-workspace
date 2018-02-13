'use strict';

const debug = process.env.DEBUG || 'false';

function logDebug(msg, level) {

    if (debug.toLowerCase() === 'true') {
        console.log(msg);
    }

}

module.exports = logDebug;