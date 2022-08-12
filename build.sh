#!/bin/bash

rm -rf dist

cp device.js device.export.js

echo 'export default Device;' >> device.export.js

babel index.js device.js device.export.js -d dist

rm device.export.js