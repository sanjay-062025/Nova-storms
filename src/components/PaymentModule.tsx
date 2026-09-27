import React, { useState } from 'react';
import {
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowUpRight,
  Landmark,
  X,
  FileCheck
} from 'lucide-react';
import { PaymentRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface PaymentModuleProps {
  summary: {
    totalBenefits: number;
    disbursedAmount: number;
    pendingAmount: number;
    formattedDisbursed: string;
    formattedPending: string;
    formattedTotal: string;
    dbtStatus: string;
  };
  payments: PaymentRecord[];
}

export const PaymentModule: React.FC<PaymentModuleProps> = ({ summary, payments }) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  return (
    <div className="space-y-5">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Benefits */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Benefits</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary.formattedTotal}
          </p>
          <span className="text-[11px] text-slate-500">Total Sanctioned & Queue</span>
        </div>

        {/* Disbursed Amount */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase">Disbursed Amount</span>
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-900 tracking-tight">
            {summary.formattedDisbursed}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Credited to Bank (Aadhaar APBS)</span>
        </div>

        {/* Pending Payments */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-800 uppercase">Pending Payments</span>
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-900 tracking-tight">
            {summary.formattedPending}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">In PFMS Processing Batch</span>
        </div>
      </div>

      {/* DBT Status Assurance Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white">Direct Benefit Transfer (DBT) Status: Verified Active</p>
            <p className="text-[11px] text-slate-300">
              Primary Account: State Bank of India (XXXX-4521) seeded with Aadhaar on NPCI APBS mapper
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[10px] font-mono bg-white/10 px-2 py-1 rounded">
          PFMS Integration Live
        </span>
      </div>

      {/* Payment History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scholarship Payment History</h3>
            <p className="text-xs text-slate-500">
              Track Direct Benefit Transfer credits and PFMS settlement batches
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {payments.length} Transactions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((pay) => (
            <div
              key={pay.id}
              onClick={() => setSelectedPayment(pay)}
              className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    pay.status === 'Disbursed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : pay.status === 'Processing'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Landmark className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {pay.schemeName}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>AY {pay.academicYear}</span>
                    <span>•</span>
                    <span>Date: {pay.date}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">Ref: {pay.transactionId}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {pay.dbtStatus}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                  {pay.formattedAmount}
                </span>
                <StatusBadge status={pay.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Payment Modal */}
      {selectedPayment && (
        <div
          id="modal-payment-detail"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Payment Lifecycle & DBT Mandate
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {selectedPayment.schemeName}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Grant Amount</span>
                  <span className="text-2xl font-extrabold text-emerald-800">
                    {selectedPayment.formattedAmount}
                  </span>
                </div>
                <StatusBadge status={selectedPayment.status} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Academic Year</span>
                  <span className="font-semibold">{selectedPayment.academicYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Disbursement Date</span>
                  <span className="font-semibold">{selectedPayment.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Transaction / UTR ID</span>
                  <span className="font-mono font-semibold">{selectedPayment.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Destination Bank</span>
                  <span className="font-semibold">{selectedPayment.bankName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Aadhaar Masked Account</span>
                  <span className="font-mono font-semibold">{selectedPayment.accountMask}</span>
                </div>
              </div>

              {/* 4-Step DBT Flow Indicator */}
              <div>
                <h5 className="font-bold text-slate-800 mb-2">DBT Payment Transfer Architecture</h5>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. MoTA Sanction Order & State Welfare Approval</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. PFMS Central Server File Validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. NPCI Aadhaar Payment Bridge System (APBS) routing</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 font-medium ${
                      selectedPayment.status === 'Disbursed'
                        ? 'text-emerald-800'
                        : 'text-amber-800'
                    }`}
                  >
                    {selectedPayment.status === 'Disbursed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>4. Final Credit to Beneficiary Account (SBI XXXX-4521)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
