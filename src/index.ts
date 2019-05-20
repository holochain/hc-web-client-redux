import { Client } from 'rpc-websockets'

const CONDUCTOR_CONFIG = '/_dna_connections.json'

type Call = (...segments: Array<string>) => (params: any) => Promise<any>
type CallZome = (instanceId: string, zome: string, func: string) => (params: any) => Promise<any>
type OnSignal = (callback: (params: any) => void) => void
type Close = () => Promise<any>

export const connect = (paramUrl?: string) => new Promise<{call: Call, callZome: CallZome, close: Close, onSignal: OnSignal, ws: any}>(async (fulfill, reject) => {
  const url = paramUrl || await getUrlFromContainer().catch(() => reject(
    'Could not auto-detect DNA interface from conductor. \
Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect'))

  const ws = new Client(url)

  ws.on('open', () => 'WS open')
  ws.on('close', () => 'WS closed')

  ws.once('open', () => {
    const call = (...methodSegments) => (params) => {
      const method = methodSegments.length === 1 ? methodSegments[0] : methodSegments.join('/')
      return callWhenConnected(ws, method, params)
    }
    const callZome = (instanceId, zome, func) => (params) => {
      const callObject = {
        'instance_id': instanceId,
        zome,
        'function': func,
        params
      }
      return callWhenConnected(ws, 'call', callObject)
    }
    const onSignal: OnSignal = (callback: (params: any) => void) => {
      // go down to the underlying websocket connection (.socket)
      // for a simpler API
      ws.socket.on('message', (message: any) => {
        if (!message) return
        const msg = JSON.parse(message)
        if (msg.signal) {
          callback(msg.signal)
        }
      })
    }
    // define a function which will close the websocket connection
    const close = () => ws.close()
    fulfill({ call, callZome, close, onSignal, ws })
  })
})

function getUrlFromContainer (): Promise<string> {
  return fetch(CONDUCTOR_CONFIG)
    .then(data => data.json())
    .then(json => json.dna_interface.driver.port)
    .then(port => `ws://localhost:${port}`)
}

/**
 * Ensure that a ws client never attempts to call when the socket is not ready
 * Instead, return a promise that resolves only when the socket is connected and the call is made
 */
async function callWhenConnected (ws, method, payload, timeout=3000) {
  if (ws.ready) {
    return Promise.resolve(ws.call(method, payload))
  } else {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(`Timeout while waiting for ws to connect. method: ${method}, payload: ${JSON.stringify(payload)}`)
      }, timeout)
      ws.once('open', () => {
        clearTimeout(timer)
        ws.call(method, payload).then(resolve).catch(reject)
      })
    })
  }
}


const holochainclient = { connect }
