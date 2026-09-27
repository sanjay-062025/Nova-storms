import React from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  ScanFace,
  Fingerprint,
  Landmark,
  FileCheck,
  Award,
  Hash,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { StudentProfile, PaymentMethod } from '../types';

interface SensitiveScholarshipDossierProps {
  profile: StudentProfile;
  paymentMethod: PaymentMethod;
  isBiometricEnabled: boolean;
  isBiometricUnlocked: boolean;
  onTriggerBiometric: () => void;
  onLockSession: () => void;
  authTimestamp?: string | null;
  authMethod?: string | null;
}

export const SensitiveScholarshipDossier: React.FC<SensitiveScholarshipDossierProps> = ({
  profile,
  paymentMethod,
  isBiometricEnabled,
  isBiometricUnlocked,
  onTriggerBiometric,
  onLockSession,
  authTimestamp,
  authMethod
}) => {
  // Determine if data should be masked
  const isMasked = isBiometricEnabled && !isBiometricUnlocked;

  return (
    <div
      id="section-sensitive-scholarship-dossier"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
    >
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs shrink-0 transition-colors ${
              !isMasked
                ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-800 border border-amber-400/40'
            }`}
          >
            {!isMasked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">
                Sensitive Scholarship & Entitlement Dossier
              </h3>
              {isBiometricEnabled ? (
                isBiometricUnlocked ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Biometrically Decrypted • Valid Session</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700" />
                    <span>Protected by Biometric Security</span>
                  </span>
                )
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  Standard Access (Biometrics Off)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Confidential government sanction credentials, PFMS credit orders, and UIDAI cryptographic tokens.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          {isBiometricEnabled ? (
            isBiometricUnlocked ? (
              <button
                type="button"
                onClick={onLockSession}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-300"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Lock Sensitive Data</span>
              </button>
            ) : (
              <button
                id="btn-unlock-sensitive-dossier"
                type="button"
                onClick={onTriggerBiometric}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <ScanFace className="w-3.5 h-3.5" />
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Unlock with Biometrics</span>
              </button>
            )
          ) : (
            <a
              href="#section-security-settings"
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Configure Security</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Sensitive Scholarship Data Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* 1. Scholarship Sanction ID */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              MoTA Central Sanction Order Number
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-mono font-bold text-xs sm:text-sm ${isMasked ? 'text-slate-400' : 'text-slate-900'}`}>
                {isMasked ? 'MoTA/2026/PMS-ST/••••••••' : 'MoTA/2026/PMS-ST/JH-89104'}
              </span>
              {!isMasked && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Verified
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              Direct mandate under National Tribal Fellowship Framework
            </span>
          </div>

          {/* 2. Approved Annual Sanction & Stipend */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              Approved Subsidy & Maintenance Stipend
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-xs sm:text-sm ${isMasked ? 'text-slate-400 font-mono' : 'text-emerald-800'}`}>
                {isMasked ? '₹••,••• / annum + ₹••,••• Book Allowance' : '₹48,000 / yr + ₹12,000 Maintenance'}
              </span>
              {!isMasked && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Approved
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              100% Central Sector ST Assistance
            </span>
          </div>

          {/* 3. PFMS Credit Sanction Order */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              PFMS Credit Batch & Beneficiary ID
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-mono font-bold text-xs sm:text-sm ${isMasked ? 'text-slate-400' : 'text-slate-900'}`}>
                {isMasked ? 'PFMS-DBT-2026-••••••••' : 'PFMS-DBT-2026-JH-99214'}
              </span>
              {!isMasked && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PFMS OK
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              Direct Benefit Transfer Treasury gateway verified
            </span>
          </div>

          {/* 4. Aadhaar NPCI Bank Mapping */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              NPCI Aadhaar-Seeded Bank Account
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-mono font-bold text-xs sm:text-sm ${isMasked ? 'text-slate-400' : 'text-slate-900'}`}>
                {isMasked ? `${paymentMethod.bankName} (••••••••8219)` : `${paymentMethod.bankName} • 38291048219`}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Seeded
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {isMasked ? 'IFSC: SBIN•••••••' : `IFSC: ${paymentMethod.ifsc || 'SBIN0001234'} • Jamshedpur Main Branch`}
            </span>
          </div>

          {/* 5. DigiLocker Proof Hash */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              DigiLocker Caste Certificate Signature
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-mono font-bold text-xs truncate max-w-[190px] ${isMasked ? 'text-slate-400' : 'text-slate-800'}`}>
                {isMasked ? 'SHA256: ••••••••••••••••' : 'SHA256: 7d8f4a1e9c2049b817'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Signed
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Cryptographically signed by Jharkhand e-District authority
            </span>
          </div>

          {/* 6. Income Tax PAN & Verification Key */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              Income Verification & PAN Linkage
            </span>
            <div className="flex items-center justify-between">
              <span className={`font-mono font-bold text-xs sm:text-sm ${isMasked ? 'text-slate-400' : 'text-slate-900'}`}>
                {isMasked ? 'PAN: ABCDE••••F' : 'PAN: ABCDE8941F'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Linked
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Cross-verified with Revenue Income Certificate #REV/2026/JH-89104
            </span>
          </div>
        </div>

        {/* Masked Lock Overlay Banner when Biometric is Enabled and Locked */}
        {isMasked && (
          <div className="mt-3.5 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-white">
                  Biometric Privacy Protection Active
                </h5>
                <p className="text-[11px] text-slate-300">
                  Full scholarship sanction numbers and bank credentials are encrypted. Authenticate to decrypt.
                </p>
              </div>
            </div>

            <button
              id="btn-dossier-overlay-unlock"
              type="button"
              onClick={onTriggerBiometric}
              className="shrink-0 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-extrabold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Authenticate & Decrypt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
