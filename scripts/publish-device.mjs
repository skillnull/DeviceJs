import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RELEASE = Object.freeze({
  branch: 'main',
  githubRepository: 'skillnull/DeviceJs',
  packageName: '@skillnull/device-js'
})
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.([1-9]\d*))?$/u
const WORKFLOW_POLL_INTERVAL_MILLISECONDS = 15_000
const WORKFLOW_TIMEOUT_MILLISECONDS = 15 * 60_000
const PUSH_MAX_ATTEMPTS = 3
const PUSH_RETRY_INTERVAL_MILLISECONDS = 2_000
const NPM_VERIFY_MAX_ATTEMPTS = 6
const NPM_VERIFY_INTERVAL_MILLISECONDS = 2_000

const runCommand = (command, argumentsList, options = {}) =>
  execFileSync(command, argumentsList, {
    encoding: 'utf8',
    stdio: 'inherit',
    ...options
  })

export const normalizeCommandOutput = (output) => output.replace(/(?:\r?\n)+$/u, '')

const readCommand = (command, argumentsList, options = {}) =>
  normalizeCommandOutput(execFileSync(command, argumentsList, { encoding: 'utf8', ...options }))

export const validateVersion = (version) => SEMVER_PATTERN.test(version)

export const getNextVersion = (version) => {
  const versionMatch = version.match(SEMVER_PATTERN)
  if (!versionMatch) throw new Error(`Invalid version ${version}.`)
  const [, majorVersion, minorVersion, patchVersion, prereleaseChannel, prereleaseSequence] = versionMatch
  if (prereleaseChannel && prereleaseSequence) {
    return `${majorVersion}.${minorVersion}.${patchVersion}-${prereleaseChannel}.${Number(prereleaseSequence) + 1}`
  }
  return `${majorVersion}.${minorVersion}.${Number(patchVersion) + 1}`
}

export const getDistributionTag = (version) => {
  const versionMatch = version.match(SEMVER_PATTERN)
  if (!versionMatch) throw new Error(`Invalid version ${version}.`)
  return versionMatch[4] || 'latest'
}

export const getNpmPublishArguments = (version) => [
  'publish',
  '--ignore-scripts',
  '--access',
  'public',
  '--tag',
  getDistributionTag(version)
]

export const resolveCandidateVersion = ({ currentTagCommit, currentVersion, versionPublished }) => {
  if (!versionPublished) return currentVersion
  if (!currentTagCommit) {
    throw new Error(`npm contains ${currentVersion}, but remote tag v${currentVersion} is missing.`)
  }
  return getNextVersion(currentVersion)
}

export const isResumableRelease = ({ branchAhead, currentVersion, headMessage, versionPublished }) =>
  branchAhead && !versionPublished && headMessage === `chore(release): v${currentVersion}`

export const selectQualityWorkflowRun = (workflowRuns, headCommit, headBranch) =>
  workflowRuns
    .filter((workflowRun) =>
      workflowRun?.name === 'Quality' &&
      workflowRun.head_sha === headCommit &&
      workflowRun.head_branch === headBranch &&
      workflowRun.event === 'push'
    )
    .sort((leftRun, rightRun) => Number(rightRun.id) - Number(leftRun.id))[0]

export const updatePackageVersion = (content, version, updateLockfile = false) => {
  if (!validateVersion(version)) throw new Error(`Invalid version ${version}.`)
  const metadata = JSON.parse(content)
  metadata.version = version
  if (updateLockfile) {
    if (!metadata.packages?.['']) throw new Error('package-lock.json is missing the root package metadata.')
    metadata.packages[''].version = version
  }
  return `${JSON.stringify(metadata, null, 2)}\n`
}

export const updateReadmeVersion = (content, version) => {
  if (!validateVersion(version)) throw new Error(`Invalid version ${version}.`)
  const packageReferencePattern = /(@skillnull\/device-js@)(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:alpha|beta|rc)\.[1-9]\d*)?/gu
  if (!packageReferencePattern.test(content)) {
    throw new Error('README does not contain a versioned @skillnull/device-js reference.')
  }
  packageReferencePattern.lastIndex = 0
  return content.replace(packageReferencePattern, `$1${version}`)
}

