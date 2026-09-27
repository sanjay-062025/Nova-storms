import React, { useState } from 'react';
import { Landmark, ShieldCheck, CheckCircle2, Edit3, X, AlertCircle, Lock, Unlock } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  onUpdateMethod: (data: { bankName: string; ifsc: string }) => void;
  isBiometricUnlocked?: boolean;
  onTriggerBiometric?: () => void;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  onUpdateMethod,
  isBiometricUnlocked = false,
  onTriggerBiometric
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bankName, setBankName] = useState(paymentMethod.bankName);
  const [ifsc, setIfsc] = useState(paymentMethod.ifsc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMethod({ bankName, ifsc });
    setIsEditing(false);
  };

  return (
    <div id="section-payment-method" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Payment Method & Preferred DBT Account
              </h4>
              {isBiometricUnlocked ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-emerald-700" />
                  <span>Unmasked</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>Masked</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Direct Benefit Transfer destination authenticated with PFMS and NPCI
            </p>
          </div>
        </div>

        <button
          id="btn-update-payment-method"
          onClick={() => setIsEditing(true)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update Account</span>
        </button>
      </div>

      {/* Account Info Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Account Holder</span>
            <span className="font-bold text-slate-900">{paymentMethod.accountHolder}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Bank Name</span>
            <span className="font-bold text-slate-900">{paymentMethod.bankName}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Account Number</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${isBiometricUnlocked ? 'text-emerald-950 font-extrabold' : 'text-slate-900'}`}>
                {isBiometricUnlocked ? '38291048219' : paymentMethod.accountNumberMask}
              </span>
              {!isBiometricUnlocked && onTriggerBiometric && (
                <button
                  id="btn-unlock-bank-details"
                  type="button"
                  onClick={onTriggerBiometric}
                  className="text-[10px] font-bold text-emerald-800 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Lock className="w-2.5 h-2.5 text-amber-600" /> Unlock
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">IFSC Code</span>
            <span className="font-mono font-bold text-slate-900">{paymentMethod.ifsc}</span>
          </div>
        </div>

        {/* Verification Statuses */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account Status: ✓ Verified</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Aadhaar/DBT Status: ✓ Linked</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Bank Verification: ✓ Verified</span>
          </div>
        </div>

        {/* Prototype notice */}
        <div className="pt-2 text-[11px] text-slate-500 italic flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Demo payment information — not connected to a real bank account.</span>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="text-sm font-bold">Update Demo Payment Method</h4>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <strong>Notice:</strong> For the prototype, do not enter real financial credentials. Updates will simulate automated PFMS/NPCI bank verification.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-600 font-mono font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Save & Validate with PFMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
