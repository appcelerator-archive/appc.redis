const test = require('tap').test
const server = require('../server')
var ARROW

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      ARROW = inst
      t.ok(ARROW, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Test Model Post ###', function (t) {
  const Model = ARROW.getModel('testModel')

  t.equal(typeof Model, 'object')
  t.equal(Model.fields.fname.type, 'string', 'fname should be string')
  t.equal(Model.fields.lname.type, 'string', 'lname should be string')
  t.equal(Model.fields.age.type, 'number', 'age should be number')

  t.end()
})

test('### Stop Arrow ###', function (t) {
  ARROW.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
