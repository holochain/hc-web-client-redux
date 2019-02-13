import { Client } from 'rpc-websockets'

const CONDUCTOR_CONFIG = '/_dna_connections.json'

type Call = (...segments: Array<string>) => (params: any) => Promise<any>
type Close = () => Promise<any>

export const connect = (paramUrl?: string) => new Promise<{call: Call, close: Close, ws: any}>(async (fulfill, reject) => {
  const url = paramUrl || await getUrlFromContainer().catch(() => reject(
    'Could not auto-detect DNA interface from conductor. \
Ensure the web UI is hosted by a holochain conductor or manually specify url as parameter to connect'))

  const ws = new Client(url)
  ws.on('open', () => {
    // create a function which returns a function
    // the outer function should be called with one or more arguments, meant to represent the RPC "method"
    // this value can only be a string
    // so, if there is only one, that argument will remain as-is
    // if there is more than one, the arguments will be joined into a single string, separated by forward slashes '/'

    // the inner function should be called with a JSON object, which will be the RPC "params"

    // in practice, using this looks like `call("instance", "zome_name", "function_name")({ key: "value" })`

    // the whole thing returns a Promise, which will resolve to the result, or an error
    const call = (...method_segments) => (params) => {

      const method = method_segments.length === 1 ? method_segments[0] : method_segments.join('/')
      return ws.call(method, params)
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

if (typeof(window) !== 'undefined') {
  const win = (window as any)
  win.holoclient = win.holoclient || { connect }
}
