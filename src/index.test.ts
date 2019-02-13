import { connect } from './index'

import { Client } from 'rpc-websockets'
jest.mock('rpc-websockets', () => {
  return {
    Client: jest.fn(() => {
      return {
        on: jest.fn((on, callback) => {
          return callback()
        })
      }
    })
  }
})

describe('hc-web-client', () => {

  it('Can connect by passing URL', async () => {
    const testUrl = 'ws://localhost:3000'
    await connect(testUrl)
    expect(Client).toBeCalledWith(testUrl)
  })

  it('Can connect by passing no params and retriving port from endpoint', async () => {
    const testPort = 1234
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify({ 'dna_interface': { 'id': 'websocket interface','driver': { 'type': 'websocket','port': testPort },'admin': true,'instances': [] } }))
    await connect()
    expect(Client).toBeCalledWith(`ws://localhost:${testPort}`)
  })

})
