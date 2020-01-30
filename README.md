# hc-web-client

Thin wrapper around `rpc-websockets` to enable calling zome functions in Holochain apps installed in a conductor. This module aims to fill a similar role to web3.js and allow for connecting to a holochain instance in a variety of scenarios.

## Installation

The module can either be imported and used as part of a compiled web application or used in pure HTML. In the first case it is reccomended to download and install via npm `npm install @holochain/hc-web-client`. It can then be imported or required using

```javascript
const { connect } = require('@holochain/hc-web-client')
// or
import { connect } from '@holochain/hc-web-client'
```

For the pure HTML case the hc-web-client.js file in the `dist/` folder must be moved to your project directory and imported using

```html
<script type="text/javascript" src="path/to/hc-web-client-0.0.1.browser.min.js"></script>
```

This will add a `holochainclient` field to the window object.

## Usage

### Scenario 1

A full URL including port to the holochain interface is known and will never change. This is ok for development or very specific applications. Usage:

```javascript
connect({ url: "ws://localhost:3000" }).then(({callZome, close}) => {
    callZome('instanceId', 'zome', 'funcName')(params)
})
```

### Scenario 2

UI is being served by the holochain conductor. This is the most commonly anticipated usage. Interface port is unknown but valid interface is defined in the conductor config. In this case no url parameter is required and it will automatically call the conductor to retrieve the correct port to make calls on. Usage:

```javascript
connect().then(({callZome, close}) => {
    callZome('instanceId', 'zome', 'funcName')(params)
})
```

### Conductor RPC calls

The holochain conductor exposes methods for each function of each zome of each running instance. 

If the web client is connected to an admin interface there are also RPC methods to manage DNAs, UIs, interfaces and bridges. These can be called from the web client for exampe as:
```
connect().then(({call, close}) => {
    call('admin/dna/install_from_file')(params)
})
```

[View the Holochain JSON-RPC API documentation](https://developer.holochain.org/guide/latest/conductor_json_rpc_api.html).

## Building

- To build for node/babel use `npm run build`. This will build to ./lib
- and to package for the web use `npm run build:web`. This will build to ./src

## Contributing

### Running tests

Tests can be run using `npm run test`

### Publishing

To publish a new release to npm use the following steps. Ensure you are on the master branch then run

- `npm version patch`
- `npm publish --access public`

This will automatically build, lint, commit and push a new git tag before publishing. You can alternatively use `npm version major|minor|patch` to increment the correct version number. Please do not modify the version number in the package.json directly.

## License

This project is licensed under the AGPL-3.0 License
