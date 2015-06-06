module.exports = function () {

    return function query(Model, options, callback) {

        this.getDelegateMethod(Model, 'query')(Model, options, callback);

    };

};