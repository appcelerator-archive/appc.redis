'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/save')()

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
        hset: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should saves a record ###', function (t) {
  const sandbox = sinon.sandbox.create()

  // Stubs
  const getPKStub = sandbox.stub().callsFake(() => 5)

  // Fake model's instance
  const fakeInst = Object.create({
    id: 5
  }, {
    getPrimaryKey: {
      enumerable: false,
      value: getPKStub
    }
  })

  // Mocks
  const hsetMock = sandbox.mock(connector.client).expects('hset').once().withArgs(testModel.name, 5, JSON.stringify(fakeInst)).yieldsAsync(null)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, fakeInst, cbSpy)

  setImmediate(function () {
    // Asserts
    hsetMock.verify()
    t.ok(getPKStub.calledOnce)
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

  // Stubs
  const getPKStub = sandbox.stub().callsFake(() => 5)

  // Fake model's instance
  const fakeInst = Object.create({
    id: 5
  }, {
    getPrimaryKey: {
      enumerable: false,
      value: getPKStub
    }
  })

  // Returns this error
  const err = new Error('Fail')

  // Mocks
  const hsetMock = sandbox.mock(connector.client).expects('hset').once().withArgs(testModel.name, 5, JSON.stringify(fakeInst)).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, fakeInst, cbSpy)

  setImmediate(function () {
    // Asserts
    hsetMock.verify()
    t.ok(getPKStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(err, null))

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
