// jscs:disable jsDoc
module.exports = function () {
  return function ttl (Model, instance, callback) {
    this.client.ttl(this.createEphemeralKey(Model, instance.getPrimaryKey()), callback || function () {})
  }
}
