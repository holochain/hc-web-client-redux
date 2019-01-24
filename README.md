# hc-web-client

Thin wrapper around `rpc-websockets` to enable calling zome functions in Holochain apps installed in a container. This module aims to fill a similar role to web3.js and allow for connecting to a holochain instance in a variety of scenarios. Currently two are implemented:

### Scenario 1

A full URL including port to the holochain interface is known and will never change. This is ok for development or very specific applications. Usage:

```javascript
connect("ws:localhost:3000").then(({call, close}) => {
    call('app/zome/fn')(params)
})
```

### Scenario 2

UI is being served by the holochain container. This is the most commonly anticipated usage. Interface port is unknown but valid interface is defined in the container config. In this case no url parameter is required and it will automatically call the contaier to retrieve the correct port to make calls on. Usage:

```javascript
connect().then(({call, close}) => {
    call('app/zome/fn')(params)
})
```


## Development

Use `npm run build` or `npm run watch`.