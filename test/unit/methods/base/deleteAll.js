'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/deleteAll')()

var arrow
var connector
var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.redis')
      connector.client = {
        del: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should deletes all records ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Mocks
  const delMock = sandbox.mock(connector.client).expects('del').once().withArgs(testModel.name).yieldsAsync(null)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    delMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Returns this error
  const err = new Error('Fail')

  // Mocks
  const delMock = sandbox.mock(connector.client).expects('del').once().withArgs(testModel.name).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    delMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
