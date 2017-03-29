'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const countMethod = require('../../../../lib/methods/ephemeral/findByID')()

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
        get: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should finds a record by id ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Fake models instance
  const fakeInst = { id: 5 }

  // Stubs
  const createInstanceStub = sandbox.stub(connector, 'createInstance').callsFake(() => { return fakeInst })
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')
  // Mocks
  const getMock = sandbox.mock(connector.client).expects('get').once().withArgs('1').yieldsAsync(null, '{"id": 5}')
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    getMock.verify()
    t.ok(createInstanceStub.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, fakeInst))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, 5, cbSpy)

  setImmediate(function () {
    // Asserts
    t.ok(cbSpy.calledOnce)

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
  const getMock = sandbox.mock(connector.client).expects('get').once().withArgs('1').yieldsAsync(err)
  // Stubs
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    getMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
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
