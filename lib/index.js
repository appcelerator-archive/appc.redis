// jscs:disable jsDoc

exports.create = function (Arrow, server) {

	var _ = require('lodash'),
		pkginfo = require('pkginfo')(module) && module.exports;

	return Arrow.Connector.extend(_.defaults(
		_.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),

		require('./bindings/config')(Arrow, server),

		require('./bindings/lifecycle')(Arrow, server),

		require('./bindings/metadata')(Arrow, server),

		{
			count: require('./methods/count')(Arrow, server),
			create: require('./methods/create')(Arrow, server),
			findAll: require('./methods/findAll')(Arrow, server),
			findByID: require('./methods/findByID')(Arrow, server),
			query: require('./methods/query')(Arrow, server),
			ids: require('./methods/ids')(Arrow, server),
			save: require('./methods/save')(Arrow, server),
			delete: require('./methods/delete')(Arrow, server),
			deleteAll: require('./methods/deleteAll')(Arrow, server)
		},

		{
			delegates: {

				base: {
					count: require('./methods/base/count')(Arrow, server),
					create: require('./methods/base/create')(Arrow, server),
					findByID: require('./methods/base/findByID')(Arrow, server),
					query: require('./methods/base/query')(Arrow, server),
					ids: require('./methods/base/ids')(Arrow, server),
					save: require('./methods/base/save')(Arrow, server),
					delete: require('./methods/base/delete')(Arrow, server),
					deleteAll: require('./methods/base/deleteAll')(Arrow, server)
				},

				ephemeral: {
					count: require('./methods/ephemeral/count')(Arrow, server),
					create: require('./methods/ephemeral/create')(Arrow, server),
					findByID: require('./methods/ephemeral/findByID')(Arrow, server),
					query: require('./methods/ephemeral/query')(Arrow, server),
					ids: require('./methods/ephemeral/ids')(Arrow, server),
					save: require('./methods/ephemeral/save')(Arrow, server),
					delete: require('./methods/ephemeral/delete')(Arrow, server),
					deleteAll: require('./methods/ephemeral/deleteAll')(Arrow, server),
					expire: require('./methods/ephemeral/expire')(Arrow, server),
					expireAt: require('./methods/ephemeral/expireAt')(Arrow, server),
					persist: require('./methods/ephemeral/persist')(Arrow, server),
					ttl: require('./methods/ephemeral/ttl')(Arrow, server)
				}

			}
		},

		require('./bindings/ephemeral')(Arrow, server),

		require('./bindings/utility')(Arrow, server)
	));

};
