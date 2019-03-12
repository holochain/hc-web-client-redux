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
      let instanceId
      let zome
      let func

      if (methodSegments.length === 1) {
        [instanceId, zome, func] = methodSegments[0].split('/')
      } else if (methodSegments.length === 3) {
        [instanceId, zome, func] = methodSegments
      } else {
        throw new Error('Invalid params to call. \
          Must be either 3 string specifying instance, zome, function \
          or a single string delimited with "/"')
      }

      const callObject = {
        'instance_id': instanceId,
        zome,
        'function': func,
        params
      }

      return ws.call('call', callObject)
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
