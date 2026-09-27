import React, { useState } from 'react';
import { Wallet, Sparkles, ChevronRight, CheckCircle2, ArrowRight, ShieldAlert, X, Info } from 'lucide-react';
import { EntitlementWalletData } from '../types';

interface EntitlementWalletCardProps {
  wallet: EntitlementWalletData;
  onOpenChecker: () => void;
  onApplyScheme: (schemeId: string) => void;
}

export const EntitlementWalletCard: React.FC<EntitlementWalletCardProps> = ({
  wallet,
  onOpenChecker,
  onApplyScheme
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      {/* Primary Wallet Card for Home Screen */}
      <section
        id="entitlement-wallet-card"
        aria-label="Your Entitlement Wallet"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-emerald-700/50"
      >
        {/* Subtle decorative background ring */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        <div className="absolute right-4 bottom-4 opacity-10 text-white pointer-events-none">
          <Wallet className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-700/60 border border-emerald-500/40 text-emerald-200">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Entitlement Engine
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Your Entitlement Wallet
                </h3>
              </div>
            </div>

            <button
              id="btn-recheck-eligibility"
              onClick={onOpenChecker}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-700/50 hover:bg-emerald-600/70 border border-emerald-500/40 text-emerald-100 transition-colors"
            >
              Re-check Criteria
            </button>
          </div>

          <p className="text-xs text-emerald-200/90 mb-4 max-w-lg leading-relaxed">
            Consolidated annual financial assistance calculated based on your verified tribal status, academic enrollment, and family income tier.
          </p>

          {/* Amount Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
              <span className="text-xs text-emerald-200 font-medium">
                Total Estimated Entitlement
              </span>
              <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {wallet.eligibleSchemesCount} eligible scheme{wallet.eligibleSchemesCount > 1 ? 's' : ''} identified
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                ₹{wallet.totalEstimatedEntitlement.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-200 font-medium">/ academic year</span>
            </div>

            {/* Micro Breakdown Preview */}
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {wallet.eligibleSchemes.map((scheme) => (
                <div key={scheme.schemeId} className="flex items-center justify-between text-emerald-100/90">
                  <span className="truncate pr-2 font-medium">• {scheme.schemeName}</span>
                  <span className="font-bold text-amber-300 shrink-0">{scheme.formattedBenefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="btn-view-eligible-schemes"
              onClick={() => setShowDetailModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>View Eligible Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-emerald-200/80 italic text-center sm:text-right">
              *Estimated entitlement. Subject to official verification.
            </span>
          </div>
        </div>
      </section>

      {/* Detailed Entitlement Modal / Drawer */}
      {showDetailModal && (
        <div
          id="modal-entitlement-details"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> MoTA Entitlement Portfolio
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Eligible Scholarship Entitlements
                </h3>
              </div>
              <button
                id="btn-close-entitlement-modal"
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Mandatory Official Disclaimer Banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Official Notice:</strong> Based on the information provided in your student profile and recent eligibility check. Estimated entitlement is ₹<strong>{wallet.totalEstimatedEntitlement.toLocaleString('en-IN')}</strong>. Final eligibility is strictly subject to official institutional, state, and central verification.
                </p>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Cumulative Annual Benefit</p>
                  <p className="text-2xl font-extrabold text-emerald-800">
                    ₹{wallet.totalEstimatedEntitlement.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">Beneficiary</p>
                  <p className="text-sm font-bold text-slate-800">Sanjay Kumar (ST)</p>
                </div>
              </div>

              {/* Scheme Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Eligible MoTA Schemes</span>
                  <span className="text-xs font-normal text-slate-500">({wallet.eligibleSchemes.length} schemes)</span>
                </h4>

                {wallet.eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme.schemeId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white transition-all shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ You appear eligible</span>
                        </div>
                        <h5 className="text-base font-bold text-slate-900 leading-snug">
                          {scheme.schemeName}
                        </h5>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-500 block">Estimated benefit:</span>
                        <span className="text-lg font-extrabold text-emerald-700">
                          {scheme.formattedBenefit}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                      <strong>Eligibility Reason:</strong> {scheme.reason}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Application Window: {scheme.applicationPeriod}
                      </span>
                      <button
                        id={`btn-apply-entitled-${scheme.schemeId}`}
                        onClick={() => {
                          setShowDetailModal(false);
                          onApplyScheme(scheme.schemeId);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Apply Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                id="btn-close-entitlement-footer"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Entitlement View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
