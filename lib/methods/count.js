module.exports = function () {

    return function count(Model, callback) {

        this.getDelegateMethod(Model, 'count')(Model, callback);

    };

};