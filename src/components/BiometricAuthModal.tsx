import React, { useState, useEffect } from 'react';
import {
  ScanFace,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type BiometricMode = 'face' | 'fingerprint';
export type BiometricStatus = 'idle' | 'scanning' | 'verifying' | 'success' | 'failed';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (mode: BiometricMode) => void;
  studentName: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  studentName
}) => {
  const [mode, setMode] = useState<BiometricMode>('face');
  const [status, setStatus] = useState<BiometricStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const startSimulation = (shouldFail = false) => {
    setStatus('scanning');
    setErrorMessage('');

    // Stage 1: Scanning
    setTimeout(() => {
      setStatus('verifying');

      // Stage 2: Verifying
      setTimeout(() => {
        if (shouldFail) {
          setStatus('failed');
          setErrorMessage(
            mode === 'face'
              ? 'Facial alignment lost. Ensure adequate lighting and face the camera directly.'
              : 'Partial fingerprint reading. Please press firmly and hold your finger flat.'
          );
        } else {
          setStatus('success');
          setTimeout(() => {
            onAuthenticated(mode);
            onClose();
          }, 850);
        }
      }, 1000);
    }, 1100);
  };

  return (
    <div
      id="modal-biometric-auth"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Aadhaar Biometric Gateway
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Unlock Sensitive Student Records
              </h3>
            </div>
          </div>

          <button
            id="btn-close-biometric-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            id="tab-biometric-face"
            type="button"
            onClick={() => {
              setMode('face');
              setStatus('idle');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'face'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanFace className="w-4 h-4 text-indigo-600" />
            <span>FaceID Scan</span>
          </button>

          <button
            id="tab-biometric-fingerprint"
            type="button"
            onClick={() => {
              setMode('fingerprint');
              setStatus('idle');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'fingerprint'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-emerald-600" />
            <span>Fingerprint Sensor</span>
          </button>
        </div>

        {/* Biometric Interactive Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          {mode === 'face' ? (
            /* FaceID Visual Viewfinder */
            <div className="relative w-48 h-48 rounded-3xl bg-slate-900 border-2 border-dashed border-indigo-400/60 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Corner reticles */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-400 rounded-br-lg"></div>

              {/* Central Face Graphic */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400'
                      : status === 'failed'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-400'
                      : 'bg-indigo-500/10 text-indigo-300 border border-indigo-400/30'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in-50" />
                  ) : status === 'failed' ? (
                    <AlertTriangle className="w-12 h-12 text-rose-400 animate-in shake" />
                  ) : (
                    <ScanFace className="w-12 h-12" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-indigo-200 mt-2">
                  UIDAI-TEMPLATE #ST-{studentName.slice(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Animated Laser Scanning Line */}
              {status === 'scanning' && (
                <motion.div
                  initial={{ y: -96 }}
                  animate={{ y: 96 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.9,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_#818cf8]"
                />
              )}
            </div>
          ) : (
            /* Fingerprint Sensor Graphic */
            <div className="relative w-48 h-48 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Concentric Sensor Waves */}
              {status === 'scanning' && (
                <>
                  <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping"></div>
                  <div className="absolute inset-8 rounded-full border border-emerald-500/40 animate-pulse"></div>
                </>
              )}

              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                  status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400'
                    : status === 'failed'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-400'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-50" />
                ) : status === 'failed' ? (
                  <AlertTriangle className="w-14 h-14 text-rose-400 animate-in shake" />
                ) : (
                  <Fingerprint className="w-14 h-14" />
                )}
              </div>
            </div>
          )}

          {/* Status Text Messaging */}
          <div className="space-y-1 max-w-xs">
            {status === 'idle' && (
              <>
                <h4 className="text-sm font-bold text-slate-900">
                  {mode === 'face' ? 'Align Face with Camera' : 'Touch Fingerprint Sensor'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {mode === 'face'
                    ? 'Center your face within the frame to verify against UIDAI Aadhaar biometrics.'
                    : 'Place your registered biometric fingerprint onto the capacitive reader.'}
                </p>
              </>
            )}

            {status === 'scanning' && (
              <>
                <h4 className="text-sm font-bold text-indigo-700 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {mode === 'face' ? 'Scanning 3D Facial Mesh...' : 'Reading Minutiae Points...'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500">Hold steady for optical sensor capture.</p>
              </>
            )}

            {status === 'verifying' && (
              <>
                <h4 className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Matching UIDAI Biometric Registry...</span>
                </h4>
                <p className="text-xs text-slate-500">Authenticating ST scholar credential signature.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <h4 className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authentication Successful!</span>
                </h4>
                <p className="text-xs text-emerald-700 font-medium">
                  Sensitive banking and Aadhaar records unlocked for this session.
                </p>
              </>
            )}

            {status === 'failed' && (
              <>
                <h4 className="text-sm font-bold text-rose-700">Verification Incomplete</h4>
                <p className="text-xs text-rose-600">{errorMessage}</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            id="btn-simulate-fail"
            type="button"
            disabled={status === 'scanning' || status === 'verifying'}
            onClick={() => startSimulation(true)}
            className="w-full sm:w-auto text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Simulate Scan Mismatch
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="btn-cancel-biometric"
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-start-biometric-scan"
              type="button"
              disabled={status === 'scanning' || status === 'verifying' || status === 'success'}
              onClick={() => startSimulation(false)}
              className="w-full sm:w-auto text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white shadow-2xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {mode === 'face' ? (
                <ScanFace className="w-4 h-4" />
              ) : (
                <Fingerprint className="w-4 h-4" />
              )}
              <span>
                {status === 'scanning' || status === 'verifying'
                  ? 'Verifying...'
                  : status === 'failed'
                  ? 'Retry Biometric Scan'
                  : `Authenticate with ${mode === 'face' ? 'FaceID' : 'Fingerprint'}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
