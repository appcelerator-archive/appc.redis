module.exports = function () {

    return function count(Model, callback) {

        this.getEphemeralKeys(Model, {
            limit: false
        } , function(err, keys){
            callback(err, !err ? keys.length : null);
        });

    };

};