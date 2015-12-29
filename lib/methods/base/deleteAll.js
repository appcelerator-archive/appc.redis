// jscs:disable jsDoc
module.exports = function () {

	return function deleteAll(Model, callback) {

		this.client.del(Model.name, callback);

	};

};
