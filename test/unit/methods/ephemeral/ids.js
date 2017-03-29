'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const countMethod = require('../../../../lib/methods/ephemeral/ids')()

var arrow
var connector
var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.redis')
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should returns the ids of the records ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const getEphemeralKeysStub = sandbox.stub(connector, 'getEphemeralKeys').yieldsAsync(null, ['1:2'])
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(getEphemeralKeysStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, ['2']))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Returns this error
  const err = new Error('Fail')

  // Stubs
  const getEphemeralKeysStub = sandbox.stub(connector, 'getEphemeralKeys').yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(getEphemeralKeysStub.calledOnce)
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
