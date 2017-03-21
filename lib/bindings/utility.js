module.exports = function () {
  return {

		/**
		 * Creates an instance from a JSON object pulled from Redis.
		 *
		 * @param Model the model in use
		 * @param result the result of a GET operation
		 */
    createInstance: function (Model, result) {
      var instance = Model.instance(result)
      instance.setPrimaryKey(String(result.id))
      return instance
    },

		/**
		 * Finds a delegate method using the name of the model, or defaults
		 * to the generic method on the connector.
		 *
		 * @param Model the model in use
		 * @param method the method on the connector
		 * @returns {Function}
		 */
    getDelegateMethod: function (Model, method) {
      var name = typeof Model === 'string' ? Model : Model._supermodel
      return (this.delegates[name] && this.delegates[name][method] ||
			this.delegates.base[method]).bind(this)
    }

  }
}
