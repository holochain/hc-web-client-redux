rm -rf lib/*
tsc -w & sleep 2 && \
parcel watch \
  -d lib \
  -o holochainClient.js \
  lib/out/index.js
