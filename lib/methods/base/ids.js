module.exports = function () {

    var async = require('async');

    return function ids(Model, total, callback) {

        if(typeof total === 'function'){
            callback = total;
            total = 1000;
        }

        var cursor = 0;
        var results = [];

        async.doWhilst(
            // process phase
            function (next) {
                // scan for the pattern and the count
                this.client.hscan(Model.name, cursor, function(err, response){
                    if(err){
                        return next(err);
                    }

                    cursor = Number(response[0]);

                    for(var i = 0, j = response[1].length; i < j; i += 2){
                        results.push(response[1][i]);

                        if(total && results.length === total){
                            break;
                        }
                    }

                    next();

                }.bind(this));

            }.bind(this),

            // condition phase
            function () {
                return cursor !== 0 && (!total || results.length !== total);
            },

            // end phase
            function(err){
                if(err){
                    return callback(err);
                }
                callback(null, results);
            }
        );

    };

};