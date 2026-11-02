const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { readFileSync } = require('node:fs')
const test = require('node:test')

const Device = require('../dist/device.js')

test('retrieves all fields in Node without creating browser globals', async () => {
  const result = await Device.Info()

  assert.equal(typeof result.UUID, 'string')
  assert.equal(result.fingerprint, '')
  assert.equal(result.geoPosition, '获取失败')
  assert.equal(result.netWork, '未知')
  assert.equal(typeof global.document, 'undefined')
  assert.equal(typeof global.window, 'undefined')
})

test('returns localized fallback values', async () => {
  const result = await Device.Info({
    info: ['deviceModel', 'orientation', 'netWork', 'geoPosition', 'week'],
    locale: 'en-US'
  })

  assert.deepEqual(Object.keys(result).sort(), [
    'deviceModel',
    'geoPosition',
    'netWork',
    'orientation',
    'week'
  ])
  assert.equal(result.deviceModel, 'Unknown')
  assert.equal(result.orientation, 'Unknown')
  assert.equal(result.netWork, 'Unknown')
  assert.equal(result.geoPosition, 'Unavailable')
  assert.match(result.week, /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/)
})

test('provides a native ESM entry', async () => {
  const packageModule = await import('@skillnull/device-js')
  const result = await packageModule.default.Info({ info: ['UUID'] })

  assert.equal(typeof result.UUID, 'string')
})

test('preserves the default loading overlay and supports explicit opt-out', () => {
  const childScript = `
    let activeElement
    let appendCount = 0
    let removeCount = 0
    const body = {
      appendChild(element) {
        appendCount += 1
        activeElement = element
        element.parentNode = body
      },
      removeChild(element) {
        removeCount += 1
        if (activeElement === element) activeElement = undefined
        element.parentNode = undefined
      }
    }
    const documentScope = {
      body,
      createElement() {
        return { id: '', innerHTML: '', parentNode: undefined, style: {} }
      },
      getElementById() {
        return activeElement
      }
    }
    global.window = { document: documentScope, navigator: {} }
    const Device = require('./dist/device.js')
    Device.Info({ info: ['UUID'] })
      .then(() => Device.Info({ info: ['UUID'], showLoading: false }))
      .then(() => {
        process.stdout.write(JSON.stringify({
          appendCount,
          removeCount,
          loadingRemoved: activeElement === undefined
        }))
      })
  `
  const childResult = spawnSync(process.execPath, ['-e', childScript], {
    cwd: process.cwd(),
    encoding: 'utf8'
  })

  assert.equal(childResult.status, 0, childResult.stderr)
  assert.deepEqual(JSON.parse(childResult.stdout), {
    appendCount: 1,
    removeCount: 1,
    loadingRemoved: true
  })
})

test('keeps incompatible and server-only runtime dependencies out of browser bundles', () => {
  const browserBundle = readFileSync('dist/device.es.js', 'utf8')

  assert.doesNotMatch(browserBundle, /require\(["']jsdom["']\)/)
  assert.doesNotMatch(browserBundle, /\.replaceAll\(/)
  assert.doesNotMatch(browserBundle, /\.padStart\(/)
})

test('keeps the deployed demo bundle path valid', () => {
  const demoHtml = readFileSync('src/index.html', 'utf8')

  assert.match(
    demoHtml,
    /<script src="\.\/dist\/device\.es\.js\?v=[^"]+" type="module"><\/script>/u
  )
  assert.doesNotMatch(demoHtml, /<script\s+src="[^"]*\s+[^"]*"/u)
})
