# Samuel Ogulluk — Portfolio

Site personnel bilingue (EN/FR), React + TypeScript + Vite.

## Branches

| Branche | Rôle | Déployée |
|---------|------|----------|
| `main` | Portfolio classique (scroll) + onglet Utilitaire | [samuelogulluk.github.io](https://samuelogulluk.github.io) |
| `cursor/pixel-den-redesign-4a10` | **Dev** — tanière pixel (parallaxe 2D) + scène 3D + Utilitaire | non |

Pendant le développement de la tanière, **main reste le site public**. Quand la tanière sera prête, on remplacera `App.tsx` sur `main`.

### Lier ce dossier au dépôt Git (WSL)

```bash
cd /mnt/c/Users/samue/Documents/sites/SamuelOgulluk.github.io-cursor-pixel-den-redesign-4a10
git init
git remote add origin https://github.com/SamuelOgulluk/SamuelOgulluk.github.io.git
git fetch origin
git branch -f cursor/pixel-den-redesign-4a10 origin/cursor/pixel-den-redesign-4a10
git symbolic-ref HEAD refs/heads/cursor/pixel-den-redesign-4a10
git reset --mixed HEAD
git branch --track main origin/main
```

Sous Windows PowerShell (si Git installé) : `scripts/link-git-repo.ps1`

### Garder le contenu portfolio à jour depuis main

```bash
npm run sync-main
```

Copie `constants.ts`, les sections portfolio et `cv.pdf` depuis `main`, en préservant les blocs `den` / `loutone`.

## Développement

```bash
npm install
npm run dev
```

- **Mode normal** : parallaxe 2D (`den-color.webp` + `den-depth.webp`)
- **Mode bake** : `http://localhost:5173/?bake` — scène Three.js pour régénérer les assets

L’onglet Utilitaire parle à l’API yt-dlp (`server/`). En local :

```bash
cd server
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 7860
```

`VITE_YTDLP_API` pointe vers cette API (voir `.env.development`).

## Build & bake

```bash
npm run build
npm run preview
npm run bake-den   # capture 3D → webp parallaxe (Puppeteer + Python)
```

Déploiement du front sur GitHub Pages via Actions (`main` uniquement).

## API yt-dlp (Utilitaire)

Le site est statique : yt-dlp tourne dans `server/` (FastAPI + Docker).

Options d’hébergement :

1. **Hugging Face Space** — secrets `HF_TOKEN` + `HF_USERNAME`, workflow `.github/workflows/deploy-ytdlp-api.yml`
2. **Render** — `render.yaml` à la racine
3. **Local / VPS** — Docker dans `server/Dockerfile`
