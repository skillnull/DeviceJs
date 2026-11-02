<div align="center">
  <a href="https://github.com/skillnull/DeviceJs">
    <img src="https://skillnull.com/others/images/DeviceJs.png" width="300" alt="DeviceJs logo">
  </a>

  <p>轻量级 JavaScript 与 TypeScript 设备检测和浏览器环境信息工具。</p>

  <p>
    <a href="https://www.npmjs.com/package/@skillnull/device-js"><img src="https://img.shields.io/npm/v/@skillnull/device-js?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@skillnull/device-js"><img src="https://img.shields.io/npm/dm/@skillnull/device-js?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/skillnull/DeviceJs/actions"><img src="https://img.shields.io/github/actions/workflow/status/skillnull/DeviceJs/quality.yml?branch=master&style=flat-square&label=build" alt="build status"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/skillnull/DeviceJs?style=flat-square" alt="license"></a>
  </p>

  <p><strong>简体中文</strong> | <a href="./README.en.md">English</a></p>
</div>

## 功能特性

- 检测设备、操作系统、浏览器、屏幕、网络、语言和输入能力。
- 生成浏览器指纹和 UUID。
- 支持公历转农历。
- 支持浏览器、Node.js 和 SSR 环境安全调用。
- 提供 UMD、ESM 产物和 TypeScript 类型声明。

## 安装

```shell
npm install @skillnull/device-js
# or
yarn add @skillnull/device-js
# or
pnpm add @skillnull/device-js
```

## 使用

```ts
import Device, { type DeviceInfo, type DeviceInfoOptions } from '@skillnull/device-js'

const options: DeviceInfoOptions = {
  info: ['deviceType', 'OS', 'browserInfo']
}

const data: DeviceInfo = await Device.Info(options)
```

不传参数调用 `Device.Info()` 时，将返回全部可用信息。

### CDN

UMD：

```html
<script src="https://unpkg.com/@skillnull/device-js@3.0.1/dist/device.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@skillnull/device-js@3.0.1/dist/device.js"></script>
```

ESM：

```html
<script type="module">
  import Device from 'https://unpkg.com/@skillnull/device-js@3.0.1/dist/device.es.js'

  const data = await Device.Info()
</script>
```

## 配置项

| 配置 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | `string` | 生成浏览器指纹时使用的域名，默认为 `window.location.host`。 |
| `transferDateToLunar` | `string` | 请求 `lunarDate` 时需要转换的公历日期。 |
| `info` | `DeviceInfoKey[]` | 指定需要返回的字段，不传时返回全部字段。 |
| `locale` | `'zh-CN' \| 'en-US'` | 文本结果使用的语言，默认为 `zh-CN`。 |
| `showLoading` | `boolean` | 是否显示加载层，默认为 `false`。 |

可用的 `info` 字段：

| 分类 | 字段 |
| --- | --- |
| 设备 | `deviceType`, `isEmulator`, `deviceModel`, `hardwareConcurrency` |
| 系统 | `OS`, `OSVersion`, `platform`, `language`, `timezone` |
| 屏幕与输入 | `screenHeight`, `screenWidth`, `viewportHeight`, `viewportWidth`, `devicePixelRatio`, `orientation`, `touchSupport`, `colorScheme` |
| 浏览器与网络 | `browserInfo`, `userAgent`, `netWork`, `cookieEnabled` |
| 标识与位置 | `fingerprint`, `UUID`, `geoPosition` |
| 日期 | `date`, `lunarDate`, `week` |

> 部分信息依赖浏览器支持、User-Agent 数据或用户授权。其中地理位置需要用户明确授权。

## 在线演示

[打开 DeviceJs 在线演示](https://skillnull.com/others/DeviceJs/index.html)。

## 发布

```shell
# 完整发布：同步版本、验证、推送提交与 Tag，通过 GitHub CI 后发布 npm
npm run publish

# 只验证下一版本，不提交、不推送、不发布
npm run publish -- --dry-run
```

发布入口会同步 `package.json`、`package-lock.json` 和中英文 README 中的版本号。发布必须从与 `origin/master` 一致的干净 `master` 分支执行。

## 许可证

[MIT](./LICENSE) © 2019-present skillnull
