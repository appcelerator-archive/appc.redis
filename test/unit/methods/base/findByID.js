'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const countMethod = require('../../../../lib/methods/base/findByID')()

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
        hget: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should finds a record by id ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Fake model's instance
  const fakeInst = { id: 5 }

  // Stubs
  const createInstanceStub = sandbox.stub(connector, 'createInstance').callsFake(() => { return fakeInst })
  // Mocks
  const hgetMock = sandbox.mock(connector.client).expects('hget').once().withArgs(testModel.name, '5').yieldsAsync(null, '{"id": 5}')
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    hgetMock.verify()
    t.ok(createInstanceStub.calledOnce)
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
  const hgetMock = sandbox.mock(connector.client).expects('hget').once().withArgs(testModel.name, '5').yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  countMethod.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    hgetMock.verify()
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
