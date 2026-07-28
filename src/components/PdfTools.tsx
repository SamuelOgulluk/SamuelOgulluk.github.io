import React, { useRef, useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { useLanguage } from '@/App';

const PDF24_URL = {
  en: 'https://tools.pdf24.org/en/',
  fr: 'https://tools.pdf24.org/fr/',
};

function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function fileLabel(file) {
  const kb = Math.max(1, Math.round(file.size / 1024));
  return `${file.name} · ${kb} KB`;
}

const PdfTools = () => {
  const { language, t } = useLanguage();
  const p = t.utility.pdf;
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [range, setRange] = useState('1-');

  const openPdf24 = () => {
    const url = PDF24_URL[language] || PDF24_URL.en;
    const features = 'popup=yes,width=1280,height=860,menubar=no,toolbar=no,location=yes,status=yes,resizable=yes,scrollbars=yes';
    const win = window.open(url, 'pdf24-tools', features);
    if (!win) {
      setError(p.popupBlocked);
      return;
    }
    setError('');
    win.focus();
  };

  const onPick = (event) => {
    const next = Array.from(event.target.files || []).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    setFiles((prev) => [...prev, ...next]);
    setError('');
    event.target.value = '';
  };

  const clearFiles = () => {
    setFiles([]);
    setError('');
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError(p.needMultiple);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const out = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await out.copyPages(doc, doc.getPageIndices());
        for (const page of pages) out.addPage(page);
      }
      const saved = await out.save();
      downloadBytes(saved, 'merged.pdf');
    } catch {
      setError(p.processError);
    } finally {
      setBusy(false);
    }
  };

  const splitPdf = async () => {
    if (files.length !== 1) {
      setError(p.needSingle);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const bytes = await files[0].arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const total = src.getPageCount();
      const match = String(range).trim().match(/^(\d+)\s*-\s*(\d+)?$/);
      if (!match) throw new Error('range');
      const start = Math.max(1, parseInt(match[1], 10));
      const end = match[2] ? Math.min(total, parseInt(match[2], 10)) : total;
      if (start > end || start > total) throw new Error('range');

      const out = await PDFDocument.create();
      const indices = [];
      for (let i = start - 1; i < end; i += 1) indices.push(i);
      const pages = await out.copyPages(src, indices);
      for (const page of pages) out.addPage(page);
      const saved = await out.save();
      downloadBytes(saved, `pages-${start}-${end}.pdf`);
    } catch {
      setError(p.processError);
    } finally {
      setBusy(false);
    }
  };

  const rotatePdf = async () => {
    if (files.length !== 1) {
      setError(p.needSingle);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      for (const page of doc.getPages()) {
        page.setRotation(degrees((page.getRotation().angle + 90) % 360));
      }
      const saved = await doc.save();
      downloadBytes(saved, 'rotated.pdf');
    } catch {
      setError(p.processError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="utility-panel">
      <p className="section-kicker">PDF</p>
      <h1 className="section-title">{p.title}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-soft md:text-lg">{p.subtitle}</p>

      <div className="mt-8 space-y-8">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">{p.pdf24Title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{p.pdf24Subtitle}</p>
          <button type="button" className="btn btn-primary mt-4" onClick={openPdf24}>
            {p.openPdf24}
          </button>
        </div>

        <div className="border-t border-line pt-8">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">{p.localTitle}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{p.localSubtitle}</p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={onPick}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
              {p.addFiles}
            </button>
            {files.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={clearFiles} disabled={busy}>
                {p.clearFiles}
              </button>
            )}
          </div>

          {files.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-soft">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>{fileLabel(file)}</li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={mergePdfs} disabled={busy || files.length < 2}>
              {p.merge}
            </button>
            <button type="button" className="btn btn-primary" onClick={rotatePdf} disabled={busy || files.length !== 1}>
              {p.rotate}
            </button>
          </div>

          <div className="mt-4 flex max-w-md flex-wrap items-end gap-2">
            <label className="min-w-[10rem] flex-1">
              <span className="mb-1.5 block text-sm font-semibold text-ink">{p.rangeLabel}</span>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder={p.rangePlaceholder}
                className="utility-input"
                disabled={busy}
              />
            </label>
            <button type="button" className="btn btn-primary" onClick={splitPdf} disabled={busy || files.length !== 1}>
              {p.split}
            </button>
          </div>

          {busy && <p className="mt-3 text-sm text-muted">{p.working}</p>}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-[2px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">{p.disclaimer}</p>
    </section>
  );
};

export default PdfTools;
