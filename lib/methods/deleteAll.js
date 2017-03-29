// jscs:disable jsDoc
module.exports = function () {
  return function deleteAll (Model, callback) {
    this.getDelegateMethod(Model, 'deleteAll')(Model, callback)
  }
}
