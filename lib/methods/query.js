module.exports = function (Arrow) {

    var _ = require('lodash'),
        async = require('async');

    return function query(Model, options, callback) {
        var properties = options.where,
            propKeys = _.keys(properties);

        if ((options.page && options.page !== 1) ||
            (options.skip && options.skip !== 0) ||
            (options.per_page && options.per_page !== 10 && !options.limit) || options.order){
            this.logger.warn('page, per_page, skip, and order have not been implemented by this connector!');
        }

        var selection;

        if (options.sel) {
            selection = _.keys(options.sel);
        }

        if (options.unsel) {
            var ignoredKeys = _.keys(options.unsel);
            selection = Object.keys(Model.fields).filter(function(key) {
                return ignoredKeys.indexOf(key) === -1;
            });
        }

        this.getStoredKeys(Model, function(err, keys){

            if(err){
                return callback(err);
            }


            if(options.limit && options.limit < keys.length){
                keys.length = options.limit;
            }

            async.map(keys, function(key, next){

                this.client.get(key, function(err, value){

                    var found = 0;
                    var object;

                    if(!err) {
                        object = JSON.parse(value);

                        for (var c = 0; c < propKeys.length; c++) {
                            var propKey = propKeys[c];
                            if (propKey in object && object[propKey] === properties[propKey]) {
                                found++;
                                break;
                            }
                        }
                    }

                    if(found === propKeys.length && selection){
                        object = _.pick.bind(null, object).apply(this, selection);
                    }

                    next(err, found === propKeys.length ? object : null);

                });

            }.bind(this), function(err, results){
                if(err){
                    return callback(err);
                }

                var filteredResults = results.filter(function(result){
                    return result !== null;
                }).map(function(result){
                    return this.createInstance(Model, result);
                }.bind(this));

                callback(null, new Arrow.Collection(Model, filteredResults));
            }.bind(this));

        }.bind(this));
    };
};