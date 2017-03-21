// jscs:disable jsDoc
module.exports = function () {
  return function findByID (Model, value, callback) {
    if (!value || typeof value !== 'string') {
      return callback(new Error('Unexpected value for findByID: ' + value))
    }

    var key = this.createEphemeralKey(Model, value)

    this.client.get(key, function (err, result) {
      if (err || !result) {
        return callback(err || new Error('No record found with id ' + value))
      }

      callback(null, this.createInstance(Model, JSON.parse(result)))
    }.bind(this))
  }
}
