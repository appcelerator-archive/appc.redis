module.exports = function () {

    return function persist(Model, instance, callback) {
        var key = this.createKey(Model, instance.getPrimaryKey());

        this.client.persist(key, callback && function(err, reply){
            callback(err, reply === 1);
        });
    };

};