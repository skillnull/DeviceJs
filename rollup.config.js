import { babel } from "@rollup/plugin-babel"
import terser from "@rollup/plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

/**
 * amd - 异步模块加载，适用于 RequireJS 等模块加载器
 * cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
 * es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 <script type=module> 标签的浏览器（别名：esm，module）
 * iife - 自执行函数，适用于 <script> 标签
 * umd - 通用模块定义规范，同时支持 amd，cjs 和 iife
 * system - SystemJS 模块加载器的原生格式（别名：systemjs）
 */
export default {
  input: "src/device.js",
  plugins: [resolve(), babel({ babelHelpers: "runtime", exclude: /node_modules/ }), commonjs(), terser()],
  output: [
    {
      file: `dist/device.es.js`,
      format: "es",
      compact: true // 是否压缩 Rollup 产生的额外代码
    },
    {
      file: `dist/device.js`,
      name: 'device',
      format: 'umd',
      compact: true
    }
  ]
}
