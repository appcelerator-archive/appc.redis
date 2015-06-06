module.exports = function () {

    return function findAll(Model, callback) {

        this.getDelegateMethod(Model, 'query')(Model, { limit: 1000 }, callback);

    };

};