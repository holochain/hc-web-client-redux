import {Client} from 'rpc-websockets'
type Hash = string

export const connect = (url) => new Promise((fulfill, reject) => {
  const ws = new Client(url)
  ws.on('open', () => {
    const call = (dnaHash, zome, capability, func) => (params) => {
      ws.call(`${dnaHash}/${zome}/${capability}/${func}`, params)
    }
    const close = ws.close
    fulfill({call, close, ws})
  })
})

const win = (window as any)
win.connect = connect
