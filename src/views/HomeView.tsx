import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertOctagon,
  GraduationCap,
  Landmark,
  FileText,
  ChevronRight,
  ExternalLink,
  Award,
  Users
} from 'lucide-react';
import {
  StudentProfile,
  EntitlementWalletData,
  Application,
  PaymentSummary,
  ScholarshipScheme
} from '../types';
import { EntitlementWalletCard } from '../components/EntitlementWalletCard';
import { EligibilityProgressChart } from '../components/EligibilityProgressChart';
import { StatusBadge } from '../components/StatusBadge';
import { InactiveUserBanner } from '../components/InactiveUserBanner';
import { useLanguage } from '../i18n/LanguageContext';
import { InactiveUserStatus } from '../types';
import { Database, Globe } from 'lucide-react';

interface HomeViewProps {
  profile: StudentProfile;
  wallet: EntitlementWalletData;
  applications: Application[];
  paymentSummary: PaymentSummary;
  schemes: ScholarshipScheme[];
  inactiveStatus?: InactiveUserStatus;
  isSimulatedInactive?: boolean;
  onToggleInactivity?: () => void;
  onOpenInactiveMentorship?: () => void;
  onOpenGovPipeline?: () => void;
  onOpenCallMentor?: () => void;
  onOpenChecker: () => void;
  onNavigateTab: (tab: 'home' | 'scholarships' | 'applications' | 'payments' | 'profile') => void;
  onApplyScheme: (schemeId: string) => void;
  onOpenGrievance: (grievanceId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  wallet,
  applications,
  paymentSummary,
  schemes,
  inactiveStatus,
  isSimulatedInactive = true,
  onToggleInactivity,
  onOpenInactiveMentorship,
  onOpenGovPipeline,
  onOpenCallMentor,
  onOpenChecker,
  onNavigateTab,
  onApplyScheme,
  onOpenGrievance
}) => {
  const { t, language } = useLanguage();
  const activeApp = applications.find((a) => a.status === 'Escalated') || applications[0];

  const getGreeting = () => {
    if (language === 'hi') return `नमस्ते, ${profile.name}`;
    if (language === 'sat') return `ᱡᱚᱦᱟᱨ, ${profile.name}`;
    if (language === 'ta') return `வணக்கம், ${profile.name}`;
    return `Namaste, ${profile.name}`;
  };

  return (
    <div className="space-y-6">
      {/* Proactive Inactivity Mentorship Alert Banner */}
      {inactiveStatus && (
        <InactiveUserBanner
          status={inactiveStatus}
          isSimulatedInactive={isSimulatedInactive}
          onToggleInactivity={onToggleInactivity || (() => {})}
          onOpenMentorshipModal={onOpenInactiveMentorship || (() => {})}
          onOpenCallMentor={onOpenCallMentor || (() => {})}
        />
      )}

      {/* Welcome & Student Hero Bar */}
      <section
        id="student-hero-banner"
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-emerald-700 border-2 border-emerald-400/50 flex items-center justify-center font-extrabold text-lg text-white shadow-sm shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                {getGreeting()}
              </h2>
              <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {profile.category} • {profile.tribe || profile.subTribe}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {profile.college || profile.institution} • {profile.currentCourse} (Year {profile.currentYear || 3})
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-300 mt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unified Student ID: {profile.id || profile.studentId}</span>
              <span>•</span>
              <span>Aadhaar: {profile.aadhaarMask}</span>
            </div>
          </div>
        </div>

        <button
          id="btn-hero-check-eligibility"
          onClick={onOpenChecker}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{t('btn_check_eligibility')}</span>
        </button>
      </section>

      {/* REQUIRED: YOUR ENTITLEMENT WALLET */}
      <EntitlementWalletCard
        wallet={wallet}
        onOpenChecker={onOpenChecker}
        onApplyScheme={onApplyScheme}
      />

      {/* D3-BASED SCHOLARSHIP ELIGIBILITY PROGRESS ACROSS CATEGORIES */}
      <EligibilityProgressChart
        profile={profile}
        schemes={schemes}
        onOpenChecker={onOpenChecker}
        onNavigateScholarships={() => onNavigateTab('scholarships')}
      />

      {/* Government Verification Pipeline Strip (DigiLocker, AISHE, UDISE, APAAR, UIDAI) */}
      <section className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Government Data Verification Pipeline
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> 5 Statutory Sources Verified
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Connected Gateways:</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px]">
                UIDAI Aadhaar
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-900 border border-blue-200 font-mono text-[10px]">
                DigiLocker
              </span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono text-[10px]">
                AISHE
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-[10px]">
                UDISE+
              </span>
              <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-900 border border-purple-200 font-mono text-[10px]">
                APAAR/ABC
              </span>
            </div>
          </div>
        </div>

        <button
          id="btn-open-gov-pipeline-home"
          onClick={onOpenGovPipeline}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <Database className="w-3.5 h-3.5 text-amber-300" />
          <span>View Verification Pipeline & Keys</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Quick Status Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">{t('nav_applications')}</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{applications.length}</span>
            <span className="text-[11px] text-slate-500">Tracked</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            View status & timeline →
          </span>
        </div>

        {/* DBT Disbursed */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">{t('disbursed')}</span>
            <Landmark className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-800">
              {paymentSummary.formattedDisbursed}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Direct to Bank A/C</span>
        </div>

        {/* Pending / In-Queue */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">{t('pending_processing')}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-900">
              {paymentSummary.formattedPending}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">PFMS sanction queue</span>
        </div>

        {/* Verified Profile */}
        <div
          onClick={() => onNavigateTab('profile')}
          className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">{t('verified_st')}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">100%</span>
            <span className="text-[11px] text-slate-500">Verified</span>
          </div>
          <span className="text-[10px] text-blue-700 font-semibold block mt-1">
            DigiLocker Synced →
          </span>
        </div>
      </section>

      {/* Real-time Tracking Highlights */}
      {activeApp && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Active Application Tracker
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
            >
              <span>View All ({applications.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border transition-all ${
              activeApp.status === 'Escalated'
                ? 'bg-rose-50/50 border-rose-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  #{activeApp.applicationNumber}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {activeApp.schemeName}
                </h4>
              </div>
              <StatusBadge status={activeApp.status} showPulse={activeApp.status === 'Escalated'} />
            </div>

            {activeApp.status === 'Escalated' ? (
              <div className="space-y-2 mt-2 pt-2 border-t border-rose-200 text-xs">
                <p className="text-rose-900 font-semibold">
                  ⚠️ Verification delayed beyond 30 days. Auto-escalated to District Nodal Officer.
                </p>
                {activeApp.grievanceId && (
                  <button
                    onClick={() => onOpenGrievance(activeApp.grievanceId!)}
                    className="inline-flex items-center gap-1 font-bold text-rose-800 underline"
                  >
                    <span>View Auto-Filed Grievance ({activeApp.grievanceId})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600 mt-1">
                Current Stage: <strong className="text-slate-800">{activeApp.verificationStatus}</strong>.
                Submitted on {activeApp.formattedSubmittedDate}.
              </p>
            )}
          </div>
        </section>
      )}

      {/* MoTA Central Schemes Spotlight */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Scheduled Tribe Scholarship Schemes
            </h3>
            <p className="text-xs text-slate-500">
              5 Unified Centrally Sponsored & Central Sector Schemes under MoTA
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('scholarships')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
          >
            <span>Explore All Schemes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schemes.slice(0, 2).map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {scheme.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 font-medium">
                    {scheme.schemeCode}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{scheme.schemeName}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {scheme.description}
                </p>
                <div className="text-xs font-bold text-emerald-800 mb-2">
                  Benefit: {scheme.formattedBenefit}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">AY 2026-27 Open</span>
                <button
                  onClick={() => onApplyScheme(scheme.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official MoTA Portal Reference Footer Card */}
      <section className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <strong className="block font-bold text-slate-900">
            Statutory Ministry Linkage:
          </strong>
          <span>
            Integrated with Ministry of Tribal Affairs (MoTA) Scholarship Section (
            <code className="text-[11px] bg-slate-200 px-1 py-0.5 rounded">tribal.nic.in/ScholarshiP.aspx</code>)
          </span>
        </div>
        <a
          href="https://tribal.nic.in/ScholarshiP.aspx"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold shrink-0"
        >
          <span>Open Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
};
