// jscs:disable jsDoc
module.exports = function (Arrow) {

	var _ = require('lodash');
	var async = require('async');

	return function query(Model, options, callback) {
		var properties = options.where,
			propKeys = _.keys(properties);

		if ((options.page && options.page !== 1) ||
			(options.skip && options.skip !== 0) ||
			(options.per_page && options.per_page !== 10 && !options.limit) || options.order) {
			this.logger.warn('Options page, per_page, skip, and order have not been implemented by this connector!');
			this.logger.warn('These options do not make sense inside the context of Redis.');
		}

		var selection;

		if (options.sel) {
			selection = _.keys(options.sel);
		}

		if (options.unsel) {
			var ignoredKeys = _.keys(options.unsel);
			selection = _.keys(Model.fields).filter(function (key) {
				return ignoredKeys.indexOf(key) === -1;
			});
		}

		var cache = {};
		var limit;

		if (options.limit !== undefined) {
			limit = options.limit;
		}

		var results = [];

		var count = options.count || 250;
		var cursor = 0;

		async.doWhilst(
			// process phase
			function (next) {
				// scan for the pattern and the count
				this.client.hscan(Model.name, cursor, 'MATCH', '*', 'COUNT', count, function (err, response) {
					if (err) {
						return next(err);
					}

					cursor = Number(response[0]);

					var values = [];

					for (var i = 0, j = response[1].length; i < j; i += 2) {
						values.push({
							key: response[1][i],
							value: JSON.parse(response[1][i + 1])
						});
					}

					async.eachSeries(values, function (result, done) {

						if (cache.hasOwnProperty(result.key)) {
							return done();
						}

						cache[result.key] = true;

						var found = 0;

						for (var c = 0; c < propKeys.length; c++) {
							var propKey = propKeys[c];
							if (propKey in result.value && result.value[propKey] === properties[propKey]) {
								found++;
								break;
							}
						}

						if (found === propKeys.length) {
							if (selection) {
								results.push(
									this.createInstance(Model, _.pick.bind(_, result.value).apply(_, selection))
								);
							} else {
								results.push(
									this.createInstance(Model, result.value)
								);
							}

							if (limit && results.length === limit) {
								return next();
							}
						}

						done();

					}.bind(this), next);

				}.bind(this));

			}.bind(this),

			// condition phase
			function () {
				return cursor !== 0 && (!limit || results.length !== limit);
			},

			// end phase
			function (err) {
				if (err) {
					return callback(err);
				}
				callback(null, new Arrow.Collection(Model, results));
			}
		);

	};

};
