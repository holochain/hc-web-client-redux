
import connectWs from './websocket'
import connectUnix from './unix'
import { ConnectOpts, HcClient, ConnectUnixOpts, ConnectWebsocketOpts } from './common'

require('isomorphic-fetch')

/**
 * Establish a socket connection to a Conductor interface
 * Must include `type`, along with type-specific options.
 * Support types are "websocket" and "unix"
 */
export const connect = (opts: ConnectOpts): Promise<HcClient> => {
  const ty = opts.type || 'websocket'
  if (ty === 'websocket') {
    return connectWs(opts as ConnectWebsocketOpts)
  } else if (ty === 'unix') {
    return connectUnix(opts as ConnectUnixOpts)
  } else {
    throw new Error(`Unrecognized client type: ${ty}`)
  }
}

const holochainclient = { connect: connectWs }
