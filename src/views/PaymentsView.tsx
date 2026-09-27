import React, { useState } from 'react';
import { Landmark, ShieldCheck, Download, CheckCircle2, FileText, Printer } from 'lucide-react';
import { PaymentRecord, PaymentSummary, StudentProfile } from '../types';
import { PaymentModule } from '../components/PaymentModule';
import { downloadDBTStatement } from '../utils/statementGenerator';
import { useLanguage } from '../i18n/LanguageContext';

interface PaymentsViewProps {
  paymentSummary: PaymentSummary;
  payments: PaymentRecord[];
  profile: StudentProfile;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  paymentSummary,
  payments,
  profile
}) => {
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadStatement = () => {
    setIsDownloading(true);
    try {
      downloadDBTStatement(paymentSummary, payments, profile);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating DBT statement:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Professional Government Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>{t('payments_heading')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Direct Benefit Transfer (DBT) & PFMS Settlement
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            {t('payments_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-download-dbt-statement"
            onClick={handleDownloadStatement}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Statement...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download DBT Statement</span>
              </>
            )}
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Official statutory DBT Statement (HTML & Print-Ready PDF) downloaded successfully for <strong>{profile.name}</strong>.
            </span>
          </div>
          <button
            onClick={() => downloadDBTStatement(paymentSummary, payments, profile)}
            className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline cursor-pointer text-[11px]"
          >
            <Printer className="w-3.5 h-3.5" /> Print Again
          </button>
        </div>
      )}

      {/* Main Payment Components */}
      <PaymentModule summary={paymentSummary} payments={payments} />
    </div>
  );
};
