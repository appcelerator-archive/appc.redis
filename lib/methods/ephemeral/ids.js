module.exports = function () {

    return function ids(Model, total, callback) {

        if(typeof total === 'function'){
            callback = total;
            total = 1000;
        }

        if(!callback){
            callback = function (){};
        }

        this.getEphemeralKeys(Model, {
            limit: total
        }, function(err, keys){

            callback(err, err ? null : keys && keys.length ? keys.map(function(k){
                return k.slice(k.lastIndexOf(':') + 1);
            }) : []);

        });

    };

};