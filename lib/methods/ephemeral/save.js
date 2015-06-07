module.exports = function () {

    return function save(Model, instance, callback) {

        var key = this.createEphemeralKey(Model, instance.getPrimaryKey());

        this.client.set(key, JSON.stringify(instance), function(err){
            callback(err, !err && instance || null);
        });

    };

};