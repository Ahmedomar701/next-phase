'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    setTheme(stored === 'dark' || stored === 'light' ? stored : systemTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem('theme', next);
    } catch {
      // Private browsing: the choice just won't persist.
    }
    setTheme(next);
  }

  // Rendered as a stable placeholder until the client knows the active theme.
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      suppressHydrationWarning
    >
      {theme === null ? '◐' : theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
