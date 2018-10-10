rm -rf lib/*
tsc -w & sleep 2 && \
parcel watch \
  -d lib \
  -o holoclient.js \
  lib/out/index.js
