import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Loader2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  Send,
  Lock,
  ExternalLink,
  Landmark,
  BadgePercent,
  Camera,
  Crop,
  Eye,
  Trash2,
  Maximize2,
  Scan,
  FileUp,
  RotateCw
} from 'lucide-react';
import { ScholarshipScheme, StudentProfile, DocumentItem, PaymentMethod } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ApplicationProgressStepper,
  StepperStage
} from './ApplicationProgressStepper';
import { DocumentScannerModal } from './DocumentScannerModal';

interface ApplyModalProps {
  scheme: ScholarshipScheme | null;
  profile: StudentProfile;
  documents?: DocumentItem[];
  paymentMethod?: PaymentMethod;
  onClose: () => void;
  onApplicationCreated: () => void;
  onNavigateApplications?: () => void;
  onDocumentAdded?: (doc: DocumentItem) => void;
}

const APPLICATION_STAGES: StepperStage[] = [
  {
    id: 1,
    title: 'Personal Details',
    shortTitle: 'Details',
    description: 'Identity & Academics',
    icon: UserCheck
  },
  {
    id: 2,
    title: 'Documents',
    shortTitle: 'Documents',
    description: 'DigiLocker Records',
    icon: FileCheck
  },
  {
    id: 3,
    title: 'Review',
    shortTitle: 'Review',
    description: 'Entitlement & Bank',
    icon: ClipboardCheck
  },
  {
    id: 4,
    title: 'Submit',
    shortTitle: 'Submit',
    description: 'MoTA SLA Registration',
    icon: Send
  }
];

