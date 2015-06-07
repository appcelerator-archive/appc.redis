module.exports = function () {

    return {

        /**
         * Creates an instance from a JSON object pulled from Redis.
         *
         * @param Model the model in use
         * @param result the result of a GET operation
         */
        createInstance: function (Model, result) {
            var instance = Model.instance(result);
            instance.setPrimaryKey(String(result.id));
            return instance;
        },

        getDelegateMethod: function (Model, method) {
            var name = typeof Model === 'string' ? Model : Model._supermodel;
            return (this['delegates'] && this['delegates'][name] &&
                    this['delegates'][name][method] || this[method]).bind(this);
        }

    };

};