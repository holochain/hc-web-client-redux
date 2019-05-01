var rpcws = require('rpc-websockets')
var chai = require("chai")
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require("sinon-chai")
chai.use(sinonChai)
var fetchMock = require('fetch-mock')


const { connect } = require('../lib/index')

const callMock = sinon.fake()

describe('hc-web-client connect', () => {

  beforeEach(() => {
    sinon.stub(rpcws, 'Client').returns(
      {
        on: sinon.fake((on, callback) => {
          return callback()
        }),
        call: sinon.fake((method, params) => {
          callMock(method, params)
        }),
      }
    )
  })

  afterEach(() => {
    rpcws.Client.restore()
    fetchMock.reset()
  });

  it('Can connect by passing URL', async () => {
    const testUrl = 'ws://localhost:3000'
    await connect(testUrl)
    expect(rpcws.Client).to.have.been.calledWith(testUrl)
  })

  it('Can connect by passing no params and retriving port from endpoint', async () => {
    const testPort = 1234
    fetchMock.getOnce('*', 
      JSON.stringify({ 'dna_interface': { 'id': 'websocket interface','driver': { 'type': 'websocket','port': testPort },'admin': true,'instances': [] } })
    )
    await connect()
    expect(rpcws.Client).to.have.been.calledWith(`ws://localhost:${testPort}`)
  })

  it('Can can gracefully handle errors when trying to connect', async () => {
    fetchMock.getOnce('*', JSON.stringify({ }))
    try {
      await connect()
    } catch (e) {
      expect(e).to.equal(`Could not auto-detect DNA interface from conductor. Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect`)
    }
  })

})

describe('hc-web-client call', () => {

  beforeEach(() => {
    sinon.stub(rpcws, 'Client').returns(
      {
        on: sinon.fake((on, callback) => {
          return callback()
        }),
        call: sinon.fake((method, params) => {
          callMock(method, params)
        }),
      }
    )
  })

  afterEach(() => {
    rpcws.Client.restore();
  });

  it('produces the expected call object when called with three params', async () => {
    const testUrl = 'ws://localhost:3000'
    const { callZome } = await connect(testUrl)
    await callZome('instance', 'zome', 'func')({param1: 'x'})
    expect(callMock).to.have.been.calledWith('call', {
      'instance_id': 'instance',
      'zome': 'zome',
      'function': 'func',
      'params': {param1: 'x'}
    })
  })

})

describe('hc-web-client onSignal', () => {

  beforeEach(() => {
    sinon.stub(rpcws, 'Client').returns(
      {
        on: sinon.fake((on, callback) => {
          if (on === 'message') {
            return callback({signal: {
              signal_data: 'test signal data'
            }})
          } else {
            return callback()
          }
        }),
        call: sinon.fake((method, params) => {
          callMock(method, params)
        }),
      }
    )
  })

  afterEach(() => {
    rpcws.Client.restore();
  });

  it('returns a onSignal function which takes a closure to run when a signal message is received', async () => {
    const testUrl = 'ws://localhost:3000'
    const { onSignal } = await connect(testUrl)
    onSignal((signal) => {
      expect(signal).to.deep.equal({ signal_data: 'test signal data' })
    })
  })

})
