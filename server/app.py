import os
import re
import shutil
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from fastapi import BackgroundTasks, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from yt_dlp import YoutubeDL

ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "https://samuelogulluk.github.io,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]

YT_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"}
YT_ID_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?(?:[^#]*&)?v=|embed/|shorts/|live/)|youtu\.be/|youtube\.com/v/)([A-Za-z0-9_-]{11})"
)

app = FastAPI(title="yt-dlp API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class InfoRequest(BaseModel):
    url: str = Field(..., min_length=5)
    mode: str = Field("video", pattern="^(video|audio)$")


def normalize_url(raw):
    text = (raw or "").strip()
    if not text:
        raise HTTPException(400, "URL manquante")
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", text):
        return f"https://www.youtube.com/watch?v={text}"
    if not text.startswith(("http://", "https://")):
        text = "https://" + text
    try:
        parsed = urlparse(text)
    except Exception as exc:
        raise HTTPException(400, "URL invalide") from exc
    host = (parsed.hostname or "").lower()
    if host not in YT_HOSTS and not host.endswith(".youtube.com"):
        raise HTTPException(400, "Seuls les liens YouTube sont acceptés")
    if not YT_ID_RE.search(text) and "v=" not in text:
        raise HTTPException(400, "Impossible d'extraire l'identifiant vidéo")
    return text


def ydl_base_opts():
    node = os.getenv("YTDLP_JS_RUNTIME", "")
    for candidate in (node, "/usr/bin/node", "/exec-daemon/node", shutil.which("node") or ""):
        if candidate and Path(candidate).exists():
            node = candidate
            break
    else:
        node = ""
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "noplaylist": True,
        "extractor_args": {"youtube": {"player_client": ["android", "web", "mweb", "tv"]}},
    }
    if node:
        opts["js_runtimes"] = {"node": {"path": node}}
    return opts


def format_label(fmt, mode):
    height = fmt.get("height")
    abr = fmt.get("abr")
    ext = fmt.get("ext") or "?"
    if mode == "audio":
        bitrate = f"{int(abr)} kbps" if abr else "audio"
        return f"{bitrate} · {ext}"
    if height:
        return f"{height}p · {ext}"
    note = fmt.get("format_note") or fmt.get("resolution") or "video"
    return f"{note} · {ext}"


def pick_formats(info, mode):
    formats = info.get("formats") or []
    picked = []
    seen = set()

    if mode == "audio":
        candidates = [
            f
            for f in formats
            if f.get("url")
            and f.get("acodec") not in (None, "none")
            and f.get("vcodec") in (None, "none")
        ]
        candidates.sort(key=lambda f: (f.get("abr") or 0), reverse=True)
        if not candidates:
            candidates = [
                f
                for f in formats
                if f.get("url") and f.get("acodec") not in (None, "none") and f.get("vcodec") not in (None, "none")
            ]
            candidates.sort(key=lambda f: (f.get("abr") or 0), reverse=True)
    else:
        candidates = [
            f
            for f in formats
            if f.get("url")
            and f.get("vcodec") not in (None, "none")
            and f.get("acodec") not in (None, "none")
            and (f.get("ext") in ("mp4", "webm", "mkv") or f.get("protocol") in ("https", "http"))
        ]
        candidates.sort(key=lambda f: (f.get("height") or 0, f.get("tbr") or 0), reverse=True)
        if not candidates:
            video_only = [
                f
                for f in formats
                if f.get("vcodec") not in (None, "none") and f.get("acodec") in (None, "none")
            ]
            video_only.sort(key=lambda f: (f.get("height") or 0), reverse=True)
            if video_only and any(f.get("acodec") not in (None, "none") for f in formats):
                best_h = video_only[0].get("height")
                picked.append(
                    {
                        "id": f"bv*[height<={best_h}]+ba/b",
                        "label": f"{best_h or '?'}p · mp4 (fusion)",
                        "ext": "mp4",
                        "height": best_h,
                        "filesize": None,
                    }
                )

    for fmt in candidates:
        fid = str(fmt.get("format_id"))
        if fid in seen:
            continue
        seen.add(fid)
        picked.append(
            {
                "id": fid,
                "label": format_label(fmt, mode),
                "ext": fmt.get("ext") or ("m4a" if mode == "audio" else "mp4"),
                "height": fmt.get("height"),
                "abr": fmt.get("abr"),
                "filesize": fmt.get("filesize") or fmt.get("filesize_approx"),
            }
        )
        if len(picked) >= 12:
            break
    return picked


def cleanup_dir(path):
    shutil.rmtree(path, ignore_errors=True)


@app.get("/")
def root():
    return {"ok": True, "engine": "yt-dlp", "endpoints": ["/health", "/info", "/download"]}


@app.get("/health")
def health():
    return {"ok": True, "engine": "yt-dlp"}


@app.post("/info")
def info(body: InfoRequest):
    url = normalize_url(body.url)
    opts = {**ydl_base_opts(), "skip_download": True}
    try:
        with YoutubeDL(opts) as ydl:
            data = ydl.extract_info(url, download=False)
    except Exception as exc:
        msg = str(exc)
        if "Sign in" in msg or "not a bot" in msg:
            raise HTTPException(
                403,
                "YouTube demande une vérification anti-bot pour cette vidéo. Réessaie plus tard ou avec une autre URL.",
            ) from exc
        raise HTTPException(502, f"yt-dlp n'a pas pu lire cette vidéo: {msg[:240]}") from exc

    if data.get("_type") == "playlist":
        entries = [e for e in (data.get("entries") or []) if e]
        if not entries:
            raise HTTPException(404, "Playlist vide")
        data = entries[0]

    formats = pick_formats(data, body.mode)
    if not formats:
        raise HTTPException(404, "Aucun format téléchargeable trouvé")

    thumbs = data.get("thumbnails") or []
    thumbnail = (thumbs[-1].get("url") if thumbs else None) or data.get("thumbnail")

    return {
        "id": data.get("id"),
        "title": data.get("title") or "youtube-video",
        "uploader": data.get("uploader") or data.get("channel"),
        "duration": data.get("duration"),
        "thumbnail": thumbnail,
        "webpage_url": data.get("webpage_url") or url,
        "formats": formats,
    }


@app.get("/download")
def download(
    background_tasks: BackgroundTasks,
    url: str = Query(...),
    format_id: str = Query(...),
    mode: str = Query("video", pattern="^(video|audio)$"),
    title: str = Query("youtube-video"),
):
    media_url = normalize_url(url)
    safe = re.sub(r'[<>:"/\\|?*\x00-\x1f]+', "", title).strip()[:80] or "youtube-video"
    tmp = tempfile.mkdtemp(prefix="ytdlp-")
    outtmpl = str(Path(tmp) / "%(title).80B.%(ext)s")
    background_tasks.add_task(cleanup_dir, tmp)

    if mode == "audio":
        opts = {
            **ydl_base_opts(),
            "format": format_id if ("+" in format_id or "/" in format_id) else f"{format_id}/bestaudio/best",
            "outtmpl": outtmpl,
            "postprocessors": [
                {"key": "FFmpegExtractAudio", "preferredcodec": "m4a", "preferredquality": "192"}
            ],
        }
        default_ext = "m4a"
    else:
        opts = {
            **ydl_base_opts(),
            "format": format_id if ("+" in format_id or "/" in format_id) else f"{format_id}/best",
            "outtmpl": outtmpl,
            "merge_output_format": "mp4",
        }
        default_ext = "mp4"

    try:
        with YoutubeDL(opts) as ydl:
            info_data = ydl.extract_info(media_url, download=True)
            path = Path(ydl.prepare_filename(info_data))
            if mode == "audio":
                candidates = list(Path(tmp).glob("*"))
                audio = [p for p in candidates if p.suffix.lower() in {".m4a", ".mp3", ".opus", ".webm", ".ogg"}]
                path = audio[0] if audio else path.with_suffix(".m4a")
            elif not path.exists():
                media = [p for p in Path(tmp).glob("*") if p.is_file()]
                if not media:
                    raise FileNotFoundError("fichier introuvable après téléchargement")
                path = media[0]
    except HTTPException:
        raise
    except Exception as exc:
        msg = str(exc)
        if "Sign in" in msg or "not a bot" in msg:
            raise HTTPException(403, "YouTube bloque le téléchargement (anti-bot).") from exc
        raise HTTPException(502, f"Échec du téléchargement: {msg[:240]}") from exc

    if not path.exists():
        raise HTTPException(500, "Fichier téléchargé introuvable")

    filename = f"{safe}{path.suffix or ('.' + default_ext)}"
    return FileResponse(path, media_type="application/octet-stream", filename=filename)
