module.exports = function () {

    return {

        /**
         * Sets an expiration value on a given value already stored
         * in Redis.
         *
         * @param Model the model in use
         * @param instance the current model instance
         * @param seconds the seconds expiration
         * @param callback the callback to call on completion
         */
        expire: function (Model, instance, seconds, callback) {
            var key = this.createKey(Model, instance.getPrimaryKey());
            this.client.expire(key, seconds, callback && function(err, reply){
                callback(err, reply === 1);
            });
        },

        /**
         * Sets an expiration time on a given value already stored
         * in Redis.
         *
         * @param Model the model in use
         * @param instance the current model instance
         * @param date the date of expiration
         * @param callback the callback to call on completion
         */
        expireAt: function (Model, instance, date, callback) {
            var key = this.createKey(Model, instance.getPrimaryKey());
            this.client.expire(key, new Date(date).getTime(), callback && function(err, reply){
                callback(err, reply === 1);
            });
        },

        /**
         * Retrieves a list of primary keys in use for the provided
         * model.
         *
         * @param Model the model in use
         * @param [total] total number of keys to retrieve
         * @param callback the callback to call on completion
         */
        keys: function (Model, total, callback) {
            if(typeof total === 'function'){
                callback = total;
                total = 1000;
            }
            this.getStoredKeys(Model, {
                limit: total
            }, function(err, keys){
                callback(err, err ? null : keys && keys.length ? keys.map(function(k){
                    return k.slice(k.lastIndexOf(':') + 1);
                }) : []);
            });
        },

        /**
         * Clears a set expiration on a key already stored in Redis.
         *
         * @param Model the model in use
         * @param instance the current model instance
         * @param callback the callback to call on completion
         */
        persist: function (Model, instance, callback) {
            var key = this.createKey(Model, instance.getPrimaryKey());
            this.client.persist(key, callback && function(err, reply){
                callback(err, reply === 1);
            });
        },

        /**
         * Retrieves a remaining TTL for a key set in Redis.
         *
         * @param Model the model in use
         * @param instance the current model instance
         * @param callback the callback to call on completion
         */
        ttl: function (Model, instance, callback) {
            var key = this.createKey(Model, instance.getPrimaryKey());
            this.client.ttl(key, callback);
        }

    };

};