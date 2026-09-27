import React from 'react';
import {
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Award
} from 'lucide-react';
import { InactiveUserStatus } from '../types';

interface InactiveUserBannerProps {
  status: InactiveUserStatus;
  isSimulatedInactive: boolean;
  onToggleInactivity: () => void;
  onOpenMentorshipModal: () => void;
  onOpenCallMentor: () => void;
}

export const InactiveUserBanner: React.FC<InactiveUserBannerProps> = ({
  status,
  isSimulatedInactive,
  onToggleInactivity,
  onOpenMentorshipModal,
  onOpenCallMentor
}) => {
  if (!isSimulatedInactive) {
    return (
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            Student Status: <strong>Active & In Good Standing</strong> (No Dormancy Detected)
          </span>
        </div>
        <button
          onClick={onToggleInactivity}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
        >
          <ToggleLeft className="w-4 h-4 text-amber-700" />
          <span>Simulate Inactive User State (SIH Evaluation)</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="inactive-user-alert-banner"
      className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white shadow-lg border border-amber-500/40 relative overflow-hidden"
    >
      {/* Decorative pulse glow */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 mt-0.5">
            <Award className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                Proactive Inactivity Outreach
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {status.dormancyDays} Days Inactive
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ₹19,36,000 in Unclaimed Benefits
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
              Unclaimed High-Value Scholarships Matched with Your ST Profile
            </h3>
            <p className="text-xs text-amber-100/80 mt-0.5 max-w-2xl leading-relaxed">
              Based on your verified ST status & 84.6% marks, you qualify for{' '}
              <strong className="text-amber-300">National Overseas Scholarship (NOS)</strong> and{' '}
              <strong className="text-amber-300">Top Class Education</strong>. Alumni Mentor{' '}
              <strong>Rajesh Soren</strong> (Imperial College London) has been assigned to guide you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 flex-wrap">
          <button
            id="btn-open-inactive-mentorship"
            onClick={onOpenMentorshipModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Meet Mentor & Fast-Track (₹19.3L)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-call-mentor-quick"
            onClick={onOpenCallMentor}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
            title="Call Mentor Immediately"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Call Mentor</span>
          </button>

          <button
            onClick={onToggleInactivity}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Toggle Simulator"
          >
            <ToggleRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
