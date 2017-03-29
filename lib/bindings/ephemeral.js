module.exports = function () {
  var async = require('async')

  return {
    /**
     * Retrieves the Redis key for the provided model.
     *
     * @param Model the model in use
     * @param key the name of the key
     * @returns {string}
     */
    createEphemeralKey: function (Model, key) {
      return Model.name + '::' + key
    },

    /**
     * Retrieves all stored primary keys mapped for the Model
     * in use.
     *
     * @param Model the model in use
     * @param callback to call on completion
     */
    getEphemeralKeys: function (Model, opts, callback) {
      callback = callback || opts
      opts = typeof opts === 'function' ? {} : opts

      var cache = {}
      var key = this.createEphemeralKey(Model, '*')
      var keyset = []

      var limit = opts.limit !== undefined ? opts.limit : 1000

      var count = opts.count || 50
      var cursor = 0

      async.doWhilst(
        // process phase
        function (next) {
          // scan for the pattern and the count
          this.client.scan(cursor, 'MATCH', key, 'COUNT', count, function (err, response) {
            if (err) {
              return next(err)
            }

            cursor = Number(response[0])

            for (var i = 0, j = response[1].length; i < j; i++) {
              var result = response[1][i]

              if (!cache.hasOwnProperty(result)) {
                keyset.push(result)
                cache[result] = true

                if (limit !== undefined && keyset.length === limit) {
                  break
                }
              }
            }

            next()
          })
        }.bind(this),

        // condition phase
        function () {
          return cursor !== 0 && (limit === undefined || keyset.length !== limit)
        },

        // end phase
        function (err) {
          if (err) {
            return callback(err)
          }
          callback(null, keyset)
        }
      )
    }
  }
}
