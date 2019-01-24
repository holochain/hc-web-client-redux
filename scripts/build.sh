rm -rf dist/*
rm -rf lib/*
tsc && parcel build \
  -d lib \
  -o index.js \
  --no-minify \
  dist/index.js
