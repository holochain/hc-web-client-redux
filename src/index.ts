import {Client} from 'rpc-websockets'

const CONTAINER_DNA_CONNECTIONS_PATH = "/_dna_connections.json"

function retrieve_port_from_container(): Promise<string> {
	return fetch(CONTAINER_DNA_CONNECTIONS_PATH)
		.then(data => {
				return data.json()["dna_interface"]["driver"]["port"]
		})
}

export const connect = (url?: string) => new Promise((fulfill, reject) => {
	new Promise(() => {
		if (url) {
			return url
		} else {
			return retrieve_port_from_container().then((port) => {
				return `ws://localhost:${port}`
			})
		}
	}).then((url) => {
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
})

const win = (window as any)
win.holoclient = win.holoclient || {connect}
