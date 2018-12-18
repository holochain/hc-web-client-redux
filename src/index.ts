import {Client} from 'rpc-websockets'
type Hash = string

type HcWebClientConnect = {
  call: (...methodSegments: Array<string>) => (params: any) => Promise<string>,
  close: () => Promise<any>,
  ws: any
}

export const connect = (url: string) => new Promise<HcWebClientConnect>((fulfill, reject) => {
  const ws = new Client(url)
  ws.on('open', () => {
    const call = (...segments) => (params) => {
      const method = segments.length === 1 ? segments[0] : segments.join('/')
      return ws.call(method, params)
    }
    const close = () => ws.close()
    fulfill({call, close, ws})
  })
})

// const win = (window as any)
// win.holoclient = win.holoclient || {connect}
