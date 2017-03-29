'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/create')()

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
        hset: () => { }
      }
      testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should creates a record ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const setPKSpy = sandbox.spy()
  const cbSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = Object.create({}, {
    setPrimaryKey: {
      enumerable: false,
      value: setPKSpy
    }
  })

  // Stubs
  const instanceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)

  // Mocks
  const redisClientMock = sandbox.mock(connector.client)
  // client.incr mock
  redisClientMock.expects('incr').once().withArgs(testModel.name + '_primary_key').yieldsAsync(null, 100)
  // client.hset mock
  redisClientMock.expects('hset').once().withArgs(testModel.name, '100', JSON.stringify(fakeInst)).yieldsAsync(null)

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    redisClientMock.verify()
    t.ok(instanceStub.calledOnce)
    t.ok(setPKSpy.calledOnce)
    t.ok(setPKSpy.calledWith('100'))
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

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Returns this error
  const err = new Error('Fail')

  // Spies
  const setPKSpy = sandbox.spy()
  const cbSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = Object.create({}, {
    setPrimaryKey: {
      enumerable: false,
      value: setPKSpy
    }
  })

  // Stubs
  const instanceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)

  // Mocks
  const redisClientMock = sandbox.mock(connector.client)
  // client.incr mock
  redisClientMock.expects('incr').once().withArgs(testModel.name + '_primary_key').yieldsAsync(null, 100)
  // client.hset mock
  redisClientMock.expects('hset').once().withArgs(testModel.name, '100', JSON.stringify(fakeInst)).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    redisClientMock.verify()
    t.ok(instanceStub.calledOnce)
    t.ok(setPKSpy.calledOnce)
    t.ok(setPKSpy.calledWith('100'))
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
