import { connect } from './index'

import { Client } from 'rpc-websockets'
jest.mock('rpc-websockets')

describe('hc-web-client', () => {

  it('Can connect by passing URL', () => {
    const testUrl = 'ws://localhost:3000'
    connect(testUrl)
    expect(Client).toBeCalledWith(testUrl)
  })

  it('Can connect by passing no params and retriving port from endpoint', () => {
    connect()
    // expect(Client).toBeCalledWith(testUrl)
  })

})
