
type Hash = string

const noop = () => {}

const wsSenderA = (url, msg) => {
  return new Promise((fulfill, reject) => {
    const websocket = new WebSocket(url)
    websocket.onopen = e => {
      console.log('connected')
      websocket.send(msg)
    }
    websocket.onclose = e => {
      console.log('closed')
    }
    websocket.onmessage = e => {
      fulfill(e.data)
      websocket.close()
    }
    websocket.onerror = e => {
      console.error('error')
      reject(e)
      websocket.close()
    }
  })
}

// const wsSenderB = (url, msg) => {
//   return new Promise((fulfillInterface, rejectInterface) => {
//     let id = 0
//     const websocket = new WebSocket(url)
//     const interface = {
//       close: websocket.close,
//       send,
//     }

//     const send = (dnaHash, zome, capability, func, params) => {
//       const msg = rpcMessage({
//         dnaHash, zome, capability, func, params, id
//       })
//       websocket.send(msg)
//       id += 1
//       return new Promise((fulfillSend, rejectSend) => {
//         websocket.onopen = e => {
//           console.log('connected')
//           fulfillSend(interface)
//         }
//       })
//     }

//     websocket.onclose = e => {
//       console.log('closed')
//     }
//     websocket.onmessage = e => {
//       fulfillInterface(e.data)
//     }
//     websocket.onerror = e => {
//       console.error('error')
//       rejectInterface(e)
//       websocket.close()
//     }
//   })
// }

const rpcMessage = ({dnaHash, zome, capability, func, params, id}) => {
  const rpc = {
    jsonrpc: '2.0',
    id,
    method: `${dnaHash}/${zome}/${capability}/${func}`,
    params,
  }
  return JSON.stringify(rpc)
}

const getCaller = (url) => {

  return (dnaHash, zome, capability, func) => params => {
    const msg = rpcMessage({
      dnaHash, zome, capability, func, params, id: 'TODO'
    })
    return wsSenderA(url, msg)
  }
}

const win = (window as any)
// win.wsSend = wsSend
win.getCaller = getCaller
