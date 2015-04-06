module.exports = function () {

    return {

        /**
         * Retrieves the Redis key for the provided model.
         *
         * @param Model the model in use
         * @param key the name of the key
         * @returns {string}
         */
        createKey: function (Model, key) {
            return Model.name + '::' + key;
        },

        /**
         * Creates an instance from a JSON object pulled from Redis.
         *
         * @param Model the model in use
         * @param result the result of a GET operation
         */
        createInstance: function (Model, result) {
            var instance = Model.instance(result);
            instance.setPrimaryKey(String(result.id));
            return instance;
        },

        /**
         * Increments a unique identifier on a per-model basis, and
         * returns the new value as the primary key.
         *
         * @param Model the model in use
         * @param callback to call on completion
         */
        getPrimaryKey: function (Model, callback) {
            this.client.incr(Model.name + '_' + this.primary_key, function(err, key){
                callback(err, key + '');
            });
        },

        /**
         * Retrieves all stored primary keys mapped for the Model
         * in use.
         *
         * @param Model the model in use
         * @param callback to call on completion
         */
        getStoredKeys: function (Model, callback) {
            this.client.keys(this.createKey(Model, '*'), callback);
        }

    };

};