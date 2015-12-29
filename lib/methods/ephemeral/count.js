// jscs:disable jsDoc
var _ = require('lodash');

module.exports = function () {

	return function count(Model, options, callback) {
		if (_.isFunction(options)) {
			callback = options;
			options = {};
		}
		this.getEphemeralKeys(Model, {
			limit: false
		}, function (err, keys) {
			callback(err, !err ? keys.length : null);
		});

	};

};
