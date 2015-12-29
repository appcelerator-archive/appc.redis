// jscs:disable jsDoc
module.exports = function () {

	return function findOne(Model, value, callback) {

		this.getDelegateMethod(Model, 'findOne')(Model, value, callback);

	};

};
