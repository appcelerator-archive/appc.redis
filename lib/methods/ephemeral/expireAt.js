module.exports = function () {

    return function expireAt(Model, instance, date, callback) {
        var key = this.createEphemeralKey(Model, instance.getPrimaryKey());

        this.client.expire(key, new Date(date).getTime(), callback && function(err, reply){
            callback(err, reply === 1);
        });
    };

};