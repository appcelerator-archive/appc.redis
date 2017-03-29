// jscs:disable jsDoc
var _ = require('lodash')

module.exports = function () {
  return function count (Model, options, callback) {
    if (_.isFunction(options)) {
      callback = options
      options = {}
    }

    this.client.hlen(Model.name, function (err, count) {
      callback(err, !err ? count : null)
    })
  }
}
