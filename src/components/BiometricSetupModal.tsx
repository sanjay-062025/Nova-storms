import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  ScanFace,
  Key,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  X,
  HardDrive,
  Cpu,
  Radio,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  Shield,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  generateMockSecureToken,
  saveBiometricToken,
  generateBiometricConfirmationRecord,
  saveConfirmationToken,
  BiometricConfirmationRecord,
  MockBiometricToken
} from '../utils/biometricAuth';

interface BiometricSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (confirmationRecord: BiometricConfirmationRecord, secureToken: MockBiometricToken) => void;
  studentId: string;
  studentName: string;
}

type SetupStep = 'select_method' | 'hardware_handshake' | 'token_confirmed';
type BiometricMethod = 'fingerprint' | 'face' | 'fido2_key';

interface HandshakeLog {
  stage: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'done';
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
  studentId,
  studentName
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('select_method');
  const [selectedMethod, setSelectedMethod] = useState<BiometricMethod>('fingerprint');
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>(
    'Integrated Biometric Sensor (UIDAI RD 2.0 / TouchID)'
  );

  // Handshake animation state
  const [handshakeProgress, setHandshakeProgress] = useState(0);
  const [handshakePhase, setHandshakePhase] = useState<'connecting' | 'key_exchange' | 'liveness' | 'signing' | 'completed'>('connecting');
  const [logs, setLogs] = useState<HandshakeLog[]>([
    { stage: 'Hardware Discovery', detail: 'Probing UIDAI RD Service on port 11100...', status: 'pending' },
    { stage: 'Cryptographic Handshake', detail: 'ECDH Curve25519 key agreement & Nonce challenge...', status: 'pending' },
    { stage: 'Sensor Verification', detail: 'Optical liveness & biometric entropy vector scan...', status: 'pending' },
    { stage: 'Signed Assertion & Token', detail: 'Generating FIDO2 confirmation token and storing in localStorage...', status: 'pending' }
  ]);

