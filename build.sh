#!/bin/bash
# 定义sed -i 参数(数组)
# Default case for Linux sed, just use "-i"
sedi=(-i)
case "$(uname)" in
  # For macOS, use two parameters
  Darwin*) sedi=(-i "")
esac

rm -rf dist

cp device.js device.export.js

echo 'export default Device;' >> device.export.js

babel index.js device.js device.export.js -d dist

#sed "${sedi[@]}" "/export default Device;/d" device.js

rm device.export.js