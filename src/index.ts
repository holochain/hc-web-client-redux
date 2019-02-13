import { Client } from 'rpc-websockets'

type Call = (...segments: Array<string>) => (params: any) => Promise<any>
type Close = () => Promise<any>

export const connect = (url?: string) => new Promise<{call: Call, close: Close, ws: any}>((fulfill, reject) => {
  const ws = new Client(url)
  ws.on('open', () => {
    const call = (...segments) => (params) => {
      const method = segments.length === 1 ? segments[0] : segments.join('/')
      return ws.call(method, params)
    }
    const close = () => ws.close()
    fulfill({ call, close, ws })
  })
})

if (typeof(window) !== 'undefined') {
  const win = (window as any)
  win.holoclient = win.holoclient || { connect }
}
