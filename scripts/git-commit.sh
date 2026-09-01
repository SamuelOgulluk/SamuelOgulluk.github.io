#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export GIT_AUTHOR_NAME='Samuel Ogulluk'
export GIT_AUTHOR_EMAIL='85449107+SamuelOgulluk@users.noreply.github.com'
export GIT_COMMITTER_NAME='Samuel Ogulluk'
export GIT_COMMITTER_EMAIL='85449107+SamuelOgulluk@users.noreply.github.com'

git add "$@"
git commit -m "$2" 2>/dev/null || git commit -m "$1"
