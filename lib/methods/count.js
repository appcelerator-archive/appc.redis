// jscs:disable jsDoc
var _ = require('lodash')

module.exports = function () {
  return function count (Model, options, callback) {
    if (_.isFunction(options)) {
      callback = options
      options = {}
    }
    this.getDelegateMethod(Model, 'count')(Model, callback)
  }
}
