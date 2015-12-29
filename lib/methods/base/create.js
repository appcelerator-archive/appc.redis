// jscs:disable jsDoc
module.exports = function () {

	return function create(Model, values, callback) {

		this.client.incr(Model.name + '_primary_key', function (err, key) {
			if (err) {
				return callback(err);
			}

			var stringKey = String(key);
			var instance = Model.instance(values);

			instance.setPrimaryKey(stringKey);

			this.client.hset(Model.name, stringKey, JSON.stringify(instance), function (err) {
				callback(err, !err && instance || null);
			});

		}.bind(this));

	};

};
