rm -rf dist/*
tsc -w & sleep 2 && \
parcel watch \
  -d dist \
  -o holoclient.js \
  dist/out/index.js
