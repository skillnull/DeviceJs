<div align="center">
  <a href="https://github.com/skillnull/DeviceJs">
    <img src="https://skillnull.com/others/images/DeviceJs.png" width="300" alt="DeviceJs logo">
  </a>

  <p>Lightweight device detection and browser environment utilities for JavaScript and TypeScript.</p>

  <p>
    <a href="https://www.npmjs.com/package/@skillnull/device-js"><img src="https://img.shields.io/npm/v/@skillnull/device-js?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@skillnull/device-js"><img src="https://img.shields.io/npm/dm/@skillnull/device-js?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/skillnull/DeviceJs/actions"><img src="https://img.shields.io/github/actions/workflow/status/skillnull/DeviceJs/quality.yml?branch=master&style=flat-square&label=build" alt="build status"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/skillnull/DeviceJs?style=flat-square" alt="license"></a>
  </p>

  <p><a href="./README.md">简体中文</a> | <strong>English</strong></p>
</div>

## Features

- Detects device, operating system, browser, display, network, locale, and input capabilities.
- Generates browser fingerprints and UUIDs.
- Supports Gregorian-to-Chinese-lunar date conversion.
- Safely supports browsers, Node.js, and SSR environments.
- Ships with UMD and ESM builds plus TypeScript declarations.

## Installation

```shell
npm install @skillnull/device-js
# or
yarn add @skillnull/device-js
# or
pnpm add @skillnull/device-js
```

## Usage

```ts
import Device, { type DeviceInfo, type DeviceInfoOptions } from '@skillnull/device-js'

const options: DeviceInfoOptions = {
  info: ['deviceType', 'OS', 'browserInfo']
}

const data: DeviceInfo = await Device.Info(options)
```

Call `Device.Info()` without options to retrieve all available information.

### CDN

UMD:

```html
<script src="https://unpkg.com/@skillnull/device-js@3.0.3/dist/device.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@skillnull/device-js@3.0.3/dist/device.js"></script>
```

ESM:

```html
<script type="module">
  import Device from 'https://unpkg.com/@skillnull/device-js@3.0.3/dist/device.es.js'

  const data = await Device.Info()
</script>
```

## Options

| Option | Type | Description |
| --- | --- | --- |
| `domain` | `string` | Domain used to generate the browser fingerprint. Defaults to `window.location.host`. |
| `transferDateToLunar` | `string` | Gregorian date to convert when `lunarDate` is requested. |
| `info` | `DeviceInfoKey[]` | Fields to return. All fields are returned when omitted. |
| `locale` | `'zh-CN' \| 'en-US'` | Language used for textual results. Defaults to `zh-CN`. |
| `showLoading` | `boolean` | Whether to display the loading overlay. Enabled by default; pass `false` to disable it. |

Available `info` fields:

| Category | Fields |
| --- | --- |
| Device | `deviceType`, `isEmulator`, `deviceModel`, `hardwareConcurrency` |
| System | `OS`, `OSVersion`, `platform`, `language`, `timezone` |
| Display and input | `screenHeight`, `screenWidth`, `viewportHeight`, `viewportWidth`, `devicePixelRatio`, `orientation`, `touchSupport`, `colorScheme` |
| Browser and network | `browserInfo`, `userAgent`, `netWork`, `cookieEnabled` |
| Identity and location | `fingerprint`, `UUID`, `geoPosition` |
| Date | `date`, `lunarDate`, `week` |

> Some information depends on browser support, user-agent data, or user permission. In particular, geolocation requires explicit permission from the user.

## Live Demo

[Open the DeviceJs demo](https://skillnull.com/others/DeviceJs/index.html).

## Release

```shell
# Full release: synchronize versions, verify, push the commit and tag, then publish after GitHub CI passes
npm run publish

# Validate the next version without committing, pushing, or publishing
npm run publish -- --dry-run
```

The release command synchronizes versions in `package.json`, `package-lock.json`, and both README files. Run it only from a clean `master` branch that matches `origin/master`.

## License

[MIT](./LICENSE) © 2019-present skillnull
