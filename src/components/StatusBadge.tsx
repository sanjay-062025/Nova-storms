import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  IndianRupee,
  ShieldCheck,
  FileQuestion
} from 'lucide-react';
import { ApplicationStatus, PaymentStatus, GrievanceStatus, VerificationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus | PaymentStatus | GrievanceStatus | VerificationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showPulse = false }) => {
  const normalized = status.toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  }[size];

  // Disbursed / Resolved / Verified
  if (['disbursed', 'resolved', 'verified'].includes(normalized)) {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}>
        {normalized === 'disbursed' ? <IndianRupee className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        <span>{status}</span>
      </span>
    );
  }

  // Escalated / Failed
  if (['escalated', 'failed'].includes(normalized)) {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}>
        <span className="relative flex h-2 w-2 mr-0.5">
          {showPulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
        </span>
        <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
        <span>{status}</span>
      </span>
    );
  }

  // Under Review / Processing / Assigned
  if (['under review', 'processing', 'assigned'].includes(normalized)) {
    return (
      <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-800 border border-blue-300 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
        <span>{status}</span>
      </span>
    );
  }

  // Submitted / Created / Pending
  if (['submitted', 'created', 'pending'].includes(normalized)) {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>{status}</span>
      </span>
    );
  }

  // Manual Review
  if (['manual_review', 'manual review'].includes(normalized)) {
    return (
      <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-800 border border-orange-300 ${sizeClasses}`}>
        <FileQuestion className="w-3.5 h-3.5 text-orange-600" />
        <span>Manual Review</span>
      </span>
    );
  }

  // Default fallback
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-800 border border-slate-300 ${sizeClasses}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
      <span>{status}</span>
    </span>
  );
};
