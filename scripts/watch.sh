rm -rf lib/*
tsc -w & sleep 2 && \
parcel watch \
  -d lib \
  -o holochain_client.js \
  lib/out/index.js
