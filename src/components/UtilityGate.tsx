import React, { useState } from 'react';
import { useLanguage } from '@/App';
import UtilityHub from './UtilityHub';

// SHA-256("1234") — le mot de passe n'est jamais stocké en clair
const PASSWORD_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';
const UNLOCK_KEY = 'utility-unlocked-v2';

function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const UtilityGate = () => {
  const { t } = useLanguage();
  const u = t.utility;
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setChecking(true);
    try {
      const hash = await sha256Hex(password);
      if (hash === PASSWORD_HASH) {
        try {
          sessionStorage.setItem(UNLOCK_KEY, '1');
        } catch {
          // ignore storage errors
        }
        setUnlocked(true);
        setPassword('');
        return;
      }
      setError(u.lockWrong);
      setPassword('');
    } catch {
      setError(u.lockWrong);
      setPassword('');
    } finally {
      setChecking(false);
    }
  };

  if (unlocked) return <UtilityHub />;

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
            disabled={checking}
          />
        </label>

        {error && (
          <p className="alert-error mt-4" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={!password || checking}>
          {u.lockSubmit}
        </button>
      </form>
    </section>
  );
};

export default UtilityGate;
