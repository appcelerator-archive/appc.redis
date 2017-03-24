'use strict'

const test = require('tap').test
const sinon = require('sinon')
const _ = require('lodash')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/count')()

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
        hlen: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should returns a count ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return false })
  // Mocks
  const hlenMock = sandbox.mock(connector.client).expects('hlen').once().withArgs(testModel.name).yieldsAsync(null, 3)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    hlenMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(null, 3))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns a count ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return true })
  // Mocks
  const hlenMock = sandbox.mock(connector.client).expects('hlen').once().withArgs(testModel.name).yieldsAsync(null, 3)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    hlenMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(null, 3))

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

  // Stubs
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(() => { return true })
  // Mocks
  const hlenMock = sandbox.mock(connector.client).expects('hlen').once().withArgs(testModel.name).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    hlenMock.verify()
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
