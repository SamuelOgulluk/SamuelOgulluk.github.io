import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/App';

const PIPED_API_HOSTS = [
  'https://api.piped.private.coffee',
];

const YT_ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/|youtube\.com\/v\/)([A-Za-z0-9_-]{11})/;

function extractVideoId(raw) {
  const input = raw.trim();
  if (!input) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    if (url.hostname.includes('youtu')) {
      const fromPath = url.pathname.match(/\/(shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
      if (fromPath) return fromPath[2];
      const v = url.searchParams.get('v');
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    }
  } catch {
    // fall through
  }
  const match = input.match(YT_ID_RE);
  return match ? match[1] : null;
}

function pickStreams(data, mode) {
  const videos = Array.isArray(data.videoStreams) ? data.videoStreams : [];
  const audios = Array.isArray(data.audioStreams) ? data.audioStreams : [];

  if (mode === 'audio') {
    const audio = audios
      .filter((s) => s.url && (s.mimeType || '').includes('audio'))
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    if (audio.length) return audio.map((s) => ({ ...s, kind: 'audio' }));
    // fallback: muxed low quality video if no dedicated audio
    return videos
      .filter((s) => s.url && !s.videoOnly && (s.mimeType || '').includes('mp4'))
      .map((s) => ({ ...s, kind: 'video' }));
  }

  return videos
    .filter((s) => s.url && !s.videoOnly && ((s.mimeType || '').includes('mp4') || (s.mimeType || '').includes('webm')))
    .sort((a, b) => {
      const qa = parseInt(String(a.quality), 10) || 0;
      const qb = parseInt(String(b.quality), 10) || 0;
      return qb - qa;
    })
    .map((s) => ({ ...s, kind: 'video' }));
}

function safeFilename(name, ext) {
  const base = (name || 'youtube-video')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return `${base || 'youtube-video'}.${ext}`;
}

const YoutubeDownloader = () => {
  const { t } = useLanguage();
  const u = t.utility;

  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('video');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState('');

  const selectedStream = useMemo(
    () => streams.find((s) => s.url === selected) || streams[0] || null,
    [streams, selected]
  );

  const applyMode = (data, nextMode) => {
    const options = pickStreams(data, nextMode);
    setStreams(options);
    setSelected(options[0]?.url || '');
    if (!options.length) setError(u.noStreams);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    if (rawData) applyMode(rawData, nextMode);
  };

  const analyze = async (event) => {
    event.preventDefault();
    setError('');
    setInfo(null);
    setRawData(null);
    setStreams([]);
    setSelected('');
    setProgress(0);

    const id = extractVideoId(url);
    if (!id) {
      setError(u.invalidUrl);
      return;
    }

    setLoading(true);
    try {
      let lastError = null;
      let data = null;
      for (const host of PIPED_API_HOSTS) {
        try {
          const res = await fetch(`${host}/streams/${id}`);
          if (!res.ok) {
            lastError = new Error(`HTTP ${res.status}`);
            continue;
          }
          data = await res.json();
          if (data?.error) {
            lastError = new Error(data.message || data.error);
            data = null;
            continue;
          }
          break;
        } catch (err) {
          lastError = err;
        }
      }

      if (!data) throw lastError || new Error('unavailable');

      setRawData(data);
      setInfo({
        title: data.title,
        uploader: data.uploader,
        thumbnail: data.thumbnailUrl,
        duration: data.duration,
        id,
      });
      applyMode(data, mode);
    } catch {
      setError(u.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!selectedStream?.url || !info) return;
    setError('');
    setDownloading(true);
    setProgress(0);

    try {
      const res = await fetch(selectedStream.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const total = Number(res.headers.get('content-length') || 0);
      const reader = res.body?.getReader?.();
      let blob;

      if (reader) {
        const chunks = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.byteLength;
          if (total > 0) setProgress(Math.min(99, Math.round((received / total) * 100)));
        }
        blob = new Blob(chunks, { type: selectedStream.mimeType || 'application/octet-stream' });
      } else {
        blob = await res.blob();
      }

      const ext = mode === 'audio'
        ? ((selectedStream.mimeType || '').includes('webm') ? 'webm' : 'm4a')
        : ((selectedStream.mimeType || '').includes('webm') ? 'webm' : 'mp4');

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = safeFilename(info.title, ext);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setProgress(100);
    } catch {
      // fallback: open stream in new tab if blob download fails
      window.open(selectedStream.url, '_blank', 'noopener,noreferrer');
      setError(u.downloadFallback);
    } finally {
      setDownloading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section className="utility-panel">
      <p className="section-kicker">Util</p>
      <h1 className="section-title">{u.title}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-soft md:text-lg">{u.subtitle}</p>

      <form onSubmit={analyze} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{u.linkLabel}</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={u.placeholder}
            className="utility-input"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${mode === 'video' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => changeMode('video')}
          >
            {u.modeVideo}
          </button>
          <button
            type="button"
            className={`btn ${mode === 'audio' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => changeMode('audio')}
          >
            {u.modeAudio}
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || !url.trim()}>
          {loading ? u.loading : u.analyze}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-[2px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {info && (
        <div className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-[11rem_1fr]">
          {info.thumbnail && (
            <img
              src={info.thumbnail}
              alt=""
              className="h-40 w-full object-cover border border-line bg-white sm:h-28"
              loading="lazy"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">{info.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {[info.uploader, formatDuration(info.duration)].filter(Boolean).join(' · ')}
            </p>

            {streams.length > 0 && (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">{u.qualityLabel}</span>
                  <select
                    className="utility-input"
                    value={selectedStream?.url || ''}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {streams.map((s) => (
                      <option key={s.url} value={s.url}>
                        {s.kind === 'audio'
                          ? `${s.quality || 'audio'} · ${s.mimeType || 'audio'}`
                          : `${s.quality || 'video'} · ${s.mimeType || 'video'}`}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={download}
                  disabled={downloading || !selectedStream}
                >
                  {downloading ? u.downloading : u.download}
                </button>

                {downloading && (
                  <div className="utility-progress" aria-hidden="true">
                    <div className="utility-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">{u.disclaimer}</p>
    </section>
  );
};

export default YoutubeDownloader;
