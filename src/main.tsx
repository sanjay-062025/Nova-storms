// Suppress benign [vite] websocket connection warnings in AI Studio preview environment (HMR is disabled)
if (typeof window !== 'undefined') {
  const isViteMsg = (args: any[]): boolean => {
    if (!args) return false;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (!a) continue;
      const str = typeof a === 'string' ? a : (a.message || (typeof a === 'object' ? (a.stack || String(a)) : String(a)));
      if (str && (str.includes('[vite]') || str.includes('failed to connect to websocket') || str.includes('WebSocket connection'))) {
        return true;
      }
    }
    return false;
  };

  (['error', 'warn', 'info', 'log', 'debug'] as const).forEach((fn) => {
    const orig = console[fn];
    if (typeof orig === 'function') {
      console[fn] = function (...args: any[]) {
        if (isViteMsg(args)) return;
        orig.apply(console, args);
      };
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
