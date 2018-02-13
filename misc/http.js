'use strict';

const misc = require('../misc');

/*
    Returns true if statusCode is 200 or 201 and false otherwise
*/
function isStatusCodeOK(statusCode) {

    if (statusCode && (statusCode === 200 || statusCode === 201)) {
        return true;
    } else {
        return false;
    }

}

module.exports.isStatusCodeOK = isStatusCodeOK;
