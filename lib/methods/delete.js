// jscs:disable jsDoc
module.exports = function () {

	return function deleteOne(Model, instance, callback) {

		this.getDelegateMethod(Model, 'delete')(Model, instance, callback);

	};

};
