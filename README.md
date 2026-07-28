# Samuel Ogulluk — Portfolio

Site personnel bilingue (EN/FR), React + TypeScript + Vite.

## Développement

```bash
npm install
npm run dev
```

L’onglet Utilitaire parle à l’API yt-dlp (`server/`). En local :

```bash
cd server
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 7860
```

`VITE_YTDLP_API` pointe vers cette API (voir `.env.development`).

## Build

```bash
npm run build
npm run preview
```

Déploiement du front sur GitHub Pages via Actions (`main`).

## API yt-dlp (Utilitaire)

Le site est statique : yt-dlp tourne dans `server/` (FastAPI + Docker).

Options d’hébergement :

1. **Hugging Face Space** — ajoute les secrets `HF_TOKEN` et `HF_USERNAME`, le workflow `.github/workflows/deploy-ytdlp-api.yml` pousse `server/`. Mets ensuite `VITE_YTDLP_API=https://<user>-yt-dlp-api.hf.space` dans `.env.production`.
2. **Render** — `render.yaml` à la racine.
3. **Local / VPS** — Docker dans `server/Dockerfile`.
