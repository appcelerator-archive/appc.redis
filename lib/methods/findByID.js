// jscs:disable jsDoc
module.exports = function () {

	return function findByID(Model, value, callback) {

		this.getDelegateMethod(Model, 'findByID')(Model, value, callback);

	};

};
