'use strict'

const test = require('tap').test
const sinon = require('sinon')
const mockery = require('mockery')

test('### Init mockery ###', function (t) {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.end()
})

test('### Should connects ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const onceStub = sandbox.stub().yieldsAsync()
  // Mocks
  mockery.registerMock('ioredis', function () {
    return {
      once: onceStub
    }
  })

  // The method
  const connect = require('../../../lib/bindings/lifecycle')().connect

  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  connect.call({
    logger: {
      debug: sandbox.spy(),
      info: sandbox.spy()
    },
    config: {}
  }, cbSpy)

  // Asserts
  setImmediate(() => {
    t.ok(onceStub.calledOnce)
    t.ok(cbSpy.calledOnce)

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should disconnects ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const quitSpy = sandbox.spy()

  // The method
  const disconnect = require('../../../lib/bindings/lifecycle')().disconnect

  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  disconnect.call({
    logger: {
      debug: sandbox.spy()
    },
    client: {
      quit: quitSpy
    }
  }, cbSpy)

  // Asserts
  t.ok(quitSpy.calledOnce)
  t.ok(cbSpy.calledOnce)

  // Restore
  sandbox.restore()

  // End
  t.end()
})

test('### Stop Arrow ###', function (t) {
  mockery.deregisterAll()
  mockery.disable()

  t.end()
})
