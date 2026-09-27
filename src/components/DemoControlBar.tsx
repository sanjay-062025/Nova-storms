import React from 'react';
import { Play, RotateCcw, AlertTriangle, ExternalLink, Timer, Sparkles } from 'lucide-react';
import { OFFICIAL_MOTA_URL } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

interface DemoControlBarProps {
  countdownSeconds?: number;
  isEscalated?: boolean;
  hasEscalated?: boolean;
  onAccelerateEscalation?: () => void;
  onFastForwardEscalate?: () => void;
  onResetDemo?: () => void;
  onReset?: () => void;
  onOpenEligibility?: () => void;
  onLaunchJago?: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  countdownSeconds = 25,
  isEscalated = false,
  hasEscalated,
  onAccelerateEscalation,
  onFastForwardEscalate,
  onResetDemo,
  onReset,
  onOpenEligibility,
  onLaunchJago
}) => {
  const { t } = useLanguage();
  const escalatedStatus = hasEscalated !== undefined ? hasEscalated : isEscalated;
  const triggerEscalate = onFastForwardEscalate || onAccelerateEscalation || (() => {});
  const triggerReset = onReset || onResetDemo || (() => {});
  return (
    <aside
      id="sih-demo-control-bar"
      aria-label="Hackathon Simulation Controls"
      className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs px-3 sm:px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Simulation label & explanation */}
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400" /> {t('demo_bar_title')}
          </span>
          <span className="text-slate-300 font-medium">
            <strong className="text-white">Proactive Escalation Rule:</strong> 30 seconds represents 30 days of inactivity.
          </span>
          <a
            href={OFFICIAL_MOTA_URL}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 underline underline-offset-2 ml-1"
            title="Official MoTA Scholarship Portal Source"
          >
            tribal.nic.in/ScholarshiP <ExternalLink className="w-3 h-3 inline" />
          </a>
        </div>

        {/* Live Timer & Fast-Forward Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {!escalatedStatus ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 rounded-md border border-slate-700 text-slate-200">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>{t('demo_sla_timer')}</span>
              <span className="font-mono font-bold text-amber-300">
                {countdownSeconds > 0 ? `${countdownSeconds}s` : 'Escalating...'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/80 rounded-md border border-rose-800 text-rose-300 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('demo_active_alert')}</span>
            </div>
          )}

          {!escalatedStatus && (
            <button
              id="btn-fast-forward-escalation"
              onClick={triggerEscalate}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Fast-forward 30 seconds to demonstrate auto-escalation instantly"
            >
              <Play className="w-3 h-3" />
              <span>{t('demo_fast_forward')}</span>
            </button>
          )}

          <button
            id="btn-reset-demo"
            onClick={triggerReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium transition-colors cursor-pointer"
            title="Reset demo data back to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('demo_reset')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
