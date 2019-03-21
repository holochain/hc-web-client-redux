import { connect } from '../index'
import { Client } from 'rpc-websockets'

const callMock = jest.fn()

jest.mock('rpc-websockets', () => {
  return {
    Client: jest.fn(() => {
      return {
        on: jest.fn((on, callback) => {
          return callback()
        }),
        call: jest.fn((method, params) => {
          callMock(method, params)
        }),
      }
    })
  }
})

describe('hc-web-client connect', () => {

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

  it('Can can gracefully handle errors when trying to connect', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify({ }))
    expect(connect()).rejects.toEqual(`Could not auto-detect DNA interface from conductor. Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect`)
  })

})

describe('hc-web-client call', () => {

  it('produces the expected call object when called with three params', async () => {
    const testUrl = 'ws://localhost:3000'
    const { call } = await connect(testUrl)
    await call('instance', 'zome', 'func')({param1: 'x'})
    expect(callMock).toBeCalledWith('call', {
      'instance_id': 'instance',
      'zome': 'zome',
      'function': 'func',
      'params': {param1: 'x'}
    })
  })

  it('produces the expected call object when called with a single slash delimited string (backward compatibility)', async () => {
    const testUrl = 'ws://localhost:3000'
    const { call } = await connect(testUrl)
    await call('instance/zome/func')({param1: 'x'})
    expect(callMock).toBeCalledWith('call', {
      'instance_id': 'instance',
      'zome': 'zome',
      'function': 'func',
      'params': {param1: 'x'}
    })
  })

  it('gives an error if called with incorrect number of arguments', async () => {
    const testUrl = 'ws://localhost:3000'
    const { call } = await connect(testUrl)
    const expectedErorr = new Error('Invalid arguments. Must call with either a single slash delimited string "instance/zome/func" or three parameters for instance, zome and func.')

    expect(
      call('instance/zome/func', '')
    ).toThrow(expectedErorr);

    expect(
      call()
    ).toThrow(expectedErorr);

    expect(
      call('not/valid')
    ).toThrow(expectedErorr);
  })

  it('allows low level calls using callRaw', async () => {
    const testUrl = 'ws://localhost:3000'
    const { callRaw } = await connect(testUrl)
    await callRaw('any/method')({param1: 'x'})
    expect(callMock).toBeCalledWith('any/method', {param1: 'x'})
  })

})
