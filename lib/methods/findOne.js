module.exports = function () {

    return function findOne(Model, value, callback) {

        if (typeof value === 'string') {

            var key = this.createKey(Model, value);

            this.client.get(key,  function(err, result){

                if(err || !result){
                    return callback(err || new Error('No record found with id ' + value));
                }

                callback(null, this.createInstance(Model, JSON.parse(result)));

            }.bind(this));

        } else if (typeof value === 'object') {

            value.limit = 1;

            this.query(Model, value, function (err, response){
                callback(null, response[0]);
            });

        }

    };

};