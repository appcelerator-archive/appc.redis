'use strict'

const test = require('tap').test
const sinon = require('sinon')

const async = require('async')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/ids')()

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
        hscan: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should returns an ids ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Fake model's instance
  const fakeObjects = [0, [1]]

  // Mocks
  const hscanMock = sandbox.mock(connector.client).expects('hscan').once().withArgs(testModel.name, 0).yieldsAsync(null, fakeObjects)
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
  const doWhilstStub = sandbox.stub(async, 'doWhilst').yields(doWhilstSubStub)

  const cbStub = sandbox.stub().callsFake(() => {
    // Asserts
    hscanMock.verify()
    t.ok(doWhilstStub.calledOnce)
    t.ok(doWhilstCbSpy.calledTwice)
    t.ok(cbStub.calledOnce)
    t.ok(cbStub.calledWith(null, [1]))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })

  // Function call
  method.call(connector, testModel, cbStub)
})

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Fake model's instance
  const fakeObjects = [0, [1]]

  // Mocks
  const hscanMock = sandbox.mock(connector.client).expects('hscan').once().withArgs(testModel.name, 0).yieldsAsync(null, fakeObjects)

  // Returns this error
  var err = new Error('Fail')

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
      doWhilstStub.callArg(2, err)
    })
  })
  const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSubStub)

  const cbStub = sandbox.stub().callsFake(() => {
    // Asserts
    hscanMock.verify()
    t.ok(doWhilstStub.calledOnce)
    t.ok(doWhilstCbSpy.calledTwice)
    t.ok(cbStub.calledOnce)
    t.ok(cbStub.calledWith(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })

  // Function call
  method.call(connector, testModel, cbStub)
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
