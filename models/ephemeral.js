// jscs:disable jsDoc
var Arrow = require('arrow');

var Ephemeral = Arrow.Model.extend('ephemeral', {

	connector: 'appc.redis',

	fields: {},

	expire: function (seconds, callback) {
		return getConnectorDelegate(this, 'expire')(this.getModel(), this, seconds, callback);
	},

	expireAt: function (date, callback) {
		return getConnectorDelegate(this, 'expireAt')(this.getModel(), this, date, callback);
	},

	ids: function (limit, callback) {
		return getConnectorDelegate(this, 'ids')(this.getModel(), limit, callback);
	},

	persist: function (callback) {
		return getConnectorDelegate(this, 'persist')(this.getModel(), this, callback);
	},

	ttl: function (callback) {
		return getConnectorDelegate(this, 'ttl')(this.getModel(), this, callback);
	}

});

function getConnectorDelegate(ctx, method) {
	return ctx.getConnector().getDelegateMethod(ctx.getModel(), method);
}

module.exports = Ephemeral;
