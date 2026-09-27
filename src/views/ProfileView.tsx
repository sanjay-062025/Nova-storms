import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  GraduationCap,
  FileText,
  Landmark,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  Fingerprint,
  ScanFace,
  Eye,
  EyeOff,
  HardDrive,
  Download,
  Clock,
  Key,
  Shield,
  Sliders,
  Settings,
  X
} from 'lucide-react';
import {
  StudentProfile,
  PaymentMethod,
  DocumentItem,
  VerificationModuleStatus,
  Mentor,
  Application
} from '../types';
import { PaymentMethodSection } from '../components/PaymentMethodSection';
import { DocumentWalletSection } from '../components/DocumentWalletSection';
import { MentorConnectSection } from '../components/MentorConnectSection';
import { BiometricAuthModal, BiometricMode } from '../components/BiometricAuthModal';
import { BiometricSecuritySettings } from '../components/BiometricSecuritySettings';
import { SensitiveScholarshipDossier } from '../components/SensitiveScholarshipDossier';
import { BiometricSetupModal } from '../components/BiometricSetupModal';
import {
  createOfflineSnapshot,
  saveOfflineSnapshotToCache,
  downloadOfflineSnapshotHtml
} from '../utils/offlineSnapshot';
import {
  isBiometricAuthEnabled,
  getStoredBiometricToken,
  getStoredConfirmationToken,
  saveBiometricToken,
  removeBiometricToken,
  generateMockSecureToken,
  MockBiometricToken,
  BiometricConfirmationRecord
} from '../utils/biometricAuth';
import { useLanguage } from '../i18n/LanguageContext';

