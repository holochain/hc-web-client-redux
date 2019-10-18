
export type Call = (...segments: Array<string>) => (params: any) => Promise<any>
export type CallZome = (instanceId: string, zome: string, func: string) => (params: any) => Promise<any>
export type OnSignal = (callback: (params: any) => void) => void
export type Close = () => Promise<any>

export type ConnectWebsocketOpts = {
  url?: string,
  timeout?: number,
  wsClient?: any
}
export type ConnectUnixOpts = {
  file: string,
  timeout?: number,
}

export type ConnectOpts =
  // default is websocket, so type can be websocket or anything else
  (ConnectWebsocketOpts & { type: 'websocket' | any })
  // type has to be unix to get unix opts
  | (ConnectUnixOpts & { type: 'unix' })

export type HcClient = { call: Call, callZome: CallZome, close: Close, onSignal: OnSignal }

