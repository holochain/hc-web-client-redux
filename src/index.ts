import { Client } from 'rpc-websockets'

const CONDUCTOR_CONFIG = '/_dna_connections.json'

type Call = (...segments: Array<string>) => (params: any) => Promise<any>
type Close = () => Promise<any>

export const connect = (paramUrl?: string) => new Promise<{call: Call, close: Close, ws: any}>(async (fulfill, reject) => {
  const url = paramUrl || await getUrlFromContainer().catch(() => reject(
    'Could not auto-detect DNA interface from conductor. \
Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect'))

  const ws = new Client(url)
  ws.on('open', () => {
    const call = (...methodSegments) => (params) => {
      return ws.call("call", params)
    }
    // define a function which will close the websocket connection
    const close = () => ws.close()
    fulfill({ call, close, ws })
  })
})

function getUrlFromContainer (): Promise<string> {
  return fetch(CONDUCTOR_CONFIG)
    .then(data => data.json())
    .then(json => json.dna_interface.driver.port)
    .then(port => `ws://localhost:${port}`)
}

const holochainclient = { connect }