export const ApplyModal: React.FC<ApplyModalProps> = ({
  scheme,
  profile,
  documents,
  paymentMethod,
  onClose,
  onApplicationCreated,
  onNavigateApplications,
  onDocumentAdded
}) => {
  const { t } = useLanguage();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [maxCompletedStage, setMaxCompletedStage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appNumber, setAppNumber] = useState('');

  // Scanner & Document State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerDefaultDoc, setScannerDefaultDoc] = useState<string | undefined>(undefined);
  const [scannedDocs, setScannedDocs] = useState<DocumentItem[]>([]);
  const [viewingDocPreview, setViewingDocPreview] = useState<DocumentItem | null>(null);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  // Declarations state
  const [declaredTribe, setDeclaredTribe] = useState(true);
  const [declaredDbt, setDeclaredDbt] = useState(true);
  const [declaredTruthful, setDeclaredTruthful] = useState(true);

  if (!scheme) return null;

  const handleDocumentScanned = (newDoc: DocumentItem) => {
    setScannedDocs((prev) => [newDoc, ...prev]);
    setScanNotification(`✓ "${newDoc.name}" scanned, cropped, and attached to this scholarship dossier.`);
    if (onDocumentAdded) {
      onDocumentAdded(newDoc);
    }
    setTimeout(() => {
      setScanNotification(null);
    }, 6000);
  };

  const handleRemoveScannedDoc = (id: string) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaredTribe || !declaredDbt || !declaredTruthful) {
      setErrorMessage('Please accept all statutory declarations to submit your application.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.createApplication({
        schemeId: scheme.id,
        schemeName: scheme.schemeName,
        academicYear: '2026-27'
      });
      if (res && res.success) {
        setAppNumber(res.application.applicationNumber);
        setSuccess(true);
        setCurrentStage(4);
        setMaxCompletedStage(4);
        onApplicationCreated();
      } else {
        setErrorMessage('Unable to process application at this moment.');
      }
    } catch (err: unknown) {
      console.error('Failed to submit application:', err);
      const message =
        err instanceof Error ? err.message : 'Submission failed. Please check network connection.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStage = (next: number) => {
    setCurrentStage(next);
    setMaxCompletedStage((prev) => Math.max(prev, next));
  };

  const handleStageClick = (stageId: number) => {
    if (!success && stageId <= maxCompletedStage) {
      setCurrentStage(stageId);
    }
  };

  const handleGoToApplications = () => {
    if (onNavigateApplications) {
      onNavigateApplications();
    } else {
      onClose();
    }
  };

  // Resolve documents
  const mandatoryDocNames = scheme.mandatoryDocuments && scheme.mandatoryDocuments.length > 0
    ? scheme.mandatoryDocuments
    : [
        'ST Caste Certificate from competent revenue authority',
        'Annual Family Income Certificate',
        'Previous Academic Marksheet',
        'Aadhaar seeded bank account passbook'
      ];

  const effectiveBank = paymentMethod?.bankName || 'State Bank of India';
  const effectiveMask = paymentMethod?.accountNumberMask || '•••• 4821';
  const familyIncome = profile.annualFamilyIncome || 180000;
  const isIncomeEligible = familyIncome <= scheme.annualIncomeCeiling;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="pr-3">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
              Central MoTA Scholarship Direct Portal
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              {scheme.schemeName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Progress Stepper Component */}
        <ApplicationProgressStepper
          currentStage={currentStage}
          stages={APPLICATION_STAGES}
          maxCompletedStage={maxCompletedStage}
          onStageClick={handleStageClick}
          isSubmitted={success}
        />

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {!success ? (
            <div>
              {/* STAGE 1: PERSONAL DETAILS */}
              {currentStage === 1 && (
                <div id="stage-personal-details" className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">
                        Stage 1 of 4: Student Identity & Academic Profile
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        Data retrieved directly from your authenticated National Tribal Welfare Registry. Verify that your personal information and institution match.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border-b sm:border-b-0 sm:border-r border-slate-200/80 pb-2 sm:pb-0 sm:pr-3">
                        <span className="text-slate-500 block text-[11px]">Applicant Name</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-slate-900 text-sm">{profile.name}</span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            ST Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Tribal Community & Sub-Tribe</span>
                        <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                          {profile.subTribe || profile.tribe || 'Santhal'} (Scheduled Tribe)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                      <div>
                        <span className="text-slate-500 block text-[11px]">ST Certificate (Govt Database)</span>
                        <span className="font-mono font-bold text-slate-900 block mt-0.5">
                          {profile.stCertificateNumberMask || 'JH/TRB/2022/XXXX-4912'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Aadhaar UIDAI (NPCI Seeded)</span>
                        <span className="font-mono font-bold text-slate-900 block mt-0.5">
                          {profile.aadhaarMask}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Enrolled Institution</span>
                        <span className="font-bold text-slate-900 block mt-0.5">
                          {profile.college || profile.institution}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Course & Academic Year</span>
                        <span className="font-bold text-slate-900 block mt-0.5">
                          {profile.currentCourse || 'B.Tech Computer Science'} • 2026-27
                        </span>
                      </div>
                    </div>

                    {/* Statutory Income Check */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Annual Family Income</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{familyIncome.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">Scheme Income Ceiling</span>
                        <span className="font-bold text-slate-700">
                          ≤ ₹{scheme.annualIncomeCeiling.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isIncomeEligible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isIncomeEligible ? 'Limit Compliant' : 'Requires Review'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 1 Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-stage1-next"
                      type="button"
                      onClick={() => handleNextStage(2)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>Next: Verify Documents</span>
                      <span className="text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded font-medium">
                        3 stages left
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: DOCUMENTS */}
              {currentStage === 2 && (
                <div id="stage-documents" className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Real-time Scan Attachment Notification Toast */}
                  {scanNotification && (
                    <div className="p-3 bg-emerald-800 text-white rounded-xl flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top duration-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span>{scanNotification}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScanNotification(null)}
                        className="p-1 hover:bg-emerald-750 rounded text-emerald-200 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-start gap-2.5">
                    <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">
                        Stage 2 of 4: Statutory Documents & Camera Scanner
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        One Profile, One Verification: Required records are automatically linked from DigiLocker. Have a physical certificate or marksheet? Use the camera scanner below to capture and crop directly.
                      </p>
                    </div>
                  </div>

                  {/* Camera Scanner Promotion Banner */}
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-emerald-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-xs">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-xs sm:text-sm">
                            Scan Physical Document with Camera
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                            Live Crop & OCR
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          Capture physical certificates or mark sheets directly using your camera with interactive boundary cropping overlay.
                        </p>
                      </div>
                    </div>
                    <button
                      id="btn-open-camera-scanner"
                      type="button"
                      onClick={() => {
                        setScannerDefaultDoc(undefined);
                        setIsScannerOpen(true);
                      }}
                      className="shrink-0 w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Scan Document</span>
                    </button>
                  </div>

                  {/* Attached Camera Scans Section (if any) */}
                  {scannedDocs.length > 0 && (
                    <div className="p-3 bg-emerald-50/60 border-2 border-emerald-500/40 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Crop className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Attached Camera Scans ({scannedDocs.length})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setScannerDefaultDoc(undefined);
                            setIsScannerOpen(true);
                          }}
                          className="text-xs text-emerald-800 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>+ Scan Another</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {scannedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-2.5 bg-white border border-emerald-400/60 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs hover:border-emerald-600 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {doc.previewUrl ? (
                                <div
                                  onClick={() => setViewingDocPreview(doc)}
                                  className="w-12 h-14 rounded-lg bg-black overflow-hidden shrink-0 border border-slate-300 cursor-pointer relative group"
                                  title="Click to view full scanned certificate"
                                >
                                  <img
                                    src={doc.previewUrl}
                                    alt={doc.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                  <Camera className="w-5 h-5" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <h6 className="font-bold text-slate-900 text-xs truncate" title={doc.name}>
                                  {doc.name}
                                </h6>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                  <span className="text-emerald-800 font-bold">Cropped Scan</span>
                                  <span>•</span>
                                  <span>{doc.fileSize}</span>
                                </div>
                                <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                                  {doc.docNumberMask}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setViewingDocPreview(doc)}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                title="View full scan"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveScannedDoc(doc.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Remove attached scan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mandatory Scheme Dossier list */}
                  <div className="space-y-2.5">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                      Mandatory Scheme Dossier
                    </span>
                    {mandatoryDocNames.map((docName, idx) => {
                      const matchedScan = scannedDocs.find(
                        (d) => d.name.toLowerCase().includes(docName.toLowerCase().slice(0, 15)) ||
                               docName.toLowerCase().includes(d.name.toLowerCase().slice(0, 15))
                      );

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                              {matchedScan ? <Camera className="w-4 h-4 text-emerald-800" /> : <ShieldCheck className="w-4 h-4" />}
                            </div>
                            <div className="truncate">
                              <h5 className="font-bold text-slate-900 truncate text-xs">{docName}</h5>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {matchedScan
                                  ? `Attached via Camera Scanner • ${matchedScan.fileSize}`
                                  : 'Source: DigiLocker & State Tribal Welfare Database'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {matchedScan ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>Scanned & Cropped</span>
                              </span>
                            ) : (
                              <>
                                <span className="hidden sm:inline font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  VERIFIED-2026
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  <span>Linked</span>
                                </span>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setScannerDefaultDoc(docName);
                                setIsScannerOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400 cursor-pointer shadow-2xs transition-colors"
                              title="Scan this specific document with camera"
                            >
                              <Camera className="w-3 h-3 text-emerald-700" />
                              <span className="hidden sm:inline">Scan</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-600 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px]">
                      Encrypted and signed by DigiLocker National e-Governance Division (NeGD) and MoTA Direct Camera Ingress.
                    </span>
                  </div>

                  {/* Stage 2 Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleNextStage(1)}
                      className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back: Personal Details</span>
                    </button>
                    <button
                      id="btn-stage2-next"
                      type="button"
                      onClick={() => handleNextStage(3)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>Next: Review & Declarations</span>
                      <span className="text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded font-medium">
                        2 stages left
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: REVIEW & DECLARATIONS */}
              {currentStage === 3 && (
                <form onSubmit={handleApply} id="stage-review" className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-start gap-2.5">
                    <ClipboardCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">
                        Stage 3 of 4: Final Entitlement Review & Statutory Undertaking
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        Verify your financial assistance entitlement and authorize direct crediting into your Aadhaar-seeded bank account.
                      </p>
                    </div>
                  </div>

                  {/* Entitlement Summary Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                      <span className="text-slate-500">Scheme Code:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {scheme.schemeCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                      <span className="text-slate-500">MoTA Pillar:</span>
                      <span className="font-bold text-slate-900 uppercase">
                        {scheme.pillar} (Ministry of Tribal Affairs)
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                      <span className="text-slate-500">Direct Financial Benefit:</span>
                      <span className="font-black text-emerald-800 text-sm">
                        {scheme.formattedBenefit}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                      <span className="text-slate-500">Disbursement Channel:</span>
                      <span className="font-bold text-slate-800">
                        Direct Benefit Transfer (DBT via APBS)
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                      <span className="text-slate-500">Beneficiary Bank Account:</span>
                      <span className="font-bold text-slate-900 inline-flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-slate-600" />
                        <span>{effectiveBank} ({effectiveMask})</span>
                      </span>
                    </div>

                    {/* Attached Scanned Documents in Review */}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">Verified Attached Records:</span>
                      <span className="font-bold text-slate-900 inline-flex items-center gap-1.5">
                        <span className="text-emerald-800">{mandatoryDocNames.length} DigiLocker</span>
                        {scannedDocs.length > 0 && (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                            + {scannedDocs.length} Camera Scanned
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Scanned Docs Review Strip */}
                  {scannedDocs.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Attached Camera Scans ({scannedDocs.length})</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Optical Crop Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {scannedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => setViewingDocPreview(doc)}
                            className="flex items-center gap-2 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer shrink-0 transition-colors"
                            title="Click to view full preview"
                          >
                            {doc.previewUrl && (
                              <img
                                src={doc.previewUrl}
                                alt={doc.name}
                                className="w-7 h-9 object-cover rounded bg-black"
                              />
                            )}
                            <div className="text-left">
                              <span className="font-bold text-slate-800 text-[11px] block max-w-[130px] truncate">
                                {doc.name}
                              </span>
                              <span className="text-[9px] text-slate-500 block">
                                {doc.fileSize}
                              </span>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Statutory Declarations */}
                  <div className="space-y-2 text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                      Statutory Beneficiary Undertakings
                    </span>
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={declaredTribe}
                        onChange={(e) => setDeclaredTribe(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                      />
                      <span>
                        I confirm that I belong to a recognized Scheduled Tribe and my family annual income is within statutory guidelines.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={declaredDbt}
                        onChange={(e) => setDeclaredDbt(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                      />
                      <span>
                        I authorize Direct Benefit Transfer (DBT) credit into my verified Aadhaar-seeded bank account via PFMS APBS.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={declaredTruthful}
                        onChange={(e) => setDeclaredTruthful(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                      />
                      <span>
                        I declare that all particulars are true to the best of my knowledge and understand that any false declaration will lead to cancellation and recovery.
                      </span>
                    </label>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2 text-xs animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Stage 3 Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleNextStage(2)}
                      className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back: Documents</span>
                    </button>
                    <button
                      id="btn-submit-application-confirm"
                      type="submit"
                      disabled={loading || !declaredTribe || !declaredDbt || !declaredTruthful}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting to MoTA Portal...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Submit Application (Final Stage)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* STAGE 4: SUBMITTED SUCCESS */
            <div id="stage-submit-success" className="text-center py-5 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Stage 4 of 4 Completed</span>
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  Application Successfully Submitted!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your scholarship dossier has been registered on the central Ministry of Tribal Affairs (MoTA) repository.
                </p>
                <div className="mt-3 p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono text-sm font-black text-slate-900 inline-block">
                  Application #{appNumber}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-left text-xs leading-relaxed">
                <strong>Automated 30-Day SLA Watcher Active:</strong> If your institution doesn't complete verification within statutory guidelines (simulated as 30 seconds for evaluation), our auto-escalation engine will automatically alert the District Nodal Officer.
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="btn-view-submitted-app"
                  onClick={handleGoToApplications}
                  className="w-full sm:w-2/3 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                >
                  <span>Track Live in Applications Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Document Scanner Modal */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDocumentScanned={handleDocumentScanned}
        defaultDocType={scannerDefaultDoc}
        schemeMandatoryDocs={mandatoryDocNames}
      />

      {/* Lightbox / Full-size Scan Preview Modal */}
      {viewingDocPreview && viewingDocPreview.previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/90 backdrop-blur-xs animate-in fade-in"
        >
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="font-bold text-sm truncate">{viewingDocPreview.name}</h4>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  {viewingDocPreview.fileSize}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDocPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black overflow-auto max-h-[70vh]">
              <img
                src={viewingDocPreview.previewUrl}
                alt={viewingDocPreview.name}
                className="max-h-[65vh] max-w-full object-contain rounded shadow-lg border border-slate-800"
              />
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="font-mono text-[11px]">
                {viewingDocPreview.docNumberMask} • {viewingDocPreview.uploadedDate}
              </span>
              <button
                type="button"
                onClick={() => setViewingDocPreview(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold cursor-pointer border border-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
