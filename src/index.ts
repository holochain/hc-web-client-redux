import {Client} from 'rpc-websockets'

// export a function which consumes a URL of a running Holochain Websocket based JSON-RPC service
// and returns a Promise which fulfills to some utility functions for interacting with Holochain
export const connect = (url) => new Promise((fulfill, reject) => {
  const ws = new Client(url)
  ws.on('open', () => {
    // create a function which returns a function
    // the outer function should be called with one or more arguments, meant to represent the RPC "method"
    // this value can only be a string
    // so, if there is only one, that argument will remain as-is
    // if there is more than one, the arguments will be joined into a single string, separated by forward slashes '/'

    // the inner function should be called with a JSON object, which will be the RPC "params"
    
    // in practice, using this looks like `call("instance", "zome_name", "function_name")({ key: "value" })`
    
    // the whole thing returns a Promise, which will resolve to the result, or an error
    const call = (...method_segments) => (params) => {
      
      const method = method_segments.length === 1 ? method_segments[0] : method_segments.join('/')
      return ws.call(method, params)
    }
    // define a function which will close the websocket connection
    const close = () => ws.close()
    
    // fulfill with the Promise with the `call`, and `close` functions, and the raw WebSocket too
    fulfill({call, close, ws})
  })
})

// in case for use in the browser, expose the `connect` function under the holochainClient global variable
const win = (window as any)
win.holochainClient = win.holochainClient || {connect}
