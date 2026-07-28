import React, { useState } from 'react';
import { useLanguage } from '@/App';
import YoutubeDownloader from './YoutubeDownloader';

const UTILITY_PASSWORD = '1234';
const UNLOCK_KEY = 'utility-unlocked';

function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

const UtilityGate = () => {
  const { t } = useLanguage();
  const u = t.utility;
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (password === UTILITY_PASSWORD) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        // ignore storage errors
      }
      setUnlocked(true);
      setError('');
      return;
    }
    setError(u.lockWrong);
    setPassword('');
  };

  if (unlocked) return <YoutubeDownloader />;

  return (
    <section className="utility-panel">
      <p className="section-kicker">Util</p>
      <h1 className="section-title">{u.lockTitle}</h1>
      <p className="max-w-xl text-base leading-relaxed text-soft md:text-lg">{u.lockSubtitle}</p>

      <form onSubmit={submit} className="mt-8 max-w-sm space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{u.lockLabel}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="utility-input"
            autoComplete="current-password"
            autoFocus
          />
        </label>

        {error && (
          <p className="rounded-[2px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={!password}>
          {u.lockSubmit}
        </button>
      </form>
    </section>
  );
};

export default UtilityGate;