  // Confirmation result
  const [confirmedRecord, setConfirmedRecord] = useState<BiometricConfirmationRecord | null>(null);
  const [confirmedSecureToken, setConfirmedSecureToken] = useState<MockBiometricToken | null>(null);
  const [hasCopiedToken, setHasCopiedToken] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('select_method');
      setHandshakeProgress(0);
      setHandshakePhase('connecting');
      setConfirmedRecord(null);
      setConfirmedSecureToken(null);
      setHasCopiedToken(false);
      setLogs([
        { stage: 'Hardware Discovery', detail: 'Probing UIDAI RD Service on port 11100...', status: 'pending' },
        { stage: 'Cryptographic Handshake', detail: 'ECDH Curve25519 key agreement & Nonce challenge...', status: 'pending' },
        { stage: 'Sensor Verification', detail: 'Optical liveness & biometric entropy vector scan...', status: 'pending' },
        { stage: 'Signed Assertion & Token', detail: 'Generating FIDO2 confirmation token and storing in localStorage...', status: 'pending' }
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startHandshake = () => {
    setCurrentStep('hardware_handshake');
    setHandshakeProgress(5);
    setHandshakePhase('connecting');

    // Step 1: Connecting (0 - 800ms)
    setLogs(prev => [
      { ...prev[0], status: 'in_progress' },
      { ...prev[1], status: 'pending' },
      { ...prev[2], status: 'pending' },
      { ...prev[3], status: 'pending' }
    ]);

    setTimeout(() => {
      setHandshakeProgress(28);
      setHandshakePhase('key_exchange');
      setLogs(prev => [
        { ...prev[0], status: 'done', detail: `Connected to ${selectedDeviceName} (PID v2.0 Ready)` },
        { ...prev[1], status: 'in_progress' },
        prev[2],
        prev[3]
      ]);

      // Step 2: Key exchange (800ms - 1900ms)
      setTimeout(() => {
        setHandshakeProgress(62);
        setHandshakePhase('liveness');
        setLogs(prev => [
          prev[0],
          { ...prev[1], status: 'done', detail: 'Shared secret generated. Nonce 0x7c91.. verified with FIDO2 secure enclave' },
          { ...prev[2], status: 'in_progress' },
          prev[3]
        ]);

        // Step 3: Liveness & Scan (1900ms - 3100ms)
        setTimeout(() => {
          setHandshakeProgress(88);
          setHandshakePhase('signing');
          setLogs(prev => [
            prev[0],
            prev[1],
            { ...prev[2], status: 'done', detail: 'Liveness test passed (Score 98.4%). Genuine ST scholar identity verified.' },
            { ...prev[3], status: 'in_progress' }
          ]);

          // Step 4: Token generation and save to localStorage (3100ms - 4100ms)
          setTimeout(() => {
            const confRecord = generateBiometricConfirmationRecord(
              studentId,
              selectedMethod,
              selectedDeviceName
            );
            const secToken = generateMockSecureToken(studentId, selectedMethod);

            // Save confirmation token AND secure token in localStorage
            saveConfirmationToken(confRecord);
            saveBiometricToken(secToken);

            setConfirmedRecord(confRecord);
            setConfirmedSecureToken(secToken);
            setHandshakeProgress(100);
            setHandshakePhase('completed');

            setLogs(prev => [
              prev[0],
              prev[1],
              prev[2],
              {
                ...prev[3],
                status: 'done',
                detail: `Confirmation token ${confRecord.confirmationToken.slice(0, 24)}... successfully saved in localStorage!`
              }
            ]);

            setTimeout(() => {
              setCurrentStep('token_confirmed');
            }, 600);
          }, 1000);
        }, 1200);
      }, 1100);
    }, 900);
  };

  const handleCopyConfirmationToken = () => {
    if (confirmedRecord?.confirmationToken) {
      navigator.clipboard?.writeText(confirmedRecord.confirmationToken);
      setHasCopiedToken(true);
      setTimeout(() => setHasCopiedToken(false), 2500);
    }
  };

  const handleFinishSetup = () => {
    if (confirmedRecord && confirmedSecureToken) {
      onCompleted(confirmedRecord, confirmedSecureToken);
    }
    onClose();
  };

  return (
    <div
      id="modal-biometric-guided-setup"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Biometric Authentication Guided Setup
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  FIDO2 & UIDAI RD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pair your device hardware, execute the cryptographic handshake, and store a confirmation token.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close setup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 shrink-0">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 'select_method'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {currentStep !== 'select_method' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : '1'}
              </div>
              <span
                className={`text-xs font-bold ${
                  currentStep === 'select_method' ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                Sensor Select
              </span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep !== 'select_method' ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 'hardware_handshake'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : currentStep === 'token_confirmed'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep === 'token_confirmed' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : '2'}
              </div>
              <span
                className={`text-xs font-bold ${
                  currentStep === 'hardware_handshake' ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                Hardware Handshake
              </span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep === 'token_confirmed' ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 'token_confirmed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
              <span
                className={`text-xs font-bold ${
                  currentStep === 'token_confirmed' ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                Token Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Content by Step */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: SELECT METHOD & HARDWARE AUDIT */}
          {currentStep === 'select_method' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <span className="font-bold block mb-0.5">High-Assurance Scholarship Privacy Gating</span>
                  Configuring biometric authentication establishes a cryptographic binding between your hardware sensor and your student profile (<strong className="font-mono">{studentId}</strong>). Once saved, sensitive scholarship sanction orders and bank disbursement accounts will be protected.
                </div>
              </div>

              {/* Sensor Selection Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Preferred Biometric Authenticator:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Fingerprint */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('fingerprint');
                      setSelectedDeviceName('Integrated Biometric Sensor (UIDAI RD 2.0 / TouchID)');
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'fingerprint'
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                          selectedMethod === 'fingerprint'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">Fingerprint Sensor</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Capacitive or optical scanner (Aadhaar RD / Touch ID)
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 mt-3 block">
                      Recommended for ST Portal
                    </span>
                  </button>

                  {/* Option 2: Face Recognition */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('face');
                      setSelectedDeviceName('Platform IR Camera (UIDAI FaceRD / Windows Hello)');
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'face'
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                          selectedMethod === 'face'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <ScanFace className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">Facial Recognition</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Camera with 3D liveness detection & IR contouring
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-3 block">
                      Fast contactless verify
                    </span>
                  </button>

                  {/* Option 3: FIDO2 Hardware Key */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('fido2_key');
                      setSelectedDeviceName('FIDO2 Hardware Security Key (USB/NFC)');
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'fido2_key'
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                          selectedMethod === 'fido2_key'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Key className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">Security Key / PIN</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Physical USB/NFC token or device enclave
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-3 block">
                      Enterprise Grade
                    </span>
                  </button>
                </div>
              </div>

              {/* Hardware Environment Diagnostics */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold flex items-center gap-2 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                    <span>Device Environment Audit</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">STU_ENV_OK</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">WebAuthn API</span>
                    <span className="font-bold text-emerald-400">Level 2 Supported</span>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Aadhaar RD Service</span>
                    <span className="font-bold text-emerald-400">Port 11100 READY</span>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Crypto Subsystem</span>
                    <span className="font-bold text-emerald-400">Ed25519 & SHA-256</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Target Device: <strong className="text-white">{selectedDeviceName}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SIMULATED BIOMETRIC HARDWARE HANDSHAKE ANIMATION */}
          {currentStep === 'hardware_handshake' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Handshake Visualizer Graphic */}
              <div className="p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 relative overflow-hidden shadow-inner">
                {/* Background Grid Accent */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Handshake Diagram Nodes */}
                <div className="relative z-10 flex items-center justify-between max-w-lg mx-auto py-3">
                  {/* Left Node: Browser Client */}
                  <div className="flex flex-col items-center text-center gap-1.5 w-24">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-md">
                      <Laptop className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">Browser Client</span>
                    <span className="text-[9px] text-slate-400 font-mono">WebAuthn Host</span>
                  </div>

                  {/* Center Node: Animated Cryptographic Channel */}
                  <div className="flex-1 mx-3 flex flex-col items-center relative">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold mb-1 tracking-wider uppercase">
                      {handshakePhase === 'connecting' && 'TLS 1.3 Channel'}
                      {handshakePhase === 'key_exchange' && 'ECDH Key Agreement'}
                      {handshakePhase === 'liveness' && 'Biometric Scan'}
                      {handshakePhase === 'signing' && 'Token Signing'}
                      {handshakePhase === 'completed' && 'Handshake Verified'}
                    </span>

                    {/* Animated Line with pulses */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                      <motion.div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 rounded-full"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: 'easeInOut'
                        }}
                        style={{ width: '45%' }}
                      />
                    </div>

                    <div className="mt-2 w-7 h-7 rounded-full bg-slate-800 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xs">
                      {handshakePhase === 'completed' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Right Node: Hardware Biometric Sensor */}
                  <div className="flex flex-col items-center text-center gap-1.5 w-24">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-md relative">
                      {selectedMethod === 'face' ? (
                        <ScanFace className="w-6 h-6" />
                      ) : selectedMethod === 'fido2_key' ? (
                        <Key className="w-6 h-6" />
                      ) : (
                        <Fingerprint className="w-6 h-6" />
                      )}

                      {/* Glowing Radar Rings */}
                      <span className="absolute -inset-1 rounded-2xl border border-emerald-400/40 animate-ping pointer-events-none" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">Hardware Sensor</span>
                    <span className="text-[9px] text-emerald-400 font-mono">UIDAI RD 2.0</span>
                  </div>
                </div>

                {/* Central Sweeping Biometric Sensor Simulation */}
                <div className="relative mt-4 pt-3 border-t border-slate-800/80 flex flex-col items-center justify-center">
                  <div className="relative w-28 h-28 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 flex items-center justify-center overflow-hidden shadow-2xl">
                    {/* Concentric Sensor Rings */}
                    <div className="absolute inset-2 rounded-xl border border-emerald-500/20" />
                    <div className="absolute inset-5 rounded-lg border border-emerald-500/20" />

                    {/* Central Icon */}
                    {selectedMethod === 'face' ? (
                      <ScanFace className="w-14 h-14 text-emerald-400/80" />
                    ) : selectedMethod === 'fido2_key' ? (
                      <Key className="w-12 h-12 text-emerald-400/80" />
                    ) : (
                      <Fingerprint className="w-14 h-14 text-emerald-400/80" />
                    )}

                    {/* Sweeping Laser Beam Animation */}
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399]"
                      animate={{
                        top: ['5%', '90%', '5%']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: 'easeInOut'
                      }}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 justify-center">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Simulating Hardware Handshake & Liveness Sweep...</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Target: {selectedDeviceName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar with Percentage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Handshake Completion:</span>
                  <span className="font-mono font-bold text-emerald-700">{handshakeProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${handshakeProgress}%` }}
                  />
                </div>
              </div>

              {/* Live Handshake Protocol Logs */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Hardware Protocol Verification Steps
                </span>

                <div className="space-y-2">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2.5 ${
                        log.status === 'done'
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : log.status === 'in_progress'
                          ? 'bg-white border-emerald-400 shadow-xs text-slate-900'
                          : 'bg-white/60 border-slate-200 text-slate-400 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {log.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : log.status === 'in_progress' ? (
                            <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold block text-xs">{log.stage}</span>
                          <span className="text-[11px] text-slate-600 font-mono leading-tight block mt-0.5">
                            {log.detail}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold shrink-0">
                        {log.status === 'done' && <span className="text-emerald-700">OK</span>}
                        {log.status === 'in_progress' && <span className="text-amber-600 animate-pulse">RUNNING</span>}
                        {log.status === 'pending' && <span className="text-slate-400">WAITING</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION TOKEN SAVED & VERIFIED */}
          {currentStep === 'token_confirmed' && confirmedRecord && (
            <div className="space-y-5 animate-in fade-in">
              {/* Success Badge */}
              <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-white rounded-2xl border-2 border-emerald-500/60 text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Biometric Handshake Successful!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  A cryptographic confirmation token has been issued by the biometric secure enclave and successfully stored in your browser’s <span className="font-bold text-slate-900">localStorage</span>.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-bold text-emerald-900 mt-1">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Stored: mota_biometric_confirmation_token</span>
                </div>
              </div>

              {/* Saved Confirmation Token Card */}
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold flex items-center gap-2 text-emerald-400">
                    <Key className="w-4 h-4" />
                    <span>Saved Confirmation Token</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">AAL3 CERTIFIED</span>
                </div>

                {/* Token string with 1-click copy */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    Confirmation Token String (in localStorage):
                  </span>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-emerald-400 select-all">
                    <span className="truncate">{confirmedRecord.confirmationToken}</span>
                    <button
                      type="button"
                      onClick={handleCopyConfirmationToken}
                      className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer shrink-0"
                      title="Copy confirmation token"
                    >
                      {hasCopiedToken ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Handshake Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Session ID</span>
                    <span className="font-mono font-bold text-slate-200">{confirmedRecord.handshakeSessionId}</span>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Handshake Latency</span>
                    <span className="font-mono font-bold text-emerald-400">{confirmedRecord.handshakeLatencyMs} ms</span>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Liveness Confidence</span>
                    <span className="font-mono font-bold text-emerald-400">{confirmedRecord.livenessConfidenceScore}%</span>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Hardware Device</span>
                    <span className="font-bold text-slate-200 truncate block">{confirmedRecord.hardwareDeviceModel.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              {/* What this unlocks info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Security Status Updated:</span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  'Use Biometric Authentication' is now activated. Your sensitive scholarship sanction IDs, PFMS credit batches, and bank accounts are biometrically unlocked for this active session.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {currentStep === 'select_method' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                id="btn-start-hardware-handshake"
                type="button"
                onClick={startHandshake}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Initiate Hardware Handshake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {currentStep === 'hardware_handshake' && (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Hardware communication in progress...
              </span>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs opacity-70 cursor-not-allowed"
              >
                Verifying Handshake...
              </button>
            </div>
          )}

          {currentStep === 'token_confirmed' && (
            <>
              <button
                type="button"
                onClick={handleCopyConfirmationToken}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer transition-colors"
              >
                {hasCopiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedToken ? 'Copied Token' : 'Copy Confirmation Token'}</span>
              </button>

              <button
                id="btn-complete-biometric-setup"
                type="button"
                onClick={handleFinishSetup}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Complete Setup & View Dossier</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
