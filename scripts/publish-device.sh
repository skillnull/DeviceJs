#!/bin/sh

set -eu

node scripts/publish-device.mjs --prepare-only "$@"

for release_argument in "$@"; do
  if [ "$release_argument" = "--dry-run" ]; then
    exit 0
  fi
done

release_branch="master"
release_version=$(node -p "require('./package.json').version")
release_commit=$(git rev-parse HEAD)
release_tag="v${release_version}"

case "$release_version" in
  *-alpha.*) distribution_tag="alpha" ;;
  *-beta.*) distribution_tag="beta" ;;
  *-rc.*) distribution_tag="rc" ;;
  *) distribution_tag="latest" ;;
esac

git push origin "$release_branch"
node scripts/publish-device.mjs --wait-quality "$release_commit" "$release_branch"

if local_tag_commit=$(git rev-parse --verify --quiet "${release_tag}^{commit}"); then
  if [ "$local_tag_commit" != "$release_commit" ]; then
    echo "PUBLISH BLOCKED: ${release_tag} already points to another local commit." >&2
    exit 1
  fi
else
  git tag -a "$release_tag" -m "$release_tag"
fi

git push origin "$release_tag"
node scripts/publish-device.mjs --wait-quality "$release_commit" "$release_tag"
npm publish --ignore-scripts --access public --tag "$distribution_tag"
node scripts/publish-device.mjs --verify-release "$release_version" "$release_commit" "$release_tag"

echo "PUBLISHED: @skillnull/device-js@${release_version} (${distribution_tag})"
