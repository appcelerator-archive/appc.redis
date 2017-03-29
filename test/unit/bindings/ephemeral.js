'use strict'

const test = require('tap').test
const sinon = require('sinon')
const async = require('async')

const server = require('../../server')
const ephemeral = require('../../../lib/bindings/ephemeral.js')()

var arrow
var connector
var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      connector = arrow.getConnector('appc.redis')
      connector.client = {
        scan: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Should creates ephemeral key ###', function (t) {
  // Function call
  const result = ephemeral.createEphemeralKey(testModel, 'test')

  // Asserts
  t.ok(result)
  t.equal(result, 'testModel::test')

  // End
  t.end()
})

test('### Should returns ephemeral keys ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Test data
  const fakeObjects = [0, ['test', '{"id": 1}']]

  // Mocks
  const scanMock = sandbox.mock(connector.client).expects('scan').once().withArgs(0, 'MATCH', '*', 'COUNT', 50).yieldsAsync(null, fakeObjects)
  // Stubs
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('*')
  // Spies
  const doWhilstCbSpy = sandbox.spy()
  // Stubs
  const doWhilstSubStub = sandbox.stub().callsFake(() => {
    process.nextTick(() => {
      doWhilstCbSpy()
      doWhilstStub.callArg(1)
    })
    process.nextTick(() => {
      doWhilstCbSpy()
      doWhilstStub.callArg(2)
    })
  })
  const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSubStub)

  const cbSpy = sandbox.stub().callsFake(() => {
    // Asserts
    scanMock.verify()
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(doWhilstStub.calledOnce)
    t.ok(doWhilstCbSpy.calledTwice)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, ['test', '{"id": 1}']))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })

  // Function call
  ephemeral.getEphemeralKeys.call(connector, testModel, {}, cbSpy)
})

test('### Should returns error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Returns this error
  const err = new Error('Fail')

  // Mocks
  const scanMock = sandbox.mock(connector.client).expects('scan').once().withArgs(0, 'MATCH', '*', 'COUNT', 50).yieldsAsync(err)
  // Stubs
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('*')
  // Spies
  const doWhilstCbSpy = sandbox.spy()
  // Stubs
  const doWhilstSubStub = sandbox.stub().callsFake((err) => {
    process.nextTick(() => {
      doWhilstCbSpy()
      doWhilstStub.callArg(2, err)
    })
  })
  const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSubStub)

  const cbSpy = sandbox.stub().callsFake(() => {
    // Asserts
    scanMock.verify()
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(doWhilstStub.calledOnce)
    t.ok(doWhilstCbSpy.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })

  // Function call
  ephemeral.getEphemeralKeys.call(connector, testModel, {}, cbSpy)
})
