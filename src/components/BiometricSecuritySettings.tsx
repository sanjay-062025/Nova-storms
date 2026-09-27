import React, { useState } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  ScanFace,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  RefreshCw,
  Eye,
  X,
  FileCode,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles
} from 'lucide-react';
import { MockBiometricToken, BiometricConfirmationRecord } from '../utils/biometricAuth';
import { BiometricMode } from './BiometricAuthModal';

interface BiometricSecuritySettingsProps {
  isBiometricEnabled: boolean;
  isUnlocked: boolean;
  storedToken: MockBiometricToken | null;
  storedConfirmationToken: BiometricConfirmationRecord | null;
  authenticatedWith: BiometricMode | null;
  authTimestamp: string | null;
  onToggle: () => void;
  onOpenGuidedSetup: () => void;
  onTriggerBiometric: () => void;
  onLockSession: () => void;
  onRegenerateToken: () => void;
  studentId: string;
}

export const BiometricSecuritySettings: React.FC<BiometricSecuritySettingsProps> = ({
  isBiometricEnabled,
  isUnlocked,
  storedToken,
  storedConfirmationToken,
  authenticatedWith,
  authTimestamp,
  onToggle,
  onOpenGuidedSetup,
  onTriggerBiometric,
  onLockSession,
  onRegenerateToken,
  studentId
}) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasCopiedConfToken, setHasCopiedConfToken] = useState(false);

  const handleCopyConfirmationToken = () => {
    if (storedConfirmationToken?.confirmationToken) {
      navigator.clipboard?.writeText(storedConfirmationToken.confirmationToken);
      setHasCopiedConfToken(true);
      setTimeout(() => setHasCopiedConfToken(false), 2500);
    }
  };

  const handleCopyToken = () => {
    if (storedToken?.token) {
      navigator.clipboard?.writeText(storedToken.token);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  // Decode JWT payload for visualization
  const getDecodedPayload = () => {
    if (!storedToken?.token) return null;
    try {
      const parts = storedToken.token.split('.');
      if (parts.length >= 3) {
        const payloadStr = atob(parts[2]);
        return JSON.parse(payloadStr);
      }
    } catch {
      // Return structured fallback
    }
    return {
      iss: 'https://scholarships.gov.in/auth/biometric',
      sub: studentId,
      aud: 'mota-scholarship-portal',
      assurance: storedToken.assuranceLevel || 'AAL3',
      algorithm: storedToken.algorithm,
      scope: storedToken.scope,
      deviceId: storedToken.deviceId,
      issuedAt: storedToken.issuedAt,
      expiresAt: storedToken.expiresAt
    };
  };

  const decodedPayload = getDecodedPayload();

  return (
    <div id="section-security-settings" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Key className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Security & Privacy Settings
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                MeitY & UIDAI Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure multi-factor authentication, cryptographic tokens, and sensitive scholarship data protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isBiometricEnabled && isUnlocked && (
            <button
              type="button"
              onClick={onLockSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Lock Active Session</span>
            </button>
          )}
        </div>
      </div>

      {/* The Main 'Use Biometric Authentication' Toggle Card */}
      <div
        id="card-use-biometric-auth-toggle"
        className={`p-4 sm:p-5 rounded-xl border transition-all ${
          isBiometricEnabled
            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/80 border-emerald-300 shadow-xs'
            : 'bg-slate-50/80 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                isBiometricEnabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Fingerprint className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <label
                  htmlFor="toggle-use-biometric-auth"
                  className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer"
                >
                  Use Biometric Authentication
                </label>
                {isBiometricEnabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Active • Mock Token in localStorage</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    <span>Disabled • Standard Access</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Provides an extra layer of security for viewing sensitive scholarship data (Aadhaar UIDAI, DBT bank accounts, and grant sanction letters). Stores a mock secure authentication token (<code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-emerald-900">mota_biometric_secure_token</code>) and confirmation record in your browser’s <span className="font-bold">localStorage</span>.
              </p>
            </div>
          </div>

          {/* Action buttons & Accessible Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center flex-wrap">
            {!isBiometricEnabled ? (
              <button
                id="btn-open-guided-biometric-setup"
                type="button"
                onClick={onOpenGuidedSetup}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Start Guided Setup</span>
              </button>
            ) : (
              <button
                id="btn-rerun-guided-setup"
                type="button"
                onClick={onOpenGuidedSetup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
                title="Run guided hardware handshake calibration again"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Re-run Setup</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-600">
                {isBiometricEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
              <button
                id="toggle-use-biometric-auth"
                type="button"
                role="switch"
                aria-checked={isBiometricEnabled}
                onClick={onToggle}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isBiometricEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className="sr-only">Use Biometric Authentication</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isBiometricEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Guided Setup Teaser when Disabled */}
        {!isBiometricEnabled && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/70 p-3 rounded-lg border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Recommended: Click <strong>Start Guided Setup</strong> to test the simulated hardware handshake and register your biometric token.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenGuidedSetup}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
            >
              Launch Setup Flow →
            </button>
          </div>
        )}

        {/* When Enabled: Mock Token Storage Status & Controls */}
        {isBiometricEnabled && (
          <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-slate-600">Secure Storage Key:</span>
                <span className="font-mono font-bold text-emerald-950 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                  mota_biometric_secure_token
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500">
                  Assurance Level: <strong className="text-slate-800">AAL3 (NIST SP 800-63B)</strong>
                </span>
                <span>•</span>
                <span className="text-[11px] text-slate-500">
                  Algorithm: <strong className="text-slate-800">Ed25519-FIDO2-UIDAI</strong>
                </span>
              </div>
            </div>

            {/* Token String Preview and Actions */}
            <div className="p-3 bg-white rounded-xl border border-emerald-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                    Active Mock Token (localStorage)
                  </span>
                  <p className="font-mono text-xs text-slate-800 truncate font-semibold">
                    {storedToken?.token || 'MOTA_SECURE_BIO.v2.eyJpc3MiOiJodHRwczovL3NjaG9sYXJzaGlwcy5nb3YuaW4...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  id="btn-copy-biometric-token"
                  type="button"
                  onClick={handleCopyToken}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Copy full token to clipboard"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-inspect-biometric-token"
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Inspect token claims and payload"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Inspect Claims</span>
                </button>

                <button
                  id="btn-regenerate-token"
                  type="button"
                  onClick={onRegenerateToken}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Regenerate token with new cryptographic salt"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Refresh</span>
                </button>

                <button
                  id="btn-test-biometric-prompt"
                  type="button"
                  onClick={onTriggerBiometric}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer shadow-2xs"
                  title="Test Biometric Verification"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Test Biometrics</span>
                </button>
              </div>
            </div>

            {/* Verification Status info */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Protected Scope: <strong className="text-slate-700 font-mono">SCHOLARSHIP_SENSITIVE_DATA_READ</strong>
                </span>
              </span>
              <span>
                Session Status:{' '}
                <strong className={isUnlocked ? 'text-emerald-700' : 'text-amber-700'}>
                  {isUnlocked
                    ? `Unlocked via ${authenticatedWith || 'Biometrics'} (${authTimestamp || 'Active'})`
                    : 'Locked (Requires Biometric Unlock)'}
                </strong>
              </span>
            </div>

            {/* Hardware Handshake Confirmation Token Section */}
            {storedConfirmationToken && (
              <div className="mt-3 p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">Hardware Handshake Confirmed Token</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      PAIRING ACTIVE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Saved in localStorage: mota_biometric_confirmation_token
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-mono">CONFIRMATION TOKEN STRING:</span>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 truncate select-all">
                      {storedConfirmationToken.confirmationToken}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="btn-copy-confirmation-token"
                      type="button"
                      onClick={handleCopyConfirmationToken}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                    >
                      {hasCopiedConfToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Token</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>
                    <span className="block text-slate-500">Device Model</span>
                    <strong className="text-slate-200 truncate block">{storedConfirmationToken.hardwareDeviceModel}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500">Handshake Latency</span>
                    <strong className="text-emerald-400 font-mono">{storedConfirmationToken.handshakeLatencyMs} ms</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500">Session ID</span>
                    <strong className="text-slate-200 font-mono">{storedConfirmationToken.handshakeSessionId}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500">Liveness Score</span>
                    <strong className="text-emerald-400 font-mono">{storedConfirmationToken.livenessConfidenceScore}% (Passed)</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* When Disabled: Guidance note */}
        {!isBiometricEnabled && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Biometric security is currently off. Anyone using this browser tab can inspect sensitive scholarship records without biometric challenge. Switch the toggle ON to store a mock secure token and activate biometric privacy gating.
            </p>
          </div>
        )}
      </div>

      {/* Token Inspector Modal */}
      {isInspectorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Mock Secure Token Inspector</h4>
                  <p className="text-[11px] text-slate-400">Stored in localStorage: mota_biometric_secure_token</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Cryptographic Mock Token Verified</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  This mock token validates that the active browser session possesses a simulated biometric signature matching UIDAI Aadhaar RD 2.0 / WebAuthn Level 2 specifications.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Decoded Token Claims (JWT Payload):</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {JSON.stringify(decodedPayload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Raw Token String in localStorage:</span>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 font-mono text-[10px] break-all text-slate-800 select-all">
                  {storedToken?.token || 'No token stored'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Issued At</span>
                  <span className="font-bold text-slate-800">{storedToken?.issuedAt || new Date().toISOString()}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Token Status</span>
                  <span className="font-bold text-emerald-700">Active (Valid for 24 hours)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyToken}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                {hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopied ? 'Copied to Clipboard' : 'Copy Token'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
