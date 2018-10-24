const test = require('tap').test
const sinon = require('sinon')
const _ = require('lodash')
const server = require('../../server')
const countMethod = require('../../../lib/methods/count')()
var ARROW
var CONNECTOR

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      ARROW = inst
      CONNECTOR = ARROW.getConnector('appc.redis')

      t.ok(ARROW, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Count with three parameters ###', function (t) {
  // Data
  var sandbox = sinon.sandbox.create()
  const Model = ARROW.getModel('testModel')

  // Stubs & spies
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(function (options) { return false })

  const getDelegateMethodStub = sandbox.stub(CONNECTOR,
    'getDelegateMethod').callsFake(function (Model, method) {
    return function (Model, cbSpy) {
      setImmediate(function () {
        cbSpy()
      })
    }
  })

  function cb (errParameter, instance) { }
  const cbSpy = sandbox.spy(cb)

  // Execution
  countMethod.bind(CONNECTOR, Model, {}, cbSpy)()

  setImmediate(function () {
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(getDelegateMethodStub.calledOnce)
    sandbox.restore()
    t.end()
  })
})

test('### Count with two parameters ###', function (t) {
  // Data
  var sandbox = sinon.sandbox.create()
  const Model = ARROW.getModel('testModel')

  // Stubs & spies
  const _isFunctionStub = sandbox.stub(_, 'isFunction').callsFake(function (options) { return true })
  function cb (errParameter, instance) { }
  const cbSpy = sandbox.spy(cb)
  const getDelegateMethodStub = sandbox.stub(CONNECTOR,
    'getDelegateMethod').callsFake(function (Model, method) {
    return function (Model, cbSpy) {
      setImmediate(function () {
        cbSpy()
      })
    }
  })

  // Execution
  countMethod.bind(CONNECTOR, Model, cbSpy)()

  setImmediate(function () {
    t.ok(cbSpy.calledOnce)
    t.ok(_isFunctionStub.calledOnce)
    t.ok(getDelegateMethodStub.calledOnce)
    sandbox.restore()
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  ARROW.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
