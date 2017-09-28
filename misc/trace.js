const TRACE_LEVEL = parseInt(process.env.TRACE) || 0;

// Trace levels. The higher the number, the more verbose the level
const TRACE_LEVEL_OFF = 0;
const TRACE_LEVEL_LOW = 1;
const TRACE_LEVEL_MEDIUM = 2;
const TRACE_LEVEL_HIGH = 3;

function logTrace(msg, level) {
        
    // Tracing is disabled, so don't print
    if (TRACE_LEVEL === TRACE_LEVEL_OFF) {
        return;
    }
    
    // level was not specified, so treat it as level high
    if (!level) {
        console.log('Warning: logTrace() called without a specified level');
        level = TRACE_LEVEL_HIGH;
    }
    
    // Print all trace statements at specified level or lower
    if (TRACE_LEVEL >= level) {
        console.log(msg);
    }
    
}

module.exports.logTrace = logTrace;
module.exports.TRACE_LEVEL_OFF = TRACE_LEVEL_OFF;
module.exports.TRACE_LEVEL_LOW = TRACE_LEVEL_LOW;
module.exports.TRACE_LEVEL_MEDIUM = TRACE_LEVEL_MEDIUM;
module.exports.TRACE_LEVEL_HIGH = TRACE_LEVEL_HIGH;