module.exports = function () {

    return function create(Model, values, callback) {

        this.getDelegateMethod(Model, 'create')(Model, values, callback);

    };

};