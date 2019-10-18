import { HcClient, ConnectOpts, OnSignal } from './common'


const DEFAULT_TIMEOUT = 5000


/**
 * Establish a websocket connection to a Conductor interface
 * Accepts an object of options:
 *   - file: Specifies the file of the domain socket
 *   - timeout (optional): If the socket is not ready, `call` and `callZome` will wait this many milliseconds for the
 *       socket to be ready before timing out and rejecting the promise. Defaults to 5 seconds, but if you set it
 *       to 0 or null, it will never timeout.
 */
export default (opts: ConnectOpts = {}) => new Promise<HcClient>(async (fulfill, reject) => {

  const timeout = opts.timeout || DEFAULT_TIMEOUT
  const ws = new ipc.Client(url, opts.wsClient)

  ws.on('open', () => 'WS open')
  ws.on('close', () => 'WS closed')

  ws.once('open', () => {
    const call = (...methodSegments) => (params) => {
      // TODO
    }
    const callZome = (instanceId, zome, func) => (args) => {
      // TODO
    }
    const onSignal: OnSignal = (callback: (params: any) => void) => {
      // TODO
    }
    // define a function which will close the websocket connection
    const close = () => {
      // TODO
    }
    fulfill({ call, callZome, close, onSignal })
  })
})
