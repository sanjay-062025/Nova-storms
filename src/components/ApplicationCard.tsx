import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Timer
} from 'lucide-react';
import { Application } from '../types';
import { StatusBadge } from './StatusBadge';

interface ApplicationCardProps {
  application: Application;
  onOpenGrievance: (grievanceId: string) => void;
  onAccelerateEscalate: (appId: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onOpenGrievance,
  onAccelerateEscalate
}) => {
  const [expanded, setExpanded] = useState(application.status === 'Escalated' || application.status === 'Submitted');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  // 30-second countdown simulation for "Submitted" status
  useEffect(() => {
    if (application.status !== 'Submitted') return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - application.submittedAt) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setSecondsRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [application.status, application.submittedAt]);

  const isEscalated = application.status === 'Escalated';

  return (
    <div
      id={`app-card-${application.id}`}
      className={`rounded-2xl border transition-all duration-300 shadow-2xs overflow-hidden ${
        isEscalated
          ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
          : application.status === 'Under Review'
          ? 'border-blue-200 bg-white'
          : application.status === 'Disbursed'
          ? 'border-emerald-200 bg-white'
          : 'border-amber-200 bg-white'
      }`}
    >
      {/* Top Banner for Escalated state */}
      {isEscalated && (
        <div className="bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-white animate-pulse" />
            <span className="font-bold">
              Delayed Application Auto-Escalated to District Nodal Officer
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
            SLA Breach Detected
          </span>
        </div>
      )}

      {/* Main Header */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500">
                #{application.applicationNumber}
              </span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                AY {application.academicYear}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {application.schemeName}
            </h4>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <StatusBadge status={application.status} showPulse={isEscalated} />
          </div>
        </div>

        {/* Live Timer if currently in Submitted state */}
        {application.status === 'Submitted' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Timer className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span>MoTA Proactive SLA Watcher Active</span>
              </div>
              <span className="font-mono font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                {secondsRemaining > 0 ? `${secondsRemaining}s until auto-escalate` : 'Escalating...'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Demo simulation:</strong> 30 seconds represents 30 days of inactivity. If institutional verification is not cleared within this window, a formal grievance is automatically created and assigned to the District Nodal Officer.
            </p>
            <div className="mt-2 flex justify-end">
              <button
                id="btn-trigger-delay-now"
                onClick={() => onAccelerateEscalate(application.id)}
                className="text-[11px] font-bold px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors cursor-pointer"
              >
                Fast-Forward 30s Delay Now
              </button>
            </div>
          </div>
        )}

        {/* Required Escalation Box when status is Escalated */}
        {isEscalated && (
          <div className="mb-4 p-4 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-3">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">
                <strong>Your application is delayed.</strong> We have auto-filed a grievance with the District Nodal Officer.
              </p>
            </div>

            {/* Grievance Summary Box */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Grievance automatically created
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Priority: Normal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">Grievance ID:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {application.grievanceId || 'GRV-MOTA-2026-7841'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Assigned to:</span>
                  <span className="font-bold text-slate-900">
                    District Nodal Officer (Tribal Welfare), Ranchi
                  </span>
                </div>
              </div>

              {application.grievanceId && (
                <div className="pt-2">
                  <button
                    id="btn-view-auto-grievance"
                    onClick={() => onOpenGrievance(application.grievanceId!)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>Track Grievance Resolution Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              *Demo simulation: 30 seconds represents 30 days of verification delay.
            </p>
          </div>
        )}

        {/* Basic Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
          <div>
            <span className="text-slate-400 block text-[11px]">Submitted Date</span>
            <span className="font-semibold text-slate-800">{application.formattedSubmittedDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Verification</span>
            <span className="font-semibold text-slate-800 truncate block">
              {application.verificationStatus}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Sanction Status</span>
            <span className="font-semibold text-slate-800">{application.sanctionStatus}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Disbursement</span>
            <span className="font-semibold text-slate-800">{application.disbursementStatus}</span>
          </div>
        </div>

        {/* Toggle Timeline Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            id={`btn-toggle-timeline-${application.id}`}
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>{expanded ? 'Hide Application Lifecycle' : 'View Application Lifecycle & SLA'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <span className="text-[11px] text-slate-400">
            Updated: {application.lastUpdated}
          </span>
        </div>
      </div>

      {/* Expanded Timeline View */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-1 bg-slate-50/70 border-t border-slate-100">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Unified Application Verification Lifecycle
          </h5>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {application.timeline.map((step, idx) => {
              return (
                <div key={idx} className="relative flex items-start gap-3 text-xs">
                  {/* Icon Indicator */}
                  <div
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      step.escalated
                        ? 'bg-rose-100 border-rose-600 text-rose-700'
                        : step.completed
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-700'
                        : step.current
                        ? 'bg-amber-100 border-amber-600 text-amber-700'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.escalated ? (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    ) : step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`font-bold text-xs ${
                          step.escalated
                            ? 'text-rose-900 font-extrabold'
                            : step.completed
                            ? 'text-slate-900'
                            : 'text-slate-600'
                        }`}
                      >
                        {step.stage}
                      </p>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
