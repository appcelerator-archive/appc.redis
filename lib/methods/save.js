// jscs:disable jsDoc
module.exports = function () {
  return function save (Model, instance, callback) {
    this.getDelegateMethod(Model, 'save')(Model, instance, callback)
  }
}
