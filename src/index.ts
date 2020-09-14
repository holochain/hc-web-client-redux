import { Client } from 'rpc-websockets'

require('isomorphic-fetch')

const CONDUCTOR_CONFIG = '/_dna_connections.json'
const DEFAULT_TIMEOUT = 5000

type Call = (...segments: Array<string>) => (params: any) => Promise<any>
type CallZome = (instanceId: string, zome: string, func: string) => (params: any) => Promise<any>
type OnSignal = (callback: (params: any) => void) => void
type Close = () => Promise<any>

type ConnectOpts = {
  url?: string,
  timeout?: number,
  wsClient?: any
}

/**
 * Establish a websocket connection to a Conductor interface
 * Accepts an object of options:
 *   - url (optional): Specifies the URL to establish the connection with
 *   - wsClient (optional): Object of options that gets passed through as configuration to the rpc-websockets client
 *   - timeout (optional): If the socket is not ready, `call` and `callZome` will wait this many milliseconds for the
 *       socket to be ready before timing out and rejecting the promise. Defaults to 5 seconds, but if you set it
 *       to 0 or null, it will never timeout.
 */
export const connect = (opts: ConnectOpts = {}) => new Promise<{call: Call, callZome: CallZome, close: Close, onSignal: OnSignal, ws: any}>(async (fulfill, reject) => {
  const url = opts.url || await getUrlFromConductor().catch(() => reject(
    'Could not auto-detect DNA interface from conductor. \
Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect'))
  const timeout = opts.timeout || DEFAULT_TIMEOUT
  const ws = new Client(url, opts.wsClient)
  
  

  ws.on('open', () => console.debug('hc-web-client: websocket open'))
  ws.on('close', () => console.debug('hc-web-client: websocket closed'))
  ws.on('error', (e) => reject(e || 'Could not establish websocket connection with requested url'))

  ws.once('open', () => {
    const call = (...methodSegments) => (params) => {
      const method = methodSegments.length === 1 ? methodSegments[0] : methodSegments.join('/')
      return callWhenConnected(ws, method, params, timeout)
    }
    const callZome = (instanceId, zome, func) => (args) => {
      const callObject = {
        'instance_id': instanceId,
        zome,
        'function': func,
        args
      }
      return callWhenConnected(ws, 'call', callObject, timeout)
    }
    const onSignal: OnSignal = (callback: (params: any) => void) => {

      const runCallbacks = () => {
        // go down to the underlying websocket connection (.socket)
        // for a simpler API
        ws.socket.on('message', (message: any) => {
          if (!message) return
          const msg = JSON.parse(message)
          if (msg.signal || msg.instance_stats) {
            callback(msg)
          }
        })
      }
      // for the sake of re-establishing callbacks
      ws.on('open', runCallbacks)
      runCallbacks()
    }
    // define a function which will close the websocket connection
    const close = () => ws.close()
    fulfill({ call, callZome, close, onSignal, ws })
  })
})

function getUrlFromConductor (): Promise<string> {
  return fetch(CONDUCTOR_CONFIG)
    .then(data => data.json())
    .then(json => json.dna_interface.driver.port)
    .then(port => `ws://localhost:${port}`)
}

/**
 * Ensure that a ws client never attempts to call when the socket is not ready
 * Instead, return a promise that resolves only when the socket is connected and the call is made
 */
async function callWhenConnected (ws, method, payload, timeout = null) {
  if (ws.ready) {
    return Promise.resolve(ws.call(method, payload))
  } else {
    return new Promise((resolve, reject) => {
      const timer = timeout
        ? setTimeout(() => {
          reject(`Timeout while waiting for ws to connect. method: ${method}, payload: ${JSON.stringify(payload)}`)
        }, timeout)
        : null
      ws.once('open', () => {
        clearTimeout(timer)
        ws.call(method, payload).then(resolve).catch(reject)
      })
    })
  }
}

const holochainclient = { connect }
