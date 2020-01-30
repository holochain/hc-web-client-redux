var rpcws = require('rpc-websockets')
var chai = require("chai")
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require("sinon-chai")
chai.use(sinonChai)
var fetchMock = require('fetch-mock')


const { connect } = require('../lib/index')

const callMock = sinon.fake.resolves(null)

describe('hc-web-client connect', () => {

  beforeEach(() => {
    sinon.stub(rpcws, 'Client').returns(
      {
        on: sinon.fake((on, callback) => {
          return callback()
        }),
        once: sinon.fake((on, callback) => {
          return callback()
        }),
        call: sinon.fake((method, params) => callMock(method, params)),
      }
    )
  })

  afterEach(() => {
    rpcws.Client.restore()
    fetchMock.reset()
  });

  it('Can connect by passing URL', async () => {
    const testUrl = 'ws://localhost:3000'
    try {
        await connect({url: testUrl})
    } catch (e) {
    }

    expect(rpcws.Client).to.have.been.calledWith(testUrl)
  })

  it('Can connect by passing URL and options', async () => {
    const testUrl = 'ws://localhost:3000'
    const timeout = 1000
    const wsClient = {autoreconnect: false}
    try {
        await connect({url: testUrl, wsClient, timeout})
    } catch (e) {
    }
    expect(rpcws.Client).to.have.been.calledWith(testUrl, wsClient)
  })

  it('Can connect by passing no params and retrieving port from endpoint', async () => {
    const testPort = 1234
    fetchMock.getOnce('*',
      JSON.stringify({ 'dna_interface': { 'id': 'websocket interface','driver': { 'type': 'websocket','port': testPort },'admin': true,'instances': [] } })
    )
    try {
        await connect()
    } catch (e) {
    }
    expect(rpcws.Client).to.have.been.calledWith(`ws://localhost:${testPort}`)
  })

  it('Can gracefully handle errors when trying to connect', async () => {
    fetchMock.getOnce('*', JSON.stringify({ }))
    try {
      await connect()
    } catch (e) {
      expect(e).to.equal(`Could not auto-detect DNA interface from conductor. Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect`)
    }
  })

  it('Can gracefuly handle errors when no connection to ws is available', async () => {
    const testUrl = 'ws://localhost:3000'
    try {
        await connect({url: testUrl})
    } catch (e) {
        expect(e).to.equal(`Could not establish websocket connection with requested url`)
    }

    expect(rpcws.Client).to.have.been.calledWith(testUrl)
  })

})
