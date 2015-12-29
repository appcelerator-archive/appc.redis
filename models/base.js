// jscs:disable jsDoc
var Arrow = require('arrow');

var Base = Arrow.Model.extend('base', {

	connector: 'appc.redis',

	fields: {},

	ids: function (limit, callback) {
		return this.getConnector().ids(this.getModel(), limit, callback);
	}

});

module.exports = Base;
