import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/App';

const API_BASE = (import.meta.env.VITE_YTDLP_API || 'http://127.0.0.1:7860').replace(/\/$/, '');

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
  const [formats, setFormats] = useState([]);
  const [selected, setSelected] = useState('');

  const selectedFormat = useMemo(
    () => formats.find((f) => f.id === selected) || formats[0] || null,
    [formats, selected]
  );

  const analyze = async (event) => {
    event.preventDefault();
    setError('');
    setInfo(null);
    setFormats([]);
    setSelected('');
    setProgress(0);

    if (!url.trim()) {
      setError(u.invalidUrl);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url: url.trim(), mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : u.fetchError;
        throw new Error(detail);
      }
      if (!Array.isArray(data.formats) || !data.formats.length) {
        setError(u.noStreams);
        return;
      }
      setInfo({
        title: data.title,
        uploader: data.uploader,
        thumbnail: data.thumbnail,
        duration: data.duration,
        id: data.id,
        webpage_url: data.webpage_url || url.trim(),
      });
      setFormats(data.formats);
      setSelected(data.formats[0].id);
    } catch (err) {
      setError(err?.message || u.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const changeMode = async (nextMode) => {
    setMode(nextMode);
    setError('');
    if (!info?.webpage_url && !url.trim()) return;
    setLoading(true);
    setFormats([]);
    setSelected('');
    try {
      const res = await fetch(`${API_BASE}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url: info?.webpage_url || url.trim(), mode: nextMode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : u.fetchError;
        throw new Error(detail);
      }
      setFormats(data.formats || []);
      setSelected(data.formats?.[0]?.id || '');
      if (!data.formats?.length) setError(u.noStreams);
    } catch (err) {
      setError(err?.message || u.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!selectedFormat || !info) return;
    setError('');
    setDownloading(true);
    setProgress(0);

    const params = new URLSearchParams({
      url: info.webpage_url,
      format_id: selectedFormat.id,
      mode,
      title: info.title || 'youtube-video',
    });

    try {
      const res = await fetch(`${API_BASE}/download?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = typeof data.detail === 'string' ? data.detail : u.fetchError;
        throw new Error(detail);
      }

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
          else setProgress((p) => (p < 90 ? p + 1 : p));
        }
        blob = new Blob(chunks, { type: 'application/octet-stream' });
      } else {
        blob = await res.blob();
      }

      const ext = selectedFormat.ext || (mode === 'audio' ? 'm4a' : 'mp4');
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = safeFilename(info.title, ext);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setProgress(100);
    } catch (err) {
      setError(err?.message || u.fetchError);
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
        <p className="alert-error mt-4" role="alert">
          {error}
        </p>
      )}

      {info && (
        <div className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-[11rem_1fr]">
          {info.thumbnail && (
            <img
              src={info.thumbnail}
              alt=""
              className="h-40 w-full object-cover border-[3px] border-ink bg-paper-deep sm:h-28"
              loading="lazy"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">{info.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {[info.uploader, formatDuration(info.duration)].filter(Boolean).join(' · ')}
            </p>

            {formats.length > 0 && (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">{u.qualityLabel}</span>
                  <select
                    className="utility-input"
                    value={selectedFormat?.id || ''}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {formats.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={download}
                  disabled={downloading || !selectedFormat}
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
