// jscs:disable jsDoc
module.exports = function () {
  return function deleteOne (Model, instance, callback) {
    this.client.hdel(Model.name, instance.getPrimaryKey(), function (err) {
      callback(err, (!err && instance) || null)
    })
  }
}
