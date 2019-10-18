
import connectWs from './websocket'
import connectUnix from './unix'
import { ConnectOpts, HcClient } from './common'

require('isomorphic-fetch')

/**
 * Establish a websocket connection to a Conductor interface
 * Accepts an object of options:
 *   - url (optional): Specifies the URL to establish the connection with
 *   - wsClient (optional): Object of options that gets passed through as configuration to the rpc-websockets client
 *   - timeout (optional): If the socket is not ready, `call` and `callZome` will wait this many milliseconds for the
 *       socket to be ready before timing out and rejecting the promise. Defaults to 5 seconds, but if you set it
 *       to 0 or null, it will never timeout.
 */
export const connect = (opts: ConnectOpts): Promise<HcClient> => {
  if (opts.type === 'websocket') {
    return connectWs(opts)
  } else if (opts.type === 'unix') {
    return connectUnix(opts)
  } else {
    throw new Error(`Unrecognized client type: ${opts.type}`)
  }
}


const holochainclient = { connect: connectWs }