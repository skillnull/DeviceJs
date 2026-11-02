import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  getDistributionTag,
  getNextVersion,
  getUnexpectedChangedPaths,
  getVersionSyncProblems,
  normalizeCommandOutput,
  resolveCandidateVersion,
  updatePackageVersion,
  updateReadmeVersion,
  validateVersion
} from './publish-device.mjs'

test('exposes the one-command publishing entry', () => {
  const packageMetadata = JSON.parse(
    readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8')
  )

  assert.equal(packageMetadata.scripts.publish, 'node scripts/publish-device.mjs')
})

test('can be imported from standard input without starting a release', () => {
  const importResult = spawnSync(
    process.execPath,
    ['--input-type=module', '-'],
    {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      encoding: 'utf8',
      input: "import './scripts/publish-device.mjs'\n"
    }
  )

  assert.equal(importResult.status, 0, importResult.stderr)
  assert.equal(importResult.stdout, '')
})

test('validates and increments supported semantic versions', () => {
  assert.equal(validateVersion('1.2.4'), true)
  assert.equal(validateVersion('1.3.0-beta.2'), true)
  assert.equal(validateVersion('v1.2.4'), false)
  assert.equal(getNextVersion('1.2.3'), '1.2.4')
  assert.equal(getNextVersion('1.3.0-rc.2'), '1.3.0-rc.3')
})

test('maps release versions to npm distribution tags', () => {
  assert.equal(getDistributionTag('1.2.4'), 'latest')
  assert.equal(getDistributionTag('1.3.0-alpha.1'), 'alpha')
  assert.equal(getDistributionTag('1.3.0-beta.1'), 'beta')
  assert.equal(getDistributionTag('1.3.0-rc.1'), 'rc')
})

test('selects the next version after a synchronized published release', () => {
  assert.equal(resolveCandidateVersion({
    currentTagCommit: 'abc123',
    currentVersion: '1.2.3',
    versionPublished: true
  }), '1.2.4')
  assert.equal(resolveCandidateVersion({
    currentTagCommit: '',
    currentVersion: '1.2.3',
    versionPublished: false
  }), '1.2.3')
  assert.throws(
    () => resolveCandidateVersion({
      currentTagCommit: '',
      currentVersion: '1.2.3',
      versionPublished: true
    }),
    /remote tag v1\.2\.3 is missing/u
  )
})

test('synchronizes package and lockfile versions', () => {
  const packageContent = '{"name":"@skillnull/device-js","version":"1.2.3"}'
  const lockfileContent = '{"name":"@skillnull/device-js","version":"1.2.3","packages":{"":{"version":"1.2.3"}}}'

  assert.equal(JSON.parse(updatePackageVersion(packageContent, '1.2.4')).version, '1.2.4')
  const updatedLockfile = JSON.parse(updatePackageVersion(lockfileContent, '1.2.4', true))
  assert.equal(updatedLockfile.version, '1.2.4')
  assert.equal(updatedLockfile.packages[''].version, '1.2.4')
})

test('synchronizes every versioned CDN reference in a README', () => {
  const readme = [
    'https://unpkg.com/@skillnull/device-js@1.2.3/dist/device.js',
    'https://cdn.jsdelivr.net/npm/@skillnull/device-js@1.2.3/dist/device.es.js'
  ].join('\n')
  const updatedReadme = updateReadmeVersion(readme, '1.2.4')

  assert.doesNotMatch(updatedReadme, /1\.2\.3/u)
  assert.equal(updatedReadme.match(/@skillnull\/device-js@1\.2\.4/gu)?.length, 2)
})

test('detects mismatched package, lockfile, and documentation versions', () => {
  const problems = getVersionSyncProblems({
    lockMetadata: { version: '1.2.2', packages: { '': { version: '1.2.2' } } },
    packageMetadata: { version: '1.2.3' },
    readmes: { 'README.md': '@skillnull/device-js@1.1.0' }
  })

  assert.equal(problems.length, 4)
})

test('blocks unrelated changes during release preparation', () => {
  const unexpectedPaths = getUnexpectedChangedPaths(
    ' M package.json\n M README.md\n M src/device.ts',
    ['package.json', 'README.md']
  )

  assert.deepEqual(unexpectedPaths, ['src/device.ts'])
})

test('preserves the leading status column when command output is normalized', () => {
  const status = normalizeCommandOutput(' M README.en.md\n')

  assert.equal(status, ' M README.en.md')
  assert.deepEqual(getUnexpectedChangedPaths(status, ['README.en.md']), [])
})
