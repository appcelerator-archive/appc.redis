'use strict'

const test = require('tap').test
// const sinon = require('sinon')

const server = require('../server')

var arrow

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Test Model Post ###', function (t) {
  const Model = arrow.getModel('testModel')

  t.equal(typeof Model, 'object')
  t.equal(Model.fields.fname.type, 'string', 'fname should be string')
  t.equal(Model.fields.lname.type, 'string', 'lname should be string')
  t.equal(Model.fields.age.type, 'number', 'age should be number')

  t.end()
})

// test('### Test Model base ###', function (t) {
//   // Sinn sandbox
//   const sandbox = sinon.sandbox.create()

//   // Spies
//   const connectorIdsSpy = sandbox.spy()
//   const getModelSpy = sandbox.spy()

//   const baseModel = arrow.getModel('base')

//   baseModel.ids.call({
//     getConnector: () => {
//       return {
//         ids: connectorIdsSpy
//       }
//     },
//     getModel: getModelSpy
//   })

//   // Asserts
//   t.type(baseModel, 'object')
//   t.type(baseModel.ids, 'function')
//   t.ok(connectorIdsSpy.calledOnce)
//   t.ok(getModelSpy.calledOnce)

//   // Restore
//   sandbox.restore()

//   // End
//   t.end()
// })

// test('### Test Model ephemeral ###', function (t) {
//   // Sinn sandbox
//   const sandbox = sinon.sandbox.create()

//   // Spies
//   const getModelSpy = sandbox.spy()
//   const delegateMethodSpy = sandbox.spy()

//   // Stubs
//   const getDelegateMethodStub = sandbox.stub().returns(delegateMethodSpy)

//   const ephemeralModel = arrow.getModel('ephemeral')

//   // Test data
//   const ctx = {
//     getConnector: () => {
//       return {
//         getDelegateMethod: getDelegateMethodStub
//       }
//     },
//     getModel: getModelSpy
//   }

//   ephemeralModel.expire.call(ctx)
//   ephemeralModel.expireAt.call(ctx)
//   ephemeralModel.ids.call(ctx)
//   ephemeralModel.persist.call(ctx)
//   ephemeralModel.ttl.call(ctx)

//   // Asserts
//   t.type(ephemeralModel, 'object')
//   t.type(ephemeralModel.expire, 'function')
//   t.type(ephemeralModel.expireAt, 'function')
//   t.type(ephemeralModel.ids, 'function')
//   t.type(ephemeralModel.persist, 'function')
//   t.type(ephemeralModel.ttl, 'function')
//   t.equal(getDelegateMethodStub.callCount, 5)
//   t.equal(getModelSpy.callCount, 10)

//   // Restore
//   sandbox.restore()

//   // End
//   t.end()
// })

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
