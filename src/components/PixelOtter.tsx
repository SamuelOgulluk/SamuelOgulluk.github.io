import React, { useState } from 'react';
import { useLanguage } from '@/App';

const PixelOtter = () => {
  const { t } = useLanguage();
  const [speak, setSpeak] = useState(false);

  const toggle = () => {
    setSpeak(true);
    window.setTimeout(() => setSpeak(false), 2200);
  };

  return (
    <button type="button" className="pixel-otter" onClick={toggle} aria-label={t.den.otter}>
      {speak && <span className="otter-bubble">{t.den.otter}</span>}
      <img src="/assets/otter.svg" alt="" width={24} height={16} draggable={false} />
    </button>
  );
};

export default PixelOtter;
