module.exports = function () {

	var Redis = require('ioredis');

	return {

		/**
		 * This method is called before the server starts to allow the connector to connect to any external
		 * resources if necessary (such as a Database, etc.).
		 *
		 * @param callback
		 */
		connect: function (callback) {
			this.logger.debug('connecting');

			this.client = new Redis(
				this.config.port || 6379,
				this.config.host || '127.0.0.1',
				this.config.opts || {}
			);

			this.client.once('connect', function () {
				this.logger.info('connected');
				callback();
			}.bind(this));
		},

		/**
		 * This method is called before shutdown to allow the connector to cleanup any resources.
		 *
		 * @param callback
		 */
		disconnect: function (callback) {
			this.logger.debug('disconnecting');

			this.client.quit();

			callback();
		}

	};

};
