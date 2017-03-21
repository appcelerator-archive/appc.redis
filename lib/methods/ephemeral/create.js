// jscs:disable jsDoc
module.exports = function () {
  return function create (Model, values, callback) {
    this.client.incr(Model.name + '_primary_key', function (err, key) {
      if (err) {
        return callback(err)
      }

      var sKey = String(key)
      var input = this.createEphemeralKey(Model, sKey)
      var instance = Model.instance(values)

      instance.setPrimaryKey(sKey)

      this.client.set(input, JSON.stringify(instance), function (err) {
        callback(err, !err && instance || null)
      })
    }.bind(this))
  }
}
