import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  RefreshCw,
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Building2,
  CreditCard,
  QrCode,
  Sparkles
} from 'lucide-react';
import {
  StudentProfile,
  Application,
  PaymentSummary,
  PaymentRecord,
  EntitlementWalletData,
  VerificationModuleStatus,
  CachedOfflineSnapshot
} from '../types';
import {
  createOfflineSnapshot,
  saveOfflineSnapshotToCache,
  getStoredOfflineSnapshot,
  downloadOfflineSnapshotHtml,
  downloadOfflineSnapshotJson
} from '../utils/offlineSnapshot';
import { useLanguage } from '../i18n/LanguageContext';

interface OfflineSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  applications: Application[];
  wallet?: EntitlementWalletData;
  paymentSummary?: PaymentSummary;
  payments?: PaymentRecord[];
  verificationModules?: VerificationModuleStatus[];
}

export const OfflineSnapshotModal: React.FC<OfflineSnapshotModalProps> = ({
  isOpen,
  onClose,
  profile,
  applications,
  wallet,
  paymentSummary,
  payments,
  verificationModules
}) => {
  const { t } = useLanguage();
  const [snapshot, setSnapshot] = useState<CachedOfflineSnapshot | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Initialize or load snapshot
  useEffect(() => {
    if (!isOpen) return;

    const stored = getStoredOfflineSnapshot();
    if (stored) {
      setSnapshot(stored);
    } else {
      // Create initial snapshot from live data
      const initial = createOfflineSnapshot(
        profile,
        applications,
        wallet,
        paymentSummary,
        payments,
        verificationModules
      );
      saveOfflineSnapshotToCache(initial);
      setSnapshot(initial);
    }
  }, [isOpen, profile, applications, wallet, paymentSummary, payments, verificationModules]);

  if (!isOpen) return null;

  const handleRefreshSnapshot = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const updated = createOfflineSnapshot(
        profile,
        applications,
        wallet,
        paymentSummary,
        payments,
        verificationModules
      );
      saveOfflineSnapshotToCache(updated);
      setSnapshot(updated);
      setIsUpdating(false);
      setDownloadSuccess('Cache updated with latest portal data');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 400);
  };

  const handleDownloadHtml = () => {
    if (!snapshot) return;
    downloadOfflineSnapshotHtml(snapshot);
    setDownloadSuccess('Offline HTML Snapshot downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadJson = () => {
    if (!snapshot) return;
    downloadOfflineSnapshotJson(snapshot);
    setDownloadSuccess('Offline JSON data file saved.');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentSnapshot = snapshot || createOfflineSnapshot(profile, applications, wallet, paymentSummary, payments, verificationModules);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-snapshot-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="offline-snapshot-title" className="text-base font-bold text-white leading-tight">
                  Offline Scholarship Snapshot
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cached & Offline-Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Read-only official reference card for use in low or zero-connectivity areas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Meta Ribbon */}
        <div className="bg-amber-50 border-b border-amber-200/70 px-5 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Reference:</strong>{' '}
              <span className="font-mono font-semibold">{currentSnapshot.referenceId}</span>
            </span>
            <span className="text-amber-400">•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Cached on: <strong>{currentSnapshot.formattedDate}</strong>
            </span>
          </div>

          <button
            onClick={handleRefreshSnapshot}
            disabled={isUpdating}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100/70 transition-colors shadow-2xs cursor-pointer text-[11px]"
            title="Refresh the cached snapshot with current online data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-amber-600' : 'text-amber-700'}`} />
            <span>{isUpdating ? 'Refreshing...' : 'Update Snapshot'}</span>
          </button>
        </div>

        {/* Success Toast / Notification */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              {downloadSuccess}
            </span>
            <button onClick={() => setDownloadSuccess(null)} className="text-emerald-200 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 mb-0.5">
                Zero-Connectivity Portability Guarantee
              </p>
              <p>
                This cached snapshot is encrypted into your device's browser memory. You can download the self-contained HTML file to open, show to verification officers, or print anytime without requiring cellular data or Wi-Fi.
              </p>
            </div>
          </div>

          {/* Student Profile Particulars */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Student Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Full Name</span>
                <span className="text-sm font-bold text-slate-900">{profile.name}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Unified Student ID</span>
                <span className="text-sm font-mono font-bold text-indigo-700">{profile.studentId || 'ST-2026-JH-8831'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">ST Category / Tribe</span>
                <span className="text-sm font-semibold text-slate-900">{profile.tribe || profile.subTribe || profile.category}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[11px] text-slate-500 font-medium block">Enrolled Institution</span>
                <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> {profile.institution || profile.college || 'National Institute of Technology Jamshedpur'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Annual Family Income</span>
                <span className="text-sm font-bold text-emerald-700">₹{(profile.annualIncome ?? profile.annualFamilyIncome ?? 180000).toLocaleString('en-IN')} / yr</span>
              </div>
            </div>
          </div>

          {/* Active Applications Status Table */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Active Scholarship Applications ({applications.length})
              </h4>
              <span className="text-[11px] text-slate-500">Read-only offline record</span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {app.applicationNumber}
                      </span>
                      <h5 className="font-bold text-sm text-slate-900 mt-1">{app.schemeName}</h5>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        app.status === 'Escalated'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : app.status === 'Disbursed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : app.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block">Submitted</span>
                      <span className="font-medium text-slate-700">{app.formattedSubmittedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Verification</span>
                      <span className="font-medium text-slate-700">{app.verificationStatus}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Disbursement</span>
                      <span className="font-semibold text-emerald-700">{app.disbursementStatus}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Academic Year</span>
                      <span className="font-medium text-slate-700">{app.academicYear}</span>
                    </div>
                  </div>

                  {app.grievanceId && (
                    <div className="mt-2 text-[11px] bg-rose-50 text-rose-800 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        <strong>Proactive Grievance Filed:</strong> Ticket #{app.grievanceId} (Assigned to Nodal Officer)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DBT & Bank Mandate */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Direct Benefit Transfer (DBT) Mandate
            </h4>
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  SBI
                </div>
                <div>
                  <p className="font-bold text-slate-900">State Bank of India (••• 4019)</p>
                  <p className="text-slate-500 text-[11px]">Aadhaar Payment Bridge (APBS) Active</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                DBT Ready
              </span>
            </div>
          </div>

          {/* Verification Checksum and Tamper Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                MoTA Cryptographic Checksum
              </span>
              <p className="font-mono text-[11px] text-slate-200 break-all">
                {currentSnapshot.checksum}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 text-[11px] font-semibold">
              <QrCode className="w-4 h-4" />
              <span>Offline Verified</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Cached in browser storage</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJson}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              title="Download structured JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>JSON</span>
            </button>

            <button
              id="btn-download-html-snapshot"
              onClick={handleDownloadHtml}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Download standalone offline HTML file"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Download Offline Card (.html)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
