# Branche ce dossier sur le dépôt GitHub (sans toucher à main).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Remote = "https://github.com/SamuelOgulluk/SamuelOgulluk.github.io.git"
$DevBranch = "cursor/pixel-den-redesign-4a10"

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
  Write-Host "Git introuvable. Installe-le puis relance ce script."
  exit 1
}

Set-Location $Root
if (-not (Test-Path ".git")) {
  git init
  git remote add origin $Remote
}

git fetch origin
git checkout -B $DevBranch
git branch -f main origin/main 2>$null
Write-Host ""
Write-Host "Branches locales :"
git branch -vv
Write-Host ""
Write-Host "main          -> site en prod (scroll classique)"
Write-Host "$DevBranch -> tanière 3D (ce dossier)"
Write-Host ""
Write-Host "Dev : npm run dev"
Write-Host "Sync contenu portfolio depuis main : npm run sync-main"
