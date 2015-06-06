module.exports = function () {

    return function ttl(Model, instance, callback) {
        this.client.ttl(
            this.createKey(Model, instance.getPrimaryKey()), callback
        );
    };

};