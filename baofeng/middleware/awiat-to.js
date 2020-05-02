function to(promise) {
    return promise.then(rst => {
        return [null, rst];
    }).catch(err => {
        return [err];
    });
}
module.exports = to;