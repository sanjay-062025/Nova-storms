import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  X,
  Layers,
  Network,
  ArrowDown
} from 'lucide-react';
import { VerificationModuleStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface UnifiedVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: VerificationModuleStatus[];
}

export const UnifiedVerificationModal: React.FC<UnifiedVerificationModalProps> = ({
  isOpen,
  onClose,
  modules
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-unified-verification"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-700/60 border border-emerald-500/40 text-emerald-200">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                MoTA Unified Verification Layer
              </h3>
              <p className="text-xs text-emerald-200">
                Statutory cross-database trust & e-governance authentication pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Architecture Visual Diagram */}
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed">
            <div className="text-emerald-400 font-bold mb-1">MoTA Verification Architecture:</div>
            <div className="text-slate-300">
              Student Mobile Web App → API Gateway → <strong className="text-white">Unified Verification Layer</strong>
            </div>
            <div className="text-slate-400 mt-1 pl-4 border-l-2 border-emerald-500">
              ├── State Tribal Database (ST Cert)<br/>
              ├── Revenue e-District (Income Check)<br/>
              ├── DigiLocker / NAD (Academic Marksheet)<br/>
              ├── AISHE Registry (Institute Accreditation)<br/>
              ├── UIDAI e-KYC (Identity Verification)<br/>
              ├── PFMS - NPCI Mapper (Aadhaar DBT Bridge)<br/>
              └── Document OCR & Anomaly Filter
            </div>
          </div>

          {/* Graceful Policy Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Resilient Verification Rule:</strong>
              If an external registry has a data mismatch or API timeout, the application is <strong>never blocked</strong>. It is gracefully routed to <span className="underline font-semibold">"Verification requires manual review"</span> by the District Nodal Officer.
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
              Live Gateway Verification Status ({modules.length} Connected Services)
            </h5>

            {modules.map((mod) => (
              <div
                key={mod.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900">{mod.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({mod.service})</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{mod.detail}</p>
                </div>

                <StatusBadge status={mod.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
