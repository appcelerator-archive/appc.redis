module.exports = function (Arrow) {

    var _ = require('lodash');

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

        var cache = {};
        var key = this.createKey(Model, '*');

        var limit;

        if(options.limit !== undefined){
            limit = options.limit;
        }

        var results = [];
        var _this = this;

        this.client.scan({
            count: options.count || 50,
            pattern: key,

            onData: function(result, done){
                if(cache.hasOwnProperty(result)){
                    return done();
                }

                cache[result] = true;

                _this.client.get(result, function(err, value){

                    if(err){
                        return done(err);
                    }

                    var found = 0;
                    var object = JSON.parse(value);

                    for (var c = 0; c < propKeys.length; c++) {
                        var propKey = propKeys[c];
                        if (propKey in object && object[propKey] === properties[propKey]) {
                            found++;
                            break;
                        }
                    }

                    if(found === propKeys.length){
                        if(selection){
                            results.push(
                                _this.createInstance(Model, _.pick.bind(null, object).apply(null, selection))
                            );
                        } else {
                            results.push(
                                _this.createInstance(Model, object)
                            );
                        }

                        if(limit && results.length === limit){
                            this.end();
                        }
                    }

                    done();

                }.bind(this));
            },

            onEnd: function(err){
                if(err){
                    return callback(err);
                }
                callback(null, new Arrow.Collection(Model, results));
            }.bind(this)

        });
    };

};