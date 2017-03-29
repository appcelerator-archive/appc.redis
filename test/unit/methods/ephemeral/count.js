'use strict'

const test = require('tap').test
const sinon = require('sinon')
const _ = require('lodash')

const server = require('../../../server')
const method = require('../../../../lib/methods/ephemeral/count')()

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

test('### Should returns count ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return false })
  // Mocks
  const getEphemeralKeysMock = sandbox.mock(connector).expects('getEphemeralKeys').once().withArgs(testModel).yieldsAsync(null, [1, 2])
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    getEphemeralKeysMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(null, 2))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns count ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return true })
  // Mocks
  const getEphemeralKeysMock = sandbox.mock(connector).expects('getEphemeralKeys').once().withArgs(testModel).yieldsAsync(null, [1, 2])
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    getEphemeralKeysMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(null, 2))

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

  // Stub
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return false })
  // Mocks
  const getEphemeralKeysMock = sandbox.mock(connector).expects('getEphemeralKeys').once().withArgs(testModel).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    getEphemeralKeysMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(err, null))

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
