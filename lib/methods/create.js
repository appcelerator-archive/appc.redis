module.exports = function () {

    return function create(Model, values, callback) {

        this.getPrimaryKey(Model, function(err, key){
            if(err){
                return callback(err);
            }

            var input = this.createKey(Model, key);
            var instance = Model.instance(values);

            instance.setPrimaryKey(key);

            this.client.set(input, JSON.stringify(instance), function(err){
                callback(err, !err && instance || null);
            });

        }.bind(this));

    };

};