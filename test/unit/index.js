'use strict'

const test = require('tap').test
const sinon = require('sinon')
const mockery = require('mockery')

const _ = require('lodash')
const Arrow = require('arrow')

test('### Init mockery ###', function (t) {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./bindings/config', () => { })
  mockery.registerMock('./bindings/lifecycle', () => { })
  mockery.registerMock('./bindings/metadata', () => { })
  mockery.registerMock('./methods/count', () => { })
  mockery.registerMock('./methods/create', () => { })
  mockery.registerMock('./methods/findAll', () => { })
  mockery.registerMock('./methods/findByID', () => { })
  mockery.registerMock('./methods/query', () => { })
  mockery.registerMock('./methods/ids', () => { })
  mockery.registerMock('./methods/save', () => { })
  mockery.registerMock('./methods/delete', () => { })
  mockery.registerMock('./methods/deleteAll', () => { })
  mockery.registerMock('./methods/base/count', () => { })
  mockery.registerMock('./methods/base/create', () => { })
  mockery.registerMock('./methods/base/findByID', () => { })
  mockery.registerMock('./methods/base/query', () => { })
  mockery.registerMock('./methods/base/ids', () => { })
  mockery.registerMock('./methods/base/save', () => { })
  mockery.registerMock('./methods/base/delete', () => { })
  mockery.registerMock('./methods/base/deleteAll', () => { })
  mockery.registerMock('./methods/ephemeral/count', () => { })
  mockery.registerMock('./methods/ephemeral/create', () => { })
  mockery.registerMock('./methods/ephemeral/findByID', () => { })
  mockery.registerMock('./methods/ephemeral/query', () => { })
  mockery.registerMock('./methods/ephemeral/ids', () => { })
  mockery.registerMock('./methods/ephemeral/save', () => { })
  mockery.registerMock('./methods/ephemeral/delete', () => { })
  mockery.registerMock('./methods/ephemeral/deleteAll', () => { })
  mockery.registerMock('./methods/ephemeral/expire', () => { })
  mockery.registerMock('./methods/ephemeral/expireAt', () => { })
  mockery.registerMock('./methods/ephemeral/persist', () => { })
  mockery.registerMock('./methods/ephemeral/ttl', () => { })
  mockery.registerMock('./bindings/ephemeral', () => { })
  mockery.registerMock('./bindings/utility', () => { })

  t.end()
})

test('### Should creates connector ###', function (t) {
  // The method
  const connectorCreate = require('../../lib').create

  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const connectorExtendStub = sandbox.stub(Arrow.Connector, 'extend')
  const defaultsStub = sandbox.stub(_, 'defaults')
  const pickStub = sandbox.stub(_, 'pick')

  // Function call
  connectorCreate(Arrow, {})

  // Asserts
  t.ok(connectorExtendStub.calledOnce)
  t.ok(defaultsStub.calledOnce)
  t.ok(pickStub.calledOnce)

  // Restore
  sandbox.restore()

  // End
  t.end()
})

test('### Disable Mockery ###', function (t) {
  mockery.deregisterAll()
  mockery.disable()

  t.end()
})
