module.exports = function () {

    return function deleteOne(Model, instance, callback) {

        var key = this.createEphemeralKey(Model, instance.getPrimaryKey());

        this.client.del(key, function(err){
            callback(err, !err && instance || null);
        });

    };

};