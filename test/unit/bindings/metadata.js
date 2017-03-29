'use strict'

const test = require('tap').test
const sinon = require('sinon')

test('### Should fetch metadata ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // The method
  const fetchMetadata = require('../../../lib/bindings/metadata')().fetchMetadata

  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  fetchMetadata(cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, {}))

  // Restore
  sandbox.restore()

  // End
  t.end()
})
