// jscs:disable jsDoc
module.exports = function () {
  return function save (Model, instance, callback) {
    this.client.hset(Model.name, instance.getPrimaryKey(), JSON.stringify(instance), function (err) {
      callback(err, (!err && instance) || null)
    })
  }
}
