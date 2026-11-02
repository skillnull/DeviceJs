import { babel } from "@rollup/plugin-babel"
import terser from "@rollup/plugin-terser"
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

const globals = {
  "dayjs": "dayjs",
  "md5": "md5",
  "qs": "qs",
  "crypto-js": "crypto"
}

/**
 * amd - 异步模块加载，适用于 RequireJS 等模块加载器
 * es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 <script type=module> 标签的浏览器（别名：esm，module）
 * iife - 自执行函数，适用于 <script> 标签
 * umd - 通用模块定义规范，同时支持 amd，cjs 和 iife
 * system - SystemJS 模块加载器的原生格式（别名：systemjs）
 */
export default {
  input: "src/device.ts",
  plugins: [
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: false,
        declarationDir: undefined,
        emitDeclarationOnly: false
      }
    }),
    babel({babelHelpers: "runtime", exclude: /node_modules/}),
    terser()
  ],
  output: [
    {
      file: `dist/device.mjs`,
      format: "es",
      compact: true, // 是否压缩 Rollup 产生的额外代码
      globals: globals
    },
    {
      file: `dist/device.es.js`,
      format: "es",
      compact: true,
      globals: globals
    },
    {
      file: `dist/device.js`,
      name: 'Device',
      format: 'umd',
      compact: true,
      globals: globals
    }
  ],
  context: "window"
}
