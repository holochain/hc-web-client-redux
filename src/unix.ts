import { HcClient, OnSignal, ConnectUnixOpts } from './common'
import * as ipc from 'json-ipc-lib'
import net from 'net'

const DEFAULT_TIMEOUT = 5000


/**
 * Establish a websocket connection to a Conductor interface
 * Accepts an object of options:
 *   - file: Specifies the file of the domain socket
 *   - timeout (optional): If the socket is not ready, `call` and `callZome` will wait this many milliseconds for the
 *       socket to be ready before timing out and rejecting the promise. Defaults to 5 seconds, but if you set it
 *       to 0 or null, it will never timeout.
 */
export default (opts: ConnectUnixOpts) => new Promise<HcClient>(async (fulfill, reject) => {

  const timeout = opts.timeout || DEFAULT_TIMEOUT
  const client = new ipc.Client(opts.file)
  const socket = net.createConnection(opts.file)

  const call = (...methodSegments) => (params) => {
    const method = methodSegments.length === 1 ? methodSegments[0] : methodSegments.join('/')
    return client.call(method, params)
  }
  const callZome = (instanceId, zome, func) => (args) => {
    const callObject = {
      'instance_id': instanceId,
      zome,
      'function': func,
      args
    }
    return client.call('call', callObject)
  }
  const onSignal: OnSignal = (callback: (params: any) => void) => {
    socket.on('data', callback)
  }
  // define a function which will close the websocket connection
  const close = () => {
    socket.destroy()
    // TODO: close ipc socket?
    return Promise.resolve()
  }
  fulfill({ call, callZome, close, onSignal })
})
