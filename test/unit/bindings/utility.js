'use strict'

const test = require('tap').test
const sinon = require('sinon')

const utility = require('../../../lib/bindings/utility')()

test('### Should creates instance ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Fake model
  const Model = {
    instance: () => { }
  }

  // Spies
  const setPrimaryKeySpy = sandbox.spy()

  // Mocks
  const instanceMock = sandbox.mock(Model).expects('instance').once().withArgs({ id: 5 }).returns({
    setPrimaryKey: setPrimaryKeySpy
  })

  // Function call
  var result = utility.createInstance(Model, { id: 5 })

  // Asserts
  instanceMock.verify()
  t.ok(result)
  t.ok(setPrimaryKeySpy.calledWith('5'))

  // Restore
  sandbox.restore()

  // End
  t.end()
})

test('### Should returns delegate method ###', function (t) {
  // Test data
  const fn = () => {}

  // Function call
  var result = utility.getDelegateMethod.call({
    delegates: {
      testModel: {
        findByID: fn
      }
    }
  }, 'testModel', 'findByID')

  // Asserts
  t.ok(result)

  // End
  t.end()
})
