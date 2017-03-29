// jscs:disable jsDoc
module.exports = function () {
  return function deleteAll (Model, callback) {
    this.getEphemeralKeys(Model, {
      limit: false
    }, function (err, keys) {
      if (!err && keys.length > 0) {
        this.client.del(keys, callback)
      } else {
        callback(err, 0)
      }
    }.bind(this))
  }
}
