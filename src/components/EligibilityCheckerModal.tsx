import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  HelpCircle,
  Calculator,
  Loader2,
  Info,
  ChevronRight
} from 'lucide-react';
import { EligibilityCheckPayload, SchemeEligibilityResult, EntitlementWalletData } from '../types';
import { api } from '../services/api';

interface EligibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletUpdated: (wallet: EntitlementWalletData) => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  isOpen,
  onClose,
  onWalletUpdated
}) => {
  const [formData, setFormData] = useState<EligibilityCheckPayload>({
    studentCategory: 'ST',
    hasStCertificate: true,
    annualFamilyIncome: 180000,
    academicLevel: 'Undergraduate',
    institutionType: 'Premier',
    marksPercentage: 84,
    disabilityStatus: false,
    state: 'Jharkhand',
    domicile: 'Jharkhand',
    course: 'B.Tech Computer Science',
    hasNetJrf: false,
    hasOverseasAdmission: false
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SchemeEligibilityResult[] | null>(null);
  const [evaluatedWallet, setEvaluatedWallet] = useState<EntitlementWalletData | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.checkEligibility(formData);
      if (response.success) {
        setResults(response.results);
        setEvaluatedWallet(response.entitlementWallet);
        onWalletUpdated(response.entitlementWallet);
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="modal-eligibility-checker"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-700/60 border border-emerald-500/40 text-amber-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                MoTA Unified Eligibility & Entitlement Engine
              </h3>
              <p className="text-xs text-emerald-200">
                Instantly evaluate all 5 Scheduled Tribe central scholarship schemes
              </p>
            </div>
          </div>
          <button
            id="btn-close-checker"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {!results ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  Information below is pre-filled from your registered student profile and verified certificates. Adjust parameters to simulate alternative scholarship eligibility scenarios.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Category *
                  </label>
                  <select
                    value={formData.studentCategory}
                    onChange={(e) => setFormData({ ...formData, studentCategory: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  >
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="General">General / EWS</option>
                  </select>
                </div>

                {/* ST Certificate Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ST Certificate Verification *
                  </label>
                  <select
                    value={formData.hasStCertificate ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, hasStCertificate: e.target.value === 'yes' })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  >
                    <option value="yes">✓ Verified by State Revenue Registry</option>
                    <option value="no">Pending / Unverified</option>
                  </select>
                </div>

                {/* Annual Family Income */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Annual Family Income (₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={2000000}
                      step={10000}
                      value={formData.annualFamilyIncome}
                      onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value) })}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium pl-8"
                    />
                    <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Post-Matric ceiling: ₹2.5L | Top Class ceiling: ₹6.0L
                  </span>
                </div>

                {/* Academic Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Academic Level *
                  </label>
                  <select
                    value={formData.academicLevel}
                    onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  >
                    <option value="Class 9-10">Class 9th or 10th (Secondary)</option>
                    <option value="Class 11-12">Class 11th or 12th (Senior Sec)</option>
                    <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, MBBS, etc.)</option>
                    <option value="Postgraduate">Postgraduate (M.Tech, MBA, M.Sc, etc.)</option>
                    <option value="MPhil/PhD">M.Phil or Ph.D. Research</option>
                    <option value="Overseas Master/PhD">Overseas Masters or Ph.D.</option>
                  </select>
                </div>

                {/* Institution Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institution Accreditation / Type *
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  >
                    <option value="Premier">Top Class Premier (IIT / NIT / IIM / AIIMS / NLU)</option>
                    <option value="Government">Recognized Government University / College</option>
                    <option value="PrivateRecognized">Private Accredited (AISHE Registered)</option>
                    <option value="International">Foreign Top 500 QS University</option>
                  </select>
                </div>

                {/* Previous Marks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Exam Marks / Percentage (%) *
                  </label>
                  <input
                    type="number"
                    min={35}
                    max={100}
                    value={formData.marksPercentage}
                    onChange={(e) => setFormData({ ...formData, marksPercentage: Number(e.target.value) })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Verified with CBSE / DigiLocker marksheet
                  </span>
                </div>

                {/* State / Domicile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Domicile State *
                  </label>
                  <input
                    type="text"
                    value={formData.domicile}
                    onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course of Study *
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Special Checkboxes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Advanced Qualifications (for Fellowship / Overseas schemes):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasNetJrf}
                      onChange={(e) => setFormData({ ...formData, hasNetJrf: e.target.checked })}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-slate-700 font-medium">UGC-NET / CSIR JRF Qualified</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasOverseasAdmission}
                      onChange={(e) => setFormData({ ...formData, hasOverseasAdmission: e.target.checked })}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-slate-700 font-medium">QS Top 500 Foreign Admission</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.disabilityStatus}
                      onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-slate-700 font-medium">UDID Card Holder (PWD)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating MoTA Schemes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Evaluate Eligibility & Update Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-5 animate-in fade-in">
              {/* Entitlement Wallet Update Flash Card */}
              {evaluatedWallet && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 text-white border border-emerald-700/60 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Updated Entitlement Wallet
                      </span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                        ₹{evaluatedWallet.totalEstimatedEntitlement.toLocaleString('en-IN')} / year
                      </h4>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-100">
                      {evaluatedWallet.eligibleSchemesCount} Eligible Scheme(s)
                    </div>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Based on the information provided. Estimated entitlement. Final eligibility is subject to official verification.
                  </p>
                </div>
              )}

              {/* Individual Scheme Result Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Detailed Scheme Evaluations (All 5 MoTA Schemes)
                </h4>

                {results.map((res) => {
                  const isEligible = res.status === 'Eligible';
                  const isPotential = res.status === 'Potentially Eligible';

                  return (
                    <div
                      key={res.schemeId}
                      className={`p-4 rounded-xl border transition-all ${
                        isEligible
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : isPotential
                          ? 'border-amber-300 bg-amber-50/40'
                          : 'border-slate-200 bg-slate-50/40 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isEligible && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                              </span>
                            )}
                            {isPotential && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                                <AlertCircle className="w-3.5 h-3.5" /> Potentially Eligible
                              </span>
                            )}
                            {!isEligible && !isPotential && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-300">
                                <XCircle className="w-3.5 h-3.5" /> Not Eligible
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-900">{res.schemeName}</h5>
                        </div>

                        {res.benefitAmount > 0 && (
                          <div className="text-left sm:text-right">
                            <span className="text-[11px] text-slate-500 block">Benefit</span>
                            <span className="text-base font-extrabold text-emerald-800">
                              ₹{res.benefitAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Criteria rationale */}
                      <ul className="text-xs text-slate-600 space-y-1 mb-2">
                        {res.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Next step: {res.actionRecommendation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setResults(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-300"
                >
                  Adjust Parameters
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  Done & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
