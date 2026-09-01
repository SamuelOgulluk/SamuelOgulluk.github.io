#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export GIT_AUTHOR_NAME='Samuel Ogulluk'
export GIT_AUTHOR_EMAIL='85449107+SamuelOgulluk@users.noreply.github.com'
export GIT_COMMITTER_NAME='Samuel Ogulluk'
export GIT_COMMITTER_EMAIL='85449107+SamuelOgulluk@users.noreply.github.com'

git add README.md package.json scripts/ src/components/Navbar.tsx src/den/DenScene.tsx src/den/KenneyProp.tsx

git commit -m "$(cat <<'EOF'
Fix dev tooling and document two-branch workflow.

Scripts use repo-relative paths for local/WSL bakes, sync-main keeps portfolio content aligned with main, and the den scene uses available keyboard/laptop models.
EOF
)"

git push -u origin cursor/pixel-den-redesign-4a10

git push origin --delete cursor/utilitaire-youtube-878b cursor/redesign-clarte-portfolio-878b

git branch -D cursor/utilitaire-youtube-878b cursor/redesign-clarte-portfolio-878b 2>/dev/null || true

echo "--- branches ---"
git branch -a
