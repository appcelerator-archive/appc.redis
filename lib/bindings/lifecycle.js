module.exports = function () {

    var redis = require('redis');
    require('node-redis-streamify')(redis);

    return {

        /**
         * Constructor to set up the state of the connector.
         */
        constructor: function() {
            this.primary_key = 'primary_key';
        },

        /**
         * This method is called before the server starts to allow the connector to connect to any external
         * resources if necessary (such as a Database, etc.).
         *
         * @param callback
         */
        connect: function(callback) {
            this.logger.debug('connecting');

            this.client = redis.createClient(
                this.config.port || 6379,
                this.config.host || '127.0.0.1',
                this.config.options || {}
            );

            this.client.scan = this.client.streamified('SCAN');

            this.client.on('connect', function(){
                this.logger.debug('connected');
                if(this.config.db){
                    this.client.select(this.config.db, callback);
                } else {
                    callback();
                }
            }.bind(this));
        },

        /**
         * This method is called before shutdown to allow the connector to cleanup any resources.
         *
         * @param callback
         */
        disconnect: function(callback) {
            this.logger.debug('disconnecting');

            this.client.end();

            callback();
        }

    };

};