var tape = require('tape')
var _test = require('tape-promise').default
var test = _test(tape) // decorate tape

const {connect} = require('../dist')
 
test('can call connect on an invalid url', async function (t) {
  const {call, close} = await connect('')
  t.true(true)
  t.end() // not really necessary
})