interface ProfileViewProps {
  profile: StudentProfile;
  paymentMethod: PaymentMethod;
  documents: DocumentItem[];
  verificationModules: VerificationModuleStatus[];
  mentors: Mentor[];
  onOpenUnifiedVerification: () => void;
  onUpdatePaymentMethod: (data: { bankName: string; ifsc: string }) => void;
  onUseDocument: (doc: DocumentItem) => void;
  applications?: Application[];
  onOpenOfflineSnapshot?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  paymentMethod,
  documents,
  verificationModules,
  mentors,
  onOpenUnifiedVerification,
  onUpdatePaymentMethod,
  onUseDocument,
  applications = [],
  onOpenOfflineSnapshot
}) => {
  const { t } = useLanguage();

  // Biometric Auth & Token State from localStorage
  const [isBiometricAuthEnabledState, setIsBiometricAuthEnabledState] = useState<boolean>(() =>
    isBiometricAuthEnabled()
  );
  const [storedToken, setStoredToken] = useState<MockBiometricToken | null>(() =>
    getStoredBiometricToken()
  );
  const [storedConfirmationToken, setStoredConfirmationToken] = useState<BiometricConfirmationRecord | null>(() =>
    getStoredConfirmationToken()
  );

  const [isBiometricUnlocked, setIsBiometricUnlocked] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isGuidedSetupOpen, setIsGuidedSetupOpen] = useState(false);
  const [authenticatedWith, setAuthenticatedWith] = useState<BiometricMode | null>(null);
  const [authTimestamp, setAuthTimestamp] = useState<string | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [statusToast, setStatusToast] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const isSensitiveDataMasked = isBiometricAuthEnabledState && !isBiometricUnlocked;

  const showToast = (type: 'success' | 'info', message: string) => {
    setStatusToast({ type, message });
    setTimeout(() => {
      setStatusToast(null);
    }, 5500);
  };

  const handleDownloadSnapshot = () => {
    const snap = createOfflineSnapshot(profile, applications);
    saveOfflineSnapshotToCache(snap);
    downloadOfflineSnapshotHtml(snap);
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3500);
  };

  const handleAuthenticated = (mode: BiometricMode) => {
    setIsBiometricUnlocked(true);
    setAuthenticatedWith(mode);
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setAuthTimestamp(timeStr);

    // If biometric auth is enabled, refresh/store updated mock token in localStorage
    if (isBiometricAuthEnabledState) {
      const refreshedToken = generateMockSecureToken(profile.id || profile.studentId, mode);
      saveBiometricToken(refreshedToken);
      setStoredToken(refreshedToken);
    }

    showToast('success', `Biometric authentication verified via ${mode === 'face' ? 'Face ID' : 'Fingerprint'}. Sensitive scholarship data is decrypted.`);
  };

  const handleLockSession = () => {
    setIsBiometricUnlocked(false);
    setAuthenticatedWith(null);
    setAuthTimestamp(null);
    showToast('info', 'Active session locked. Sensitive scholarship records are masked.');
  };

  // Callback when guided setup flow finishes handshake and confirms token
  const handleGuidedSetupCompleted = (
    confRecord: BiometricConfirmationRecord,
    secToken: MockBiometricToken
  ) => {
    setIsBiometricAuthEnabledState(true);
    setStoredToken(secToken);
    setStoredConfirmationToken(confRecord);
    setIsBiometricUnlocked(true);
    setAuthenticatedWith(confRecord.authMethod === 'face' ? 'face' : 'fingerprint');
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setAuthTimestamp(timeStr);
    showToast(
      'success',
      `Biometric hardware handshake verified! Confirmation token saved to localStorage (${confRecord.confirmationToken.slice(0, 22)}...). Sensitive scholarship records unlocked.`
    );
  };

  // Toggle 'Use Biometric Authentication'
  const handleToggleBiometricAuth = () => {
    if (isBiometricAuthEnabledState) {
      // Turn OFF
      removeBiometricToken();
      setIsBiometricAuthEnabledState(false);
      setStoredToken(null);
      setStoredConfirmationToken(null);
      setIsBiometricUnlocked(false);
      setAuthenticatedWith(null);
      setAuthTimestamp(null);
      showToast('info', 'Use Biometric Authentication disabled. Tokens removed from localStorage.');
    } else {
      // Turn ON -> Launch Guided Setup Flow so user experiences hardware handshake animation
      setIsGuidedSetupOpen(true);
    }
  };

  // Regenerate fresh cryptographic token
  const handleRegenerateToken = () => {
    const regenerated = generateMockSecureToken(
      profile.id || profile.studentId,
      authenticatedWith || 'fingerprint'
    );
    saveBiometricToken(regenerated);
    setStoredToken(regenerated);
    showToast('success', 'Mock cryptographic token regenerated with new nonce and saved in localStorage!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusToast && (
        <div
          role="status"
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-300 ${
            statusToast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-600'
              : 'bg-slate-900 text-slate-200 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {statusToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{statusToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Aadhaar Biometric Privacy Shield Banner */}
      <section
        id="banner-biometric-shield"
        className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          !isBiometricAuthEnabledState
            ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-slate-700'
            : isBiometricUnlocked
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-emerald-700/50'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-slate-800'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
              !isBiometricAuthEnabledState
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : isBiometricUnlocked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-sm'
                : 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
            }`}
          >
            {!isBiometricAuthEnabledState ? (
              <Sliders className="w-6 h-6 text-slate-300" />
            ) : isBiometricUnlocked ? (
              authenticatedWith === 'face' ? (
                <ScanFace className="w-6 h-6 text-emerald-400" />
              ) : (
                <Fingerprint className="w-6 h-6 text-emerald-400" />
              )
            ) : (
              <Lock className="w-6 h-6 text-amber-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {!isBiometricAuthEnabledState
                  ? 'Biometric Privacy Shield: Inactive'
                  : isBiometricUnlocked
                  ? 'Aadhaar Biometric Session Active'
                  : 'Aadhaar Biometric Privacy Shield Active'}
              </h3>
              {!isBiometricAuthEnabledState ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Standard Protection
                </span>
              ) : isBiometricUnlocked ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>
                    Verified via {authenticatedWith === 'face' ? 'FaceID' : 'Fingerprint'} at{' '}
                    {authTimestamp}
                  </span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Sensitive Data Masked</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              {!isBiometricAuthEnabledState
                ? 'Biometric authentication is currently disabled in Settings. Enable "Use Biometric Authentication" below to store an encrypted mock token in localStorage and protect sensitive scholarship data.'
                : isBiometricUnlocked
                ? 'Confidential banking, scholarship grant sanction IDs, and Aadhaar credentials are unmasked for this active session. Re-lock anytime to restore data masking.'
                : 'Sensitive identity numbers, banking account codes, and revenue certificates are encrypted under MeitY data governance. Authenticate to view unmasked records.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center flex-wrap">
          {!isBiometricAuthEnabledState ? (
            <>
              <button
                id="btn-banner-start-guided-setup"
                type="button"
                onClick={() => setIsGuidedSetupOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Start Guided Setup</span>
              </button>

              <a
                href="#section-security-settings"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-300 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>Settings</span>
              </a>
            </>
          ) : isBiometricUnlocked ? (
            <div className="flex items-center gap-2 flex-wrap">
              {storedConfirmationToken && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hidden md:inline-flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  <span>Handshake Confirmed ({storedConfirmationToken.handshakeLatencyMs}ms)</span>
                </span>
              )}

              <button
                id="btn-lock-biometric-session"
                type="button"
                onClick={handleLockSession}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-600 font-bold text-xs transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Lock Sensitive Data</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-trigger-biometric-unlock"
                type="button"
                onClick={() => setIsBiometricModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <ScanFace className="w-4 h-4 text-emerald-100" />
                <Fingerprint className="w-4 h-4 text-emerald-100" />
                <span>Unlock with Biometrics</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-slate-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {profile.category} • {profile.tribe || profile.subTribe}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  e-KYC Verified
                </span>

                {!isBiometricAuthEnabledState ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    Standard View
                  </span>
                ) : isBiometricUnlocked ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <Unlock className="w-3 h-3 text-emerald-700" />
                    Biometrics Verified
                  </span>
                ) : (
                  <button
                    onClick={() => setIsBiometricModalOpen(true)}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Lock className="w-3 h-3 text-amber-700" />
                    Masked Records
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Unified Student Identification Number:{' '}
                <span className="font-mono font-bold text-slate-800">
                  {profile.id || profile.studentId}
                </span>
              </p>
            </div>
          </div>

          <button
            id="btn-inspect-verification-layer"
            onClick={onOpenUnifiedVerification}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-center"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Inspect Unified Verification Layer</span>
          </button>
        </div>

        {/* Profile Detail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Category & Domicile</span>
            <span className="font-bold text-slate-900">
              {profile.category} ({profile.domicile || profile.state})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Tribe / Community</span>
            <span className="font-bold text-slate-900">{profile.tribe || profile.subTribe}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Annual Family Income</span>
            <div>
              <span className="font-bold text-emerald-800 block">
                ₹{(profile.annualIncome ?? profile.annualFamilyIncome ?? 180000).toLocaleString('en-IN')}{' '}
                / year
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isSensitiveDataMasked
                  ? 'Cert #REV/••••••••'
                  : 'Cert #REV/2026/JH-89104'}
              </span>
            </div>
          </div>

          {/* Aadhaar Number with interactive unlock */}
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Aadhaar (UIDAI Verified)</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {!isSensitiveDataMasked ? (
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  <span className="font-mono font-extrabold text-emerald-950">5829 1042 4892</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-800">{profile.aadhaarMask}</span>
                  <button
                    id="btn-unlock-aadhaar-inline"
                    onClick={() => setIsBiometricModalOpen(true)}
                    className="text-[10px] text-emerald-800 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <Lock className="w-2.5 h-2.5 text-amber-600" />
                    <span>Unlock</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <span className="text-slate-400 block text-[11px] mb-0.5">Enrolled Institution</span>
            <span className="font-bold text-slate-900">{profile.college || profile.institution}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Course of Study</span>
            <span className="font-bold text-slate-900">{profile.currentCourse}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Academic Progress</span>
            <span className="font-bold text-slate-900">
              Year {profile.currentYear || 3} • {profile.marksPercentage || 84.6}%
            </span>
          </div>

          {/* Contact Details (Phone & Email) */}
          <div className="col-span-2 sm:col-span-2 pt-2 border-t border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-0.5">
              Verified Student Contact (DigiLocker & SMS Alerts)
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono font-medium text-slate-800">
                {!isSensitiveDataMasked ? '+91 98765 43210' : '+91 ••••• ••210'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-medium text-slate-800">
                {!isSensitiveDataMasked ? 'sanjay.kumar@nitjsr.ac.in' : 's•••••@nitjsr.ac.in'}
              </span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2 pt-2 border-t border-slate-100">
            <span className="text-slate-400 block text-[11px] mb-0.5">Biometric Encryption Standard</span>
            <span className="text-[11px] text-slate-600">
              FIDO2 / WebAuthn Level 2 • UIDAI 2.0 RD Service Certified
            </span>
          </div>
        </div>
      </div>

      {/* Sensitive Scholarship Data Dossier (Protected by Biometric Security) */}
      <SensitiveScholarshipDossier
        profile={profile}
        paymentMethod={paymentMethod}
        isBiometricEnabled={isBiometricAuthEnabledState}
        isBiometricUnlocked={isBiometricUnlocked}
        onTriggerBiometric={() => setIsBiometricModalOpen(true)}
        onLockSession={handleLockSession}
        authTimestamp={authTimestamp}
        authMethod={authenticatedWith}
      />

      {/* Security & Privacy Settings with 'Use Biometric Authentication' Toggle */}
      <BiometricSecuritySettings
        isBiometricEnabled={isBiometricAuthEnabledState}
        isUnlocked={isBiometricUnlocked}
        storedToken={storedToken}
        storedConfirmationToken={storedConfirmationToken}
        authenticatedWith={authenticatedWith}
        authTimestamp={authTimestamp}
        onToggle={handleToggleBiometricAuth}
        onOpenGuidedSetup={() => setIsGuidedSetupOpen(true)}
        onTriggerBiometric={() => setIsBiometricModalOpen(true)}
        onLockSession={handleLockSession}
        onRegenerateToken={handleRegenerateToken}
        studentId={profile.id || profile.studentId}
      />

      {/* Offline Scholarship Snapshot Card */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-2xl border border-amber-500/30 p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {t('offline_snapshot_title')}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t('offline_cached_badge')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {t('offline_snapshot_desc')}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-amber-300/80 font-mono mt-2">
                <span>Ref: SNAP-{(profile.studentId || profile.id || 'ST2026').slice(0, 12)}</span>
                <span>•</span>
                <span>Includes {applications.length} Active Schemes & DBT Mandate</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {onOpenOfflineSnapshot && (
              <button
                id="btn-view-offline-snapshot-profile"
                type="button"
                onClick={onOpenOfflineSnapshot}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-300" />
                <span>{t('btn_view_offline_snapshot')}</span>
              </button>
            )}

            <button
              id="btn-download-snapshot-profile"
              type="button"
              onClick={handleDownloadSnapshot}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{t('btn_download_offline_snapshot')}</span>
            </button>
          </div>
        </div>

        {downloadSuccessToast && (
          <div className="mt-3 bg-emerald-700/80 border border-emerald-500/50 rounded-xl px-4 py-2 text-xs font-bold text-white flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Standalone Offline HTML Snapshot downloaded! You can open it anytime without internet.</span>
          </div>
        )}
      </div>

      {/* Payment Method / Preferred DBT Account */}
      <PaymentMethodSection
        paymentMethod={paymentMethod}
        onUpdateMethod={onUpdatePaymentMethod}
        isBiometricUnlocked={!isSensitiveDataMasked}
        onTriggerBiometric={() => setIsBiometricModalOpen(true)}
      />

      {/* Digital Document Wallet (DigiLocker Ready) */}
      <DocumentWalletSection
        documents={documents}
        digiLockerConnected={true}
        onUseForApplication={onUseDocument}
      />

      {/* Mentor Connect Section */}
      <MentorConnectSection mentors={mentors} studentName={profile.name} />

      {/* Biometric Authentication Modal Simulation */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        studentName={profile.name}
        onClose={() => setIsBiometricModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* Guided Biometric Setup Flow with Hardware Handshake Simulation */}
      <BiometricSetupModal
        isOpen={isGuidedSetupOpen}
        onClose={() => setIsGuidedSetupOpen(false)}
        onCompleted={handleGuidedSetupCompleted}
        studentId={profile.id || profile.studentId}
        studentName={profile.name}
      />
    </div>
  );
};
