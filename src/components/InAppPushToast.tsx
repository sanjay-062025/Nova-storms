import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { PushNotificationPayload } from '../utils/notificationService';

interface ActivePushToast extends PushNotificationPayload {
  id: string;
  timestamp: string;
}

export const InAppPushToast: React.FC = () => {
  const [toasts, setToasts] = useState<ActivePushToast[]>([]);

  useEffect(() => {
    const handlePushEvent = (event: CustomEvent<PushNotificationPayload & { timestamp: string }>) => {
      const detail = event.detail;
      const newToast: ActivePushToast = {
        ...detail,
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: detail.timestamp || 'Just now'
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 3));

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 7000);
    };

    window.addEventListener('mota-push-notification' as any, handlePushEvent);
    return () => {
      window.removeEventListener('mota-push-notification' as any, handlePushEvent);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      id="push-notifications-container"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-500/30 flex flex-col gap-2 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                    MoTA Push Alert
                  </span>
                  <span className="text-[10px] text-slate-400">• {toast.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{toast.title}</h4>
              </div>
            </div>

            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-[11px] text-slate-300 leading-relaxed pl-10">{toast.body}</p>

          {/* Footer badge if opening date */}
          {toast.openingDate && (
            <div className="ml-10 flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800/40">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>Portal Opening Date: {toast.openingDate}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
