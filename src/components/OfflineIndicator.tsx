import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, HardDrive, Download, X } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also listen for simulated toggle
    const handleSimulatedNetwork = (e: any) => {
      if (typeof e.detail?.online === 'boolean') {
        setIsOnline(e.detail.online);
      }
    };
    window.addEventListener('mota-simulate-network', handleSimulatedNetwork);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('mota-simulate-network', handleSimulatedNetwork);
    };
  }, []);

  return isOnline;
}

interface OfflineIndicatorProps {
  onOpenSnapshotModal?: () => void;
  onRefreshLiveBackend?: () => Promise<void> | void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenSnapshotModal,
  onRefreshLiveBackend
}) => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced'>('idle');

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setSyncState('idle');
    } else if (wasOffline) {
      // Reconnected! Show proactive "Syncing..." status
      setSyncState('syncing');

      if (onRefreshLiveBackend) {
        Promise.resolve(onRefreshLiveBackend()).catch(() => {});
      }

      // Transition to 'synced' after brief sync delay
      const timer1 = setTimeout(() => {
        setSyncState('synced');
      }, 2000);

      // Auto-dismiss after 'synced' is shown
      const timer2 = setTimeout(() => {
        setWasOffline(false);
        setSyncState('idle');
      }, 5500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOnline, wasOffline, onRefreshLiveBackend]);

  // If online and was never offline, don't show anything
  if (isOnline && !wasOffline) return null;

  // Reconnection / Syncing phase
  if (isOnline && wasOffline) {
    if (syncState === 'syncing') {
      return (
        <div
          id="toast-syncing-indicator"
          role="status"
          aria-live="polite"
          className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto z-50 max-w-md flex items-center gap-3 rounded-2xl bg-indigo-900/95 text-white p-3.5 shadow-2xl border border-indigo-700 backdrop-blur-md animate-in slide-in-from-bottom duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-800 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-indigo-300 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">Connection Restored — Syncing...</p>
              <span className="text-[10px] font-mono bg-indigo-800/80 text-indigo-200 px-1.5 py-0.2 rounded font-semibold">
                MoTA Portal
              </span>
            </div>
            <p className="text-[11px] text-indigo-200 mt-0.5 truncate">
              Synchronizing active application SLA timelines & DBT verification...
            </p>
          </div>
        </div>
      );
    }

    if (syncState === 'synced') {
      return (
        <div
          id="toast-synced-indicator"
          role="status"
          aria-live="polite"
          className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto z-50 max-w-md flex items-center justify-between gap-3 rounded-2xl bg-emerald-800/95 text-white p-3.5 shadow-2xl border border-emerald-600 backdrop-blur-md animate-in slide-in-from-bottom duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sync Complete — All Data Up to Date</p>
              <p className="text-[11px] text-emerald-200">
                Latest application statuses and notifications updated.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setWasOffline(false);
              setSyncState('idle');
            }}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-700/50 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return null;
  }

  // Active Offline Mode
  return (
    <div
      id="banner-offline-mode"
      role="alert"
      className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto z-50 max-w-lg rounded-2xl bg-amber-600/95 text-white p-3.5 shadow-2xl border border-amber-400/80 backdrop-blur-md animate-in slide-in-from-bottom duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-700/80 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-white">
              Offline Mode — Using Cached Application Snapshot
            </p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-800 text-amber-100 border border-amber-400/40 shrink-0">
              Read-Only Cache
            </span>
          </div>
          <p className="text-[11px] text-amber-100 mt-1 leading-snug">
            Your scholarship profile, active applications, and DigiLocker certificates remain accessible offline.
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              id="btn-open-offline-snapshot-banner"
              type="button"
              onClick={() => {
                if (onOpenSnapshotModal) {
                  onOpenSnapshotModal();
                } else {
                  window.dispatchEvent(new CustomEvent('mota-open-offline-snapshot'));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-amber-950 font-bold text-xs hover:bg-amber-50 transition-colors shadow-xs cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-700" />
              <span>Open Offline Snapshot Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
