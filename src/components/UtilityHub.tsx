import React, { Suspense, lazy, useState } from 'react';
import { useLanguage } from '@/App';
import YoutubeDownloader from './YoutubeDownloader';

const PdfTools = lazy(() => import('./PdfTools'));

const UtilityHub = () => {
  const { t } = useLanguage();
  const u = t.utility;
  const [tool, setTool] = useState('youtube');

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn ${tool === 'youtube' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTool('youtube')}
        >
          {u.toolYoutube}
        </button>
        <button
          type="button"
          className={`btn ${tool === 'pdf' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTool('pdf')}
        >
          {u.toolPdf}
        </button>
      </div>
      {tool === 'youtube' ? (
        <YoutubeDownloader />
      ) : (
        <Suspense fallback={<p className="text-sm text-muted">{u.pdf.working}</p>}>
          <PdfTools />
        </Suspense>
      )}
    </div>
  );
};

export default UtilityHub;
