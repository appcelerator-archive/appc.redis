var _ = require('lodash'),
    path = require('path'),
    pkginfo = require('pkginfo')(module) && module.exports;

module.exports = function (Arrow, server) {

    return {

        /**
         * The metadata of the connector plucked from the package.json
         */
        pkginfo: _.pick(pkginfo, 'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'),

        /**
         * The logger of the connector.
         */
        logger: server && server.logger || Arrow.createLogger({}, { name: pkginfo.name }),

        /**
         * Any models in use.
         */
        models: Arrow.loadModelsForConnector(pkginfo.name, module, path.join(path.dirname(module.filename), '..', '..', 'models'))

    };

};