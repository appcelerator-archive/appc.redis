'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const method = require('../../../../lib/methods/ephemeral/expireAt')()

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
        expire: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should expires a record ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stub
  const getPKStub = sandbox.stub().callsFake(() => 5)
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')

  // Fake model's instance
  const fakeInst = Object.create({}, {
    getPrimaryKey: {
      enumerable: false,
      value: getPKStub
    }
  })

  // Mocks
  const expireMock = sandbox.mock(connector.client).expects('expire').once().withArgs('1').yieldsAsync(null, 1)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, fakeInst, new Date(), cbSpy)

  setImmediate(function () {
    // Asserts
    expireMock.verify()
    t.ok(getPKStub.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, true))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const getPKStub = sandbox.stub().callsFake(() => 5)
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')

  // Fake model's instance
  const fakeInst = Object.create({}, {
    getPrimaryKey: {
      enumerable: false,
      value: getPKStub
    }
  })

  // Returns this error
  const err = new Error('Fail')

  // Mocks
  const expireMock = sandbox.mock(connector.client).expects('expire').once().withArgs('1').yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, fakeInst, new Date(), cbSpy)

  setImmediate(function () {
    // Asserts
    expireMock.verify()
    t.ok(getPKStub.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
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
