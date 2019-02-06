rm -rf lib/*
tsc && parcel build \
  -d lib \
  -o holochainClient.js \
  --no-minify \
  lib/out/index.js \
&& rm -rf lib/out
