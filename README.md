# hc-web-client

Thin wrapper around `rpc-websockets` to enable calling zome functions in Holochain apps installed in a container.

## Usage

The holochain container exposes methods for each function of each zome of each running instance. It also exposes a method, `info/instances` to get information about all instances. Your app should typically use this first to get instance info, so that your UI can only be concerned with DNA hashes (and perhaps agent IDs) rather than instance IDs.

[View the Holochain JSON-RPC API documentation](https://developer.holochain.org/guide/latest/conductor_json_rpc_api.html).

See [index.html](index.html) for example usage. You can use i.e. `python3 -m http.server`.

## Development

Use `npm run build` or `npm run watch`.