export const updateDemoAssetVersions = (content, version) => {
  if (!validateVersion(version)) throw new Error(`Invalid version ${version}.`)
  const assetVersionPattern = /(\?v=)[^"'&<>\s]+/gu
  const assetReferences = content.match(assetVersionPattern)
  if (!assetReferences?.length) {
    throw new Error('src/index.html does not contain versioned asset references.')
  }
  return content.replace(assetVersionPattern, `$1${version}`)
}

export const getDemoAssetVersionProblems = (content, version) => {
  const assetVersions = [...content.matchAll(/\?v=([^"'&<>\s]+)/gu)].map((match) => match[1])
  if (assetVersions.length === 0) return ['src/index.html does not contain versioned asset references.']
  const mismatchedVersion = assetVersions.find((assetVersion) => assetVersion !== version)
  return mismatchedVersion
    ? [`src/index.html contains asset version ${mismatchedVersion} instead of ${version}.`]
    : []
}

export const getVersionSyncProblems = ({ lockMetadata, packageMetadata, readmes }) => {
  const problems = []
  const expectedVersion = packageMetadata.version
  if (!validateVersion(expectedVersion)) problems.push(`Invalid package version ${expectedVersion}.`)
  if (lockMetadata.version !== expectedVersion) {
    problems.push(`package-lock.json version ${lockMetadata.version} does not match ${expectedVersion}.`)
  }
  if (lockMetadata.packages?.['']?.version !== expectedVersion) {
    problems.push(`package-lock root version does not match ${expectedVersion}.`)
  }
  const expectedReference = `${RELEASE.packageName}@${expectedVersion}`
  for (const [readmeName, readmeContent] of Object.entries(readmes)) {
    if (!readmeContent.includes(expectedReference)) {
      problems.push(`${readmeName} does not reference ${expectedReference}.`)
    }
    const versionReferences = [...readmeContent.matchAll(/@skillnull\/device-js@([^/'"\s]+)/gu)]
    const mismatchedVersion = versionReferences.find((reference) => reference[1] !== expectedVersion)?.[1]
    if (mismatchedVersion) {
      problems.push(`${readmeName} contains version ${mismatchedVersion}.`)
    }
  }
  return problems
}

export const getUnexpectedChangedPaths = (status, allowedPaths) => {
  const allowedPathSet = new Set(allowedPaths)
  return status
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((statusLine) => statusLine.slice(3))
    .filter((filePath) => !allowedPathSet.has(filePath))
}

const getReleaseFiles = (repositoryRoot) => ({
  demoIndex: resolve(repositoryRoot, 'src/index.html'),
  lockfile: resolve(repositoryRoot, 'package-lock.json'),
  package: resolve(repositoryRoot, 'package.json'),
  readmeChinese: resolve(repositoryRoot, 'README.md'),
  readmeEnglish: resolve(repositoryRoot, 'README.en.md')
})

const captureFiles = (releaseFiles) =>
  new Map(Object.values(releaseFiles).map((filePath) => [filePath, readFileSync(filePath, 'utf8')]))

const restoreFiles = (snapshots) => {
  for (const [filePath, content] of snapshots) writeFileSync(filePath, content)
}

const synchronizeReleaseFiles = (releaseFiles, snapshots, version) => {
  writeFileSync(
    releaseFiles.demoIndex,
    updateDemoAssetVersions(snapshots.get(releaseFiles.demoIndex), version)
  )
  writeFileSync(releaseFiles.package, updatePackageVersion(snapshots.get(releaseFiles.package), version))
  writeFileSync(
    releaseFiles.lockfile,
    updatePackageVersion(snapshots.get(releaseFiles.lockfile), version, true)
  )
  writeFileSync(
    releaseFiles.readmeChinese,
    updateReadmeVersion(snapshots.get(releaseFiles.readmeChinese), version)
  )
  writeFileSync(
    releaseFiles.readmeEnglish,
    updateReadmeVersion(snapshots.get(releaseFiles.readmeEnglish), version)
  )
}

const readVersionSyncProblems = (releaseFiles) =>
  getVersionSyncProblems({
    lockMetadata: JSON.parse(readFileSync(releaseFiles.lockfile, 'utf8')),
    packageMetadata: JSON.parse(readFileSync(releaseFiles.package, 'utf8')),
    readmes: {
      'README.en.md': readFileSync(releaseFiles.readmeEnglish, 'utf8'),
      'README.md': readFileSync(releaseFiles.readmeChinese, 'utf8')
    }
  })

const assertOnlyReleaseFilesChanged = (repositoryRoot, releaseFiles) => {
  const allowedPaths = Object.values(releaseFiles).map((filePath) =>
    filePath.slice(repositoryRoot.length + 1)
  )
  const status = readCommand('git', ['status', '--porcelain'], { cwd: repositoryRoot })
  const unexpectedPaths = getUnexpectedChangedPaths(status, allowedPaths)
  if (unexpectedPaths.length > 0) {
    throw new Error(`Unexpected files changed during release:\n${unexpectedPaths.join('\n')}`)
  }
}

const readRemoteTagCommit = (repositoryRoot, tagName) => {
  const result = spawnSync('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tagName}`, `refs/tags/${tagName}^{}`], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })
  if (result.status !== 0) throw new Error(`Unable to read remote tag ${tagName}.`)
  const references = result.stdout.trim().split(/\r?\n/u).filter(Boolean)
  const peeledReference = references.find((reference) => reference.endsWith(`refs/tags/${tagName}^{}`))
  return (peeledReference || references[0] || '').split(/\s+/u, 1)[0] || ''
}

const readLocalTagCommit = (repositoryRoot, tagName) => {
  const result = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${tagName}^{commit}`], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })
  if (result.status === 1) return ''
  if (result.status !== 0) throw new Error(`Unable to read local tag ${tagName}.`)
  return result.stdout.trim()
}

const readRemoteBranchCommit = (repositoryRoot, branchName) => {
  const result = spawnSync('git', ['ls-remote', '--heads', 'origin', `refs/heads/${branchName}`], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })
  if (result.status !== 0) throw new Error(`Unable to read remote branch ${branchName}.`)
  return result.stdout.trim().split(/\s+/u, 1)[0] || ''
}

const isCommitAncestor = (repositoryRoot, ancestorCommit, descendantCommit) =>
  spawnSync('git', ['merge-base', '--is-ancestor', ancestorCommit, descendantCommit], {
    cwd: repositoryRoot
  }).status === 0

const pushReferenceWithRetry = async ({
  argumentsList,
  expectedCommit,
  readRemoteCommit,
  referenceName,
  repositoryRoot
}) => {
  let lastPushError
  for (let attempt = 1; attempt <= PUSH_MAX_ATTEMPTS; attempt++) {
    try {
      runCommand('git', ['push', 'origin', ...argumentsList], { cwd: repositoryRoot })
    } catch (error) {
      lastPushError = error
    }
    try {
      if (readRemoteCommit() === expectedCommit) return
    } catch (error) {
      lastPushError = error
    }
    if (attempt < PUSH_MAX_ATTEMPTS) {
      await new Promise((resolveWait) => setTimeout(resolveWait, PUSH_RETRY_INTERVAL_MILLISECONDS))
    }
  }
  const pushMessage = lastPushError instanceof Error ? lastPushError.message : 'remote verification failed'
  throw new Error(`Unable to synchronize ${referenceName} after ${PUSH_MAX_ATTEMPTS} attempts: ${pushMessage}`)
}

const pushBranchWithRetry = (repositoryRoot, branchName, expectedCommit) =>
  pushReferenceWithRetry({
    argumentsList: [branchName],
    expectedCommit,
    readRemoteCommit: () => readRemoteBranchCommit(repositoryRoot, branchName),
    referenceName: `branch ${branchName}`,
    repositoryRoot
  })

const pushTagWithRetry = (repositoryRoot, tagName, expectedCommit) =>
  pushReferenceWithRetry({
    argumentsList: [tagName],
    expectedCommit,
    readRemoteCommit: () => readRemoteTagCommit(repositoryRoot, tagName),
    referenceName: `tag ${tagName}`,
    repositoryRoot
  })

const isVersionPublished = (repositoryRoot, version) => {
  const result = spawnSync('npm', ['view', `${RELEASE.packageName}@${version}`, 'version', '--json'], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })
  if (result.status === 0) return true
  const errorOutput = `${result.stdout}\n${result.stderr}`
  if (errorOutput.includes('E404')) return false
  throw new Error('Unable to verify the npm package version.')
}

const waitForPublishedVersion = async (repositoryRoot, version) => {
  for (let attempt = 1; attempt <= NPM_VERIFY_MAX_ATTEMPTS; attempt++) {
    if (isVersionPublished(repositoryRoot, version)) return true
    if (attempt < NPM_VERIFY_MAX_ATTEMPTS) {
      await new Promise((resolveWait) => setTimeout(resolveWait, NPM_VERIFY_INTERVAL_MILLISECONDS))
    }
  }
  return false
}

const waitForQualityWorkflow = async (headCommit, headBranch) => {
  const deadline = Date.now() + WORKFLOW_TIMEOUT_MILLISECONDS
  const endpoint = new URL(`https://api.github.com/repos/${RELEASE.githubRepository}/actions/workflows/quality.yml/runs`)
  endpoint.searchParams.set('event', 'push')
  endpoint.searchParams.set('branch', headBranch)
  endpoint.searchParams.set('head_sha', headCommit)
  endpoint.searchParams.set('per_page', '10')

  while (Date.now() < deadline) {
    const response = await fetch(endpoint, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'DeviceJs release gate',
        'x-github-api-version': '2022-11-28'
      },
      signal: AbortSignal.timeout(20_000)
    })
    if (!response.ok) throw new Error(`Unable to read GitHub Quality status (HTTP ${response.status}).`)
    const responseBody = await response.json()
    const workflowRuns = Array.isArray(responseBody?.workflow_runs) ? responseBody.workflow_runs : []
    const workflowRun = selectQualityWorkflowRun(workflowRuns, headCommit, headBranch)

    if (workflowRun?.status === 'completed') {
      if (workflowRun.conclusion === 'success') return
      throw new Error(
        `GitHub Quality failed for ${headBranch} (${workflowRun.conclusion || 'unknown'}): ` +
        `${workflowRun.html_url || headBranch}`
      )
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, WORKFLOW_POLL_INTERVAL_MILLISECONDS))
  }
  throw new Error(`Timed out waiting for GitHub Quality on ${headBranch}.`)
}

const assertReleaseContext = (repositoryRoot) => {
  const branchName = readCommand('git', ['branch', '--show-current'], { cwd: repositoryRoot })
  if (branchName !== RELEASE.branch) throw new Error(`Publish only from ${RELEASE.branch}.`)
  if (readCommand('git', ['status', '--porcelain'], { cwd: repositoryRoot }) !== '') {
    throw new Error('The working tree must be clean before publishing.')
  }
  runCommand('git', ['fetch', '--no-tags', 'origin', RELEASE.branch], { cwd: repositoryRoot })
  const headCommit = readCommand('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })
  const remoteCommit = readCommand('git', ['rev-parse', `origin/${RELEASE.branch}`], { cwd: repositoryRoot })
  if (headCommit === remoteCommit) return { headCommit, resumable: false }

  const packageMetadata = JSON.parse(readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8'))
  const headMessage = readCommand('git', ['log', '-1', '--pretty=%s'], { cwd: repositoryRoot })
  const resumable = isResumableRelease({
    branchAhead: isCommitAncestor(repositoryRoot, remoteCommit, headCommit),
    currentVersion: packageMetadata.version,
    headMessage,
    versionPublished: isVersionPublished(repositoryRoot, packageMetadata.version)
  })
  if (!resumable) throw new Error(`Local ${RELEASE.branch} must match origin/${RELEASE.branch}.`)
  return { headCommit, resumable: true }
}

const prepareCandidateVersion = (repositoryRoot, currentVersion) => {
  const prefixedTagCommit = readRemoteTagCommit(repositoryRoot, `v${currentVersion}`)
  const legacyTagCommit = readRemoteTagCommit(repositoryRoot, currentVersion)
  if (prefixedTagCommit && legacyTagCommit && prefixedTagCommit !== legacyTagCommit) {
    throw new Error(`Tags v${currentVersion} and ${currentVersion} point to different commits.`)
  }
  return resolveCandidateVersion({
    currentTagCommit: prefixedTagCommit || legacyTagCommit,
    currentVersion,
    versionPublished: isVersionPublished(repositoryRoot, currentVersion)
  })
}

const publish = async (argumentsList) => {
  const nodeMajorVersion = Number(process.versions.node.split('.')[0])
  if (nodeMajorVersion < 20) throw new Error('Publishing requires Node.js 20 or newer.')
  const dryRun = argumentsList.includes('--dry-run')
  const prepareOnly = argumentsList.includes('--prepare-only')
  const versionArgumentIndex = argumentsList.indexOf('--version')
  const requestedVersion = versionArgumentIndex >= 0 ? argumentsList[versionArgumentIndex + 1] : ''
  const knownArguments = new Set(['--dry-run', '--prepare-only', '--version', requestedVersion])
  const unknownArguments = argumentsList.filter((argument) => !knownArguments.has(argument))
  if (unknownArguments.length > 0) throw new Error(`Unsupported arguments: ${unknownArguments.join(', ')}`)
  if (versionArgumentIndex >= 0 && !validateVersion(requestedVersion)) {
    throw new Error(`Invalid release version ${requestedVersion || '(missing)'}.`)
  }

  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const releaseContext = assertReleaseContext(repositoryRoot)
  const releaseFiles = getReleaseFiles(repositoryRoot)
  const snapshots = captureFiles(releaseFiles)
  const packageMetadata = JSON.parse(snapshots.get(releaseFiles.package))
  const synchronizedProblems = readVersionSyncProblems(releaseFiles)
  if (synchronizedProblems.length > 0) throw new Error(synchronizedProblems.join('\n'))
  let candidateVersion = requestedVersion || prepareCandidateVersion(repositoryRoot, packageMetadata.version)
  let packagePublished = false
  let releaseCommitPrepared = false

  if (!dryRun && !releaseContext.resumable) {
    await waitForQualityWorkflow(releaseContext.headCommit, RELEASE.branch)
  }

  if (!dryRun && !requestedVersion) {
    if (process.stdin.isTTY !== true || process.stdout.isTTY !== true) {
      throw new Error('Interactive publishing requires a terminal or an explicit --version.')
    }
    const prompt = createInterface({ input: process.stdin, output: process.stdout })
    const versionResponse = (await prompt.question(`Release version [${candidateVersion}]: `)).trim()
    prompt.close()
    if (versionResponse) candidateVersion = versionResponse
  }
  if (!validateVersion(candidateVersion)) throw new Error(`Invalid release version ${candidateVersion}.`)
  if (isVersionPublished(repositoryRoot, candidateVersion)) {
    throw new Error(`${RELEASE.packageName}@${candidateVersion} is already published.`)
  }

  try {
    synchronizeReleaseFiles(releaseFiles, snapshots, candidateVersion)
    const candidateProblems = readVersionSyncProblems(releaseFiles)
    candidateProblems.push(
      ...getDemoAssetVersionProblems(
        readFileSync(releaseFiles.demoIndex, 'utf8'),
        candidateVersion
      )
    )
    if (candidateProblems.length > 0) throw new Error(candidateProblems.join('\n'))
    runCommand('npm', ['run', 'check'], { cwd: repositoryRoot })
    assertOnlyReleaseFilesChanged(repositoryRoot, releaseFiles)
    const hasReleaseFileChanges = readCommand('git', ['status', '--porcelain'], {
      cwd: repositoryRoot
    }) !== ''

    if (dryRun) {
      return { dryRun: true, version: candidateVersion }
    }

    const prompt = createInterface({ input: process.stdin, output: process.stdout })
    const confirmation = (await prompt.question(`Type "${candidateVersion}" to publish: `)).trim()
    prompt.close()
    if (confirmation !== candidateVersion) throw new Error('Release cancelled. No package was published.')

    let releaseCommit = readCommand('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })
    if (hasReleaseFileChanges) {
      runCommand('git', ['add', ...Object.values(releaseFiles)], { cwd: repositoryRoot })
      runCommand('git', ['commit', '-m', `chore(release): v${candidateVersion}`], { cwd: repositoryRoot })
      releaseCommit = readCommand('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })
    }
    releaseCommitPrepared = true
    if (prepareOnly) {
      return {
        distributionTag: getDistributionTag(candidateVersion),
        dryRun: false,
        prepared: true,
        version: candidateVersion
      }
    }
    await pushBranchWithRetry(repositoryRoot, RELEASE.branch, releaseCommit)
    await waitForQualityWorkflow(releaseCommit, RELEASE.branch)

    const releaseTag = `v${candidateVersion}`
    const localTagCommit = readLocalTagCommit(repositoryRoot, releaseTag)
    const remoteTagCommit = readRemoteTagCommit(repositoryRoot, releaseTag)
    if (localTagCommit && localTagCommit !== releaseCommit) {
      throw new Error(`${releaseTag} already points to another local commit.`)
    }
    if (remoteTagCommit && remoteTagCommit !== releaseCommit) {
      throw new Error(`${releaseTag} already points to another commit.`)
    }
    if (!localTagCommit) {
      runCommand('git', ['tag', '-a', releaseTag, '-m', releaseTag], { cwd: repositoryRoot })
    }
    if (!remoteTagCommit) {
      await pushTagWithRetry(repositoryRoot, releaseTag, releaseCommit)
    }
    await waitForQualityWorkflow(releaseCommit, releaseTag)

    const distributionTag = getDistributionTag(candidateVersion)
    try {
      runCommand('npm', getNpmPublishArguments(candidateVersion), { cwd: repositoryRoot })
      packagePublished = true
    } catch (error) {
      if (!isVersionPublished(repositoryRoot, candidateVersion)) throw error
      packagePublished = true
    }
    if (!await waitForPublishedVersion(repositoryRoot, candidateVersion)) {
      throw new Error('npm did not report the published version after publication.')
    }
    if (readRemoteTagCommit(repositoryRoot, releaseTag) !== releaseCommit) {
      throw new Error('The remote Git tag is not synchronized with the published commit.')
    }
    return { distributionTag, dryRun: false, version: candidateVersion }
  } catch (error) {
    if (!releaseCommitPrepared) restoreFiles(snapshots)
    if (!packagePublished && releaseCommitPrepared) {
      const errorMessage = error instanceof Error ? error.message : 'Package publication failed.'
      throw new Error(
        `${errorMessage}\nThe release commit and any created tag were retained for a safe retry. ` +
        'npm was not published.'
      )
    }
    if (packagePublished) {
      const errorMessage = error instanceof Error ? error.message : 'Release synchronization failed.'
      throw new Error(`${errorMessage}\nnpm is already published; do not publish this version again.`)
    }
    throw error
  } finally {
    if (dryRun) restoreFiles(snapshots)
  }
}

const verifyRelease = async (version, releaseCommit, releaseTag) => {
  if (!validateVersion(version)) throw new Error(`Invalid release version ${version}.`)
  if (!/^[0-9a-f]{40}$/u.test(releaseCommit)) throw new Error('Invalid release commit.')
  if (releaseTag !== `v${version}`) throw new Error(`Invalid release tag ${releaseTag}.`)
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  if (!await waitForPublishedVersion(repositoryRoot, version)) {
    throw new Error('npm did not report the published version after publication.')
  }
  if (readRemoteTagCommit(repositoryRoot, releaseTag) !== releaseCommit) {
    throw new Error('The remote Git tag is not synchronized with the published commit.')
  }
}

const entryPath = process.argv[1]
const isDirectExecution = (() => {
  if (!entryPath || entryPath === '-') return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(entryPath)).href
  } catch {
    return false
  }
})()

if (isDirectExecution) {
  try {
    const argumentsList = process.argv.slice(2)
    if (argumentsList[0] === '--wait-quality') {
      const [, headCommit, headBranch] = argumentsList
      if (!/^[0-9a-f]{40}$/u.test(headCommit || '') || !headBranch) {
        throw new Error('Invalid Quality workflow target.')
      }
      await waitForQualityWorkflow(headCommit, headBranch)
      process.stdout.write(`QUALITY PASSED: ${headBranch} (${headCommit})\n`)
      process.exit(0)
    }
    if (argumentsList[0] === '--verify-release') {
      const [, version, releaseCommit, releaseTag] = argumentsList
      await verifyRelease(version, releaseCommit, releaseTag)
      process.stdout.write(`RELEASE VERIFIED: ${RELEASE.packageName}@${version}\n`)
      process.exit(0)
    }
    const result = await publish(argumentsList)
    const message = result.dryRun
      ? `DRY RUN PASSED: ${RELEASE.packageName}@${result.version}`
      : result.prepared
        ? `RELEASE PREPARED: ${RELEASE.packageName}@${result.version}`
        : `PUBLISHED: ${RELEASE.packageName}@${result.version} (${result.distributionTag})`
    process.stdout.write(`${message}\n`)
  } catch (error) {
    process.stderr.write(`PUBLISH BLOCKED: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    process.exitCode = 1
  }
}
