
export type Call = (...segments: Array<string>) => (params: any) => Promise<any>
export type CallZome = (instanceId: string, zome: string, func: string) => (params: any) => Promise<any>
export type OnSignal = (callback: (params: any) => void) => void
export type Close = () => Promise<any>

export type ConnectOpts = {
  type: 'websocket'
  url?: string,
  timeout?: number,
  wsClient?: any
} | {
  type: 'unix',
  file: string,
  timeout?: number,
}

export type HcClient = { call: Call, callZome: CallZome, close: Close, onSignal: OnSignal }

