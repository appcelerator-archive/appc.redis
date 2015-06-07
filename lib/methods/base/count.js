module.exports = function () {

    return function count(Model, callback) {

        this.client.hlen(Model.name, function(err, count){
            callback(err, !err ? count : null);
        });

    };

};