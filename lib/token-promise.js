function tokenWithPromise(token) {

    return new Promise(function (resolve, reject) {
        if (!token) {
            console.log('Invalid token. Will request a new one');
            return reject(new Error('InvalidTokenError'));
        } else {
            console.log('Valid token exists');
            resolve(token);
        }
    });

}

module.exports.getTokenPromise = tokenWithPromise;