function WWError(name, message) {
    
    var error = new Error(message);
    error.name = name;
    return error;
    
}

module.exports = WWError;