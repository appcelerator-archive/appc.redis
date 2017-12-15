'use strict'

const test = require('tap').test
const sinon = require('sinon')

const async = require('async')
const _ = require('lodash')
const Arrow = require('arrow')

const server = require('../../../server')
const method = require('../../../../lib/methods/base/query')

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

// test('### Should returns a records ###', function (t) {
//   // Sinon sandbox
//   const sandbox = sinon.sandbox.create()

//   // Fake model's instance
//   const fakeObjects = [0, ['test', '{"id": 1}']]

//   // Mocks
//   const hscanMock = sandbox.mock(connector.client).expects('hscan').once().withArgs(testModel.name, 0, 'MATCH', '*', 'COUNT', 250).yieldsAsync(null, fakeObjects)
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
//   const eachSeriesSpy = sandbox.stub().callsFake(() => {
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
//   }, eachSeriesSpy)

//   // Stubs
//   const _keysStub = sandbox.stub(_, 'keys').callsFake(function (options) { return [] })
//   const collectionStub = sandbox.stub(Arrow, 'Collection').callsFake(function (options) { return [1] })

//   const cbSpy = sandbox.stub().callsFake(() => {
//     // Asserts
//     hscanMock.verify()
//     t.ok(_keysStub.calledTwice)
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

test('### Should returns an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Returns this error
  const err = new Error('Fail')

  // Mocks
  const hscanMock = sandbox.mock(connector.client).expects('hscan').once().withArgs(testModel.name, 0, 'MATCH', '*', 'COUNT', 250).yieldsAsync(err)
  // Spies
  const doWhilstCbSpy = sandbox.spy()
  // Stubs
  const doWhilstSpy = sandbox.stub().callsFake(() => {
    process.nextTick(() => {
      doWhilstCbSpy()
      doWhilstStub.callArg(2, err)
    })
  })
  const doWhilstStub = sandbox.stub(async, 'doWhilst').yieldsAsync(doWhilstSpy)
  const _keysStub = sandbox.stub(_, 'keys').callsFake(function (options) { return [] })

  const cbSpy = sandbox.stub().callsFake(() => {
    // Asserts
    hscanMock.verify()
    t.ok(_keysStub.calledOnce)
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
  method(Arrow).call(connector, testModel, {}, cbSpy)
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
