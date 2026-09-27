import React, { useState } from 'react';
import { Download, CheckCircle2, Share2, PlusSquare, Monitor, Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'success'>('idle');

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallStatus('success');
      }
    } else {
      // If native beforeinstallprompt has not fired yet or on desktop browser, show clear PWA installation guide
      setShowGuideModal(true);
    }
  };

  if (isInstalled || installStatus === 'success') {
    if (variant === 'compact') return null;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shadow-2xs ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>PWA Installed</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          id="btn-pwa-install-nav"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${className}`}
          title="Install Unified Scholarship Portal as a Desktop or Mobile Web App"
        >
          <Download className="w-3.5 h-3.5 text-slate-950" />
          <span>Install Web App</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          id="btn-pwa-install-compact"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-3 h-3 text-amber-300" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white border border-emerald-800/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                Install Official Scholarship Web App
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono">PWA</span>
              </h5>
              <p className="text-[11px] text-slate-300">
                Works offline, provides instant push updates, and launches in full-screen standalone mode.
              </p>
            </div>
          </div>
          <button
            id="btn-pwa-install-banner"
            onClick={handleInstallClick}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Device</span>
          </button>
        </div>
      )}

      {/* Progressive Web App Install Instructions Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Install as Web Application
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ministry of Tribal Affairs • Progressive Web App
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                Enjoy high-speed access, offline cache of your DigiLocker certificates, and direct home screen launch with zero app store downloads.
              </p>
            </div>

            {isIOS ? (
              /* iOS Safari Guide */
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Instructions for iOS Safari:</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <span>Tap the <strong>Share</strong> icon <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> in Safari's bottom toolbar.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <span>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-800" />.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <span>Tap <strong>Add</strong> in the top-right corner.</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Chrome / Edge / Desktop / Android Guide */
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-emerald-700" />
                  <span>Desktop Chrome & Edge / Android:</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <span>Click the <strong>Install App icon</strong> in the browser's URL address bar (top right).</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <span>Or open browser menu (<strong>⋮</strong> or <strong>…</strong>) &gt; <strong>Save and share</strong> &gt; <strong>Install page as app</strong>.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <span>Confirm by clicking <strong>Install</strong>.</span>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
