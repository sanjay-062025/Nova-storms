import React from 'react';
import {
  FileText,
  AlertOctagon,
  Clock,
  Sparkles,
  CheckCircle2,
  Info,
  RotateCcw,
  Zap,
  HardDrive
} from 'lucide-react';
import { Application } from '../types';
import { ApplicationCard } from '../components/ApplicationCard';
import { useLanguage } from '../i18n/LanguageContext';

interface ApplicationsViewProps {
  applications: Application[];
  onOpenGrievance: (grievanceId: string) => void;
  onAccelerateEscalate: (appId: string) => void;
  onResetDemo: () => void;
  onOpenOfflineSnapshot?: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onOpenGrievance,
  onAccelerateEscalate,
  onResetDemo,
  onOpenOfflineSnapshot
}) => {
  const { t } = useLanguage();
  const hasEscalated = applications.some((a) => a.status === 'Escalated');

  return (
    <div className="space-y-5">
      {/* Header Banner - Clean Professional Layout */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" /> {t('applications_heading')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Application Portfolio & Statutory SLAs
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            {t('applications_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenOfflineSnapshot && (
            <button
              id="btn-offline-snapshot-apps"
              onClick={onOpenOfflineSnapshot}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-amber-300"
              title="View and download read-only offline cached snapshot of your applications"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-700" />
              <span>Offline Snapshot</span>
            </button>
          )}

          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* SLA & Proactive Escalation Explainer Card */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Automated 30-Day SLA Watcher:</strong> The system automatically monitors institutional response times. If the institute fails to review within statutory deadlines (simulated as 30 seconds), an auto-escalation ticket is registered with the District Nodal Officer.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onOpenGrievance={onOpenGrievance}
            onAccelerateEscalate={onAccelerateEscalate}
          />
        ))}
      </div>

      {applications.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-600 text-xs font-medium">
          No applications found. You can apply for a scheme from the Scholarships tab.
        </div>
      )}
    </div>
  );
};
