#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="$HOME/.local/bin:$PATH"

if ! gh auth status >/dev/null 2>&1; then
  echo "Connexion GitHub requise. Lance : gh auth login"
  echo "Puis relance : bash scripts/git-push-dev.sh"
  exit 1
fi

gh auth setup-git

git push -u origin cursor/pixel-den-redesign-4a10

for br in cursor/utilitaire-youtube-878b cursor/redesign-clarte-portfolio-878b; do
  git push origin --delete "$br" 2>/dev/null || true
  git branch -D "$br" 2>/dev/null || true
done

echo "--- branches restantes ---"
git branch -a
