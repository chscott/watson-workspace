'use strict';

const TRACE_LEVEL = parseInt(process.env.TRACE) || 0;

// Trace components
const TRACE_ALL = parseInt(process.env.TRACE_ALL) || 0;
const TRACE_AUTH = parseInt(process.env.TRACE_AUTH) || 0;
const TRACE_MESSAGES = parseInt(process.env.TRACE_MESSAGES) || 0;
const TRACE_SPACES = parseInt(process.env.TRACE_SPACES) || 0;
const TRACE_USERS = parseInt(process.env.TRACE_USERS) || 0;
const TRACE_HTTP = parseInt(process.env.TRACE_HTTP) || 0;

function logTrace(msg, component) {

    if (TRACE_ALL > 0) {
        console.log(msg);
    } else if (component > 0) {
        console.log(msg);
    }

}

module.exports.logTrace = logTrace;
module.exports.TRACE_AUTH = TRACE_AUTH;
module.exports.TRACE_MESSAGES = TRACE_MESSAGES;
module.exports.TRACE_SPACES = TRACE_SPACES;
module.exports.TRACE_USERS = TRACE_USERS;
module.exports.TRACE_HTTP = TRACE_HTTP;