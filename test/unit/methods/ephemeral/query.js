'use strict'

const test = require('tap').test
// const sinon = require('sinon')

// const async = require('async')
// const _ = require('lodash')
// const Arrow = require('arrow')

const server = require('../../../server')
// const method = require('../../../../lib/methods/ephemeral/query')

var arrow
var connector
// var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.redis')
      connector.client = {
        scan: () => { },
        get: () => { }
      }
      // var testModel
      // var testModel = arrow.getModel('testModel')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

// test('### Should returns a records ###', function (t) {
//   // Sinon sandbox
//   const sandbox = sinon.sandbox.create()

//   // Test data
//   const fakeObjects = [0, ['test', '{"id": 1}']]

//   // Mocks
//   const redisClientMock = sandbox.mock(connector.client)
//   redisClientMock.expects('scan').once().withArgs(0, 'MATCH', '*', 'COUNT', 250).yieldsAsync(null, fakeObjects)
//   redisClientMock.expects('get').once().withArgs({ key: 'test', value: { id: 1 } }).yieldsAsync(null, '{"id": 5}')
//   // Stubs
//   const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('*')
//   const _keysStub = sandbox.stub(_, 'keys').callsFake(function (options) { return [] })
//   const collectionStub = sandbox.stub(Arrow, 'Collection').callsFake(function (options) { return [1] })
//   // Spies
//   const doWhilstCbSpy = sandbox.spy()
//   // Stubs
//   const doWhilstSubStub = sandbox.stub().callsFake(() => {
//     process.nextTick(() => {
//       doWhilstCbSpy()
//       doWhilstStub.callArg(1)
//     })
//     process.nextTick(() => {
//       doWhilstCbSpy()
//       doWhilstStub.callArg(2)
//     })
//   })
//   const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSubStub)

//   // Spies
//   const eachSeriesCbSpy = sandbox.spy()
//   // Stubs
//   const eachSeriesSubStub = sandbox.stub().callsFake(() => {
//     process.nextTick(() => {
//       eachSeriesCbSpy()
//       eachSeriesStub.callArg(2)
//     })
//   })
//   const eachSeriesStub = sandbox.stub(async, 'eachSeries').yieldsAsync({
//     key: 'test',
//     value: {
//       id: 1
//     }
//   }, eachSeriesSubStub)

//   const cbSpy = sandbox.stub().callsFake(() => {
//     // Asserts
//     redisClientMock.verify()
//     t.ok(_keysStub.calledTwice)
//     t.ok(createEphemeralKeyStub.calledOnce)
//     t.ok(doWhilstStub.calledOnce)
//     t.ok(collectionStub.calledOnce)
//     t.ok(collectionStub.calledWithNew)
//     t.ok(eachSeriesStub.calledOnce)
//     t.ok(doWhilstCbSpy.calledTwice)
//     t.ok(eachSeriesCbSpy.calledOnce)
//     t.ok(cbSpy.calledOnce)
//     t.ok(cbSpy.calledWith(null, [1]))

//     // Restore
//     sandbox.restore()

//     // End
//     t.end()
//   })

//   // Function call
//   method(Arrow).call(connector, testModel, {}, cbSpy)
// })

// test('### Should returns an error ###', function (t) {
//   // Sinon sandbox
//   const sandbox = sinon.sandbox.create()

//   // Test data
//   const fakeObjects = [0, ['test', '{"id": 1}']]

//    // Returns this error
//   const err = new Error('Fail')

//   // Mocks
//   const redisClientMock = sandbox.mock(connector.client)
//   redisClientMock.expects('scan').once().withArgs(0, 'MATCH', '*', 'COUNT', 250).yieldsAsync(null, fakeObjects)
//   redisClientMock.expects('get').once().withArgs({ key: 'test', value: { id: 1 } }).yieldsAsync(null, '{"id": 5}')
//   // Stubs
//   const createEphemeralKeyStub = sandbox.stub(connector, 'createEphemeralKey').returns('*')
//   const _keysStub = sandbox.stub(_, 'keys').callsFake(function (options) { return [] })
//   // Spies
//   const doWhilstCbSpy = sandbox.spy()
//   // Stubs
//   const doWhilstSubStub = sandbox.stub().callsFake(() => {
//     process.nextTick(() => {
//       doWhilstCbSpy()
//       doWhilstStub.callArg(2, err)
//     })
//   })
//   const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSubStub)

//   // Spies
//   const eachSeriesCbSpy = sandbox.spy()
//   // Stubs
//   const eachSeriesSubStub = sandbox.stub().callsFake(() => {
//     process.nextTick(() => {
//       eachSeriesCbSpy()
//       eachSeriesStub.callArg(2)
//     })
//   })
//   const eachSeriesStub = sandbox.stub(async, 'eachSeries').yieldsAsync({
//     key: 'test',
//     value: {
//       id: 1
//     }
//   }, eachSeriesSubStub)

//   const cbSpy = sandbox.stub().callsFake(() => {
//     // Asserts
//     redisClientMock.verify()
//     t.ok(_keysStub.calledTwice)
//     t.ok(createEphemeralKeyStub.calledOnce)
//     t.ok(doWhilstStub.calledOnce)
//     t.ok(eachSeriesStub.calledOnce)
//     t.ok(doWhilstCbSpy.calledOnce)
//     t.ok(eachSeriesCbSpy.calledOnce)
//     t.ok(cbSpy.calledOnce)
//     t.ok(cbSpy.calledWith(err))

//     // Restore
//     sandbox.restore()

//     // End
//     t.end()
//   })

//   // Function call
//   method(Arrow).call(connector, testModel, {}, cbSpy)
// })

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
