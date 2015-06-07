module.exports = function () {

    return function expire(Model, instance, seconds, callback) {
        var key = this.createEphemeralKey(Model, instance.getPrimaryKey());

        this.client.expire(key, seconds, callback && function(err, reply){
            callback(err, reply === 1);
        });
    };

};