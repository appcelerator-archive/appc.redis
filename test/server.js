'use strict'
const Arrow = require('arrow')

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    const arrow = new Arrow({}, true)
    const connector = arrow.getConnector('appc.redis')
    connector.metadata = {}

    if (options.generateTestModels !== false) {
      // Create test model - testModel
      arrow.addModel(Arrow.createModel('testModel', {
        name: 'testModel',
        connector,
        fields: {
          fname: {
            type: 'string',
            required: false
          },
          lname: {
            type: 'string',
            required: false
          },
          age: {
            type: 'number',
            required: false
          }
        },
        metadata: {
          primarykey: 'id'
        }
      }))
    }

    // Return the arrow instance
    resolve(arrow)
  })
}
