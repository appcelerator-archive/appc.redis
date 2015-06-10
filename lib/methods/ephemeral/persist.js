module.exports = function () {

    return function persist(Model, instance, callback) {
        var key = this.createEphemeralKey(Model, instance.getPrimaryKey());

        this.client.persist(key, function(err, reply){
            (callback || function (){})(err, reply === 1);
        });
    };

};