// jscs:disable jsDoc
module.exports = function () {

	return function ids(Model, total, callback) {

		this.getDelegateMethod(Model, 'ids')(Model, total, callback || function () {});

	};

};
