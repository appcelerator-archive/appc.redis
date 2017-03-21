// jscs:disable jsDoc
module.exports = function () {
  return function expireAt (Model, instance, date, callback) {
    var key = this.createEphemeralKey(Model, instance.getPrimaryKey())

    this.client.expire(key, new Date(date).getTime(), function (err, reply) {
      (callback || function () {})(err, reply === 1)
    })
  }
}
