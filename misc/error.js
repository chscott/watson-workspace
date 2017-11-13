function WWError(name, message) {
    
    let error = new Error(message);
    error.name = name;
    return error;
    
}

module.exports = WWError;