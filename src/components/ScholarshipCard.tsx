import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  IndianRupee,
  Users,
  ExternalLink,
  ChevronRight,
  FileCheck,
  CheckCircle2,
  Info,
  X,
  Bell,
  BellRing,
  Clock
} from 'lucide-react';
import { ScholarshipScheme } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ScholarshipCardProps {
  scheme: ScholarshipScheme;
  onCheckEligibility: () => void;
  onApply: (schemeId: string) => void;
  isSubscribed?: boolean;
  onNotifyMe?: (scheme: ScholarshipScheme) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scheme,
  onCheckEligibility,
  onApply,
  isSubscribed = false,
  onNotifyMe
}) => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const categoryBadgeColors: Record<string, string> = {
    School: 'bg-blue-50 text-blue-900 border-blue-200',
    'Higher Education': 'bg-emerald-50 text-emerald-900 border-emerald-200',
    'Higher Technical': 'bg-purple-50 text-purple-900 border-purple-200',
    Research: 'bg-amber-50 text-amber-900 border-amber-200',
    International: 'bg-rose-50 text-rose-900 border-rose-200'
  };

  return (
    <>
      <div
        id={`scheme-card-${scheme.id}`}
        className={`rounded-2xl border transition-all shadow-2xs overflow-hidden flex flex-col justify-between ${
          scheme.isUpcoming
            ? 'border-indigo-200 hover:border-indigo-400 bg-white ring-1 ring-indigo-50/50'
            : 'border-slate-200 bg-white hover:border-emerald-300'
        }`}
      >
        <div className="p-4 sm:p-5">
          {/* Top category & code & status */}
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  categoryBadgeColors[scheme.category] || 'bg-slate-100 text-slate-800'
                }`}
              >
                {scheme.category}
              </span>

              {scheme.isUpcoming && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>{t('badge_upcoming') || 'Opening Soon'}</span>
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {scheme.schemeCode}
            </span>
          </div>

          {/* Scheme Title */}
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mb-2">
            {scheme.schemeName}
          </h4>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {scheme.description}
          </p>

          {/* Key Facts Grid */}
          <div className="space-y-2 text-xs py-3 border-y border-slate-100 mb-3">
            <div className="flex items-start gap-2 text-slate-700">
              <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-snug">
                <strong className="text-slate-900">Target Beneficiary:</strong> {scheme.targetGroup}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <IndianRupee className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong className="text-slate-900">{t('annual_benefit')}:</strong>{' '}
                <span className="font-bold text-emerald-800">{scheme.formattedBenefit}</span>
              </span>
            </div>

            {scheme.isUpcoming ? (
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">{t('opens_on') || 'Opens on'}:</strong>{' '}
                  <span className="font-bold text-indigo-700">
                    {scheme.openingDate || scheme.applicationPeriod}
                  </span>
                  {scheme.daysUntilOpen ? ` (${scheme.daysUntilOpen} days left)` : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong className="text-slate-900">{t('deadline')}:</strong> {scheme.applicationPeriod}
                </span>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Eligibility:</span>
            <p className="text-[11px] leading-relaxed line-clamp-2">{scheme.eligibility}</p>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              id={`btn-details-${scheme.id}`}
              onClick={() => setShowDetails(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              {t('btn_view_details')}
            </button>
            <button
              id={`btn-check-eligibility-${scheme.id}`}
              onClick={onCheckEligibility}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
            >
              {t('btn_check_eligibility')}
            </button>
          </div>

          {scheme.isUpcoming ? (
            <button
              id={`btn-notify-${scheme.id}`}
              onClick={() => onNotifyMe && onNotifyMe(scheme)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                isSubscribed
                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  : 'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white'
              }`}
            >
              {isSubscribed ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('btn_subscribed') || 'Subscribed'}</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-white" />
                  <span>{t('btn_notify_me') || 'Notify Me'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              id={`btn-apply-${scheme.id}`}
              onClick={() => onApply(scheme.id)}
              className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <span>{t('btn_apply_now')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {showDetails && (
        <div
          id={`modal-scheme-${scheme.id}`}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {scheme.category}
                  </span>
                  {scheme.isUpcoming && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                      Upcoming Scheme
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono font-bold">{scheme.schemeCode}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">{scheme.schemeName}</h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 mb-1 text-sm">Scheme Overview</h5>
                <p className="text-slate-600 leading-relaxed">{scheme.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Financial Assistance</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{scheme.formattedBenefit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Income Ceiling Limit</span>
                  <span className="font-extrabold text-slate-900">
                    {scheme.annualIncomeCeiling >= 90000000
                      ? 'No Income Ceiling'
                      : `Up to ₹${(scheme.annualIncomeCeiling / 100000).toFixed(1)} Lakhs / annum`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Beneficiary Target</span>
                  <span className="font-medium text-slate-800">{scheme.targetGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    {scheme.isUpcoming ? 'Application Opening Date' : 'Application Window'}
                  </span>
                  <span className="font-medium text-slate-800">
                    {scheme.openingDate || scheme.applicationPeriod}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-sm">Official Eligibility Criteria</h5>
                <p className="text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
                  {scheme.eligibility}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-sm">Key Benefits & Allowances</h5>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  {scheme.keyBenefitsList.map((benefit, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-sm">Mandatory Verified Documents</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scheme.mandatoryDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-200 text-xs cursor-pointer"
              >
                Close
              </button>

              {scheme.isUpcoming ? (
                <button
                  id={`btn-modal-notify-${scheme.id}`}
                  onClick={() => {
                    setShowDetails(false);
                    onNotifyMe && onNotifyMe(scheme);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  <span>{isSubscribed ? t('btn_subscribed') || 'Subscribed' : t('btn_notify_me') || 'Notify Me'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    onApply(scheme.id);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{t('btn_apply_now')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
