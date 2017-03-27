'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const method = require('../../../../lib/methods/ephemeral/create')()

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
        incr: () => { },
        set: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should create record ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const setPKSpy = sandbox.spy()

  // Model's fake instance
  const fakeInst = Object.create({}, {
    setPrimaryKey: {
      enumerable: false,
      value: setPKSpy
    }
  })

  // Stubs
  const insatnceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')
  // Mocks
  const redisClientMock = sandbox.mock(connector.client)
  redisClientMock.expects('incr').once().withArgs(testModel.name + '_primary_key').yieldsAsync(null, 100)
  redisClientMock.expects('set').once().withArgs('1', JSON.stringify(fakeInst)).yieldsAsync(null)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    redisClientMock.verify()
    t.ok(insatnceStub.calledOnce)
    t.ok(setPKSpy.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(setPKSpy.calledWith('100'))
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, fakeInst))

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

  // Mocks
  const incrMock = sandbox.mock(connector.client).expects('incr').once().withArgs(testModel.name + '_primary_key').yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    incrMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should returns error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const setPKSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = Object.create({}, {
    setPrimaryKey: {
      enumerable: false,
      value: setPKSpy
    }
  })

  // Returns this error
  const err = new Error('Fail')

  // Stubs
  const insatnceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)
  const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('1')
  // Mocks
  const redisClientMock = sandbox.mock(connector.client)
  redisClientMock.expects('incr').once().withArgs(testModel.name + '_primary_key').yieldsAsync(null, 100)
  redisClientMock.expects('set').once().withArgs('1', JSON.stringify(fakeInst)).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    redisClientMock.verify()
    t.ok(insatnceStub.calledOnce)
    t.ok(setPKSpy.calledOnce)
    t.ok(createEphemeralKeyStub.calledOnce)
    t.ok(setPKSpy.calledWith('100'))
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
