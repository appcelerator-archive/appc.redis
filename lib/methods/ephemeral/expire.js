// jscs:disable jsDoc
module.exports = function () {
  return function expire (Model, instance, seconds, callback) {
    var key = this.createEphemeralKey(Model, instance.getPrimaryKey())

    this.client.expire(key, seconds, function (err, reply) {
      (callback || function () {})(err, reply === 1)
    })
  }
}
