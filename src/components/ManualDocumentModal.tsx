import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Building,
  UserCheck,
  AlertCircle,
  FileCheck,
  Eye
} from 'lucide-react';
import { DocumentItem } from '../types';
import { getDocumentPreviewUrl } from '../utils/documentPreviews';

interface ManualDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
}

export const ManualDocumentModal: React.FC<ManualDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddDocument
}) => {
  const [docType, setDocType] = useState('ST Caste Certificate');
  const [docNumber, setDocNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('Office of Tehsildar / SDO');
  const [issueDate, setIssueDate] = useState('2025-06-15');
  const [verifier, setVerifier] = useState('District Tribal Welfare Officer');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setUploadedPreviewUrl(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const mask = docNumber
        ? docNumber.slice(0, 4) + '...' + docNumber.slice(-4)
        : 'JH/ST/2026/8831';

      const docId = `doc-manual-${Date.now()}`;
      const finalPreviewUrl = uploadedPreviewUrl || getDocumentPreviewUrl(docId, docType, mask);

      const newDoc: DocumentItem = {
        id: docId,
        name: docType,
        category: 'Statutory Verification',
        source: issuingAuthority,
        docNumberMask: mask,
        verificationStatus: 'verified',
        uploadedDate: 'Today',
        fileSize: fileSize || '1.8 MB (PDF)',
        digiLockerVerified: false,
        previewUrl: finalPreviewUrl
      };

      onAddDocument(newDoc);
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setUploadedPreviewUrl(null);
        setFileName('');
        onClose();
      }, 1800);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Manual Document Fill & Professional Verification
              </h3>
              <p className="text-[11px] text-slate-300">
                Submit certificate details for statutory nodal officer authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Document Authenticated & Added!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {docType} has been recorded with ref {docNumber || 'JH/ST/2026/8831'} and signed by {verifier}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700"
              >
                <option>ST Caste Certificate</option>
                <option>Annual Family Income Certificate</option>
                <option>State Domicile Certificate</option>
                <option>Institutional Bonafide / Admission Letter</option>
                <option>Previous Semester Marksheet</option>
                <option>Bank Passbook / Mandate Form</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Certificate / Registration No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JH/ST/2025/11982"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Date of Issuance</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Issuing Authority / Revenue Office</label>
              <input
                type="text"
                required
                placeholder="e.g. Office of Tehsildar, Sadar Ranchi"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Assign Verification Professional</label>
              <select
                value={verifier}
                onChange={(e) => setVerifier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700"
              >
                <option>District Tribal Welfare Officer (DWO Ranchi)</option>
                <option>Institute Nodal Officer (NIT Jamshedpur)</option>
                <option>Sub-Divisional Officer (SDO Revenue)</option>
                <option>State Tribal Welfare Directorate Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Attach Scanned File (PDF/PNG/JPG)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-600 transition-colors bg-slate-50">
                <input
                  type="file"
                  id="manual-doc-upload"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="manual-doc-upload" className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="font-bold text-slate-800">
                    {fileName ? fileName : 'Click or Drag & Drop File'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {fileSize ? `File size: ${fileSize}` : 'Supported: PDF, JPG, PNG up to 5MB'}
                  </p>
                </label>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Statutory Declaration:</strong> This file will be counter-verified by the selected professional authority under Section 4 of the Tribal Welfare Digital Scheme Guidelines.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying & Linking...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Submit for Professional Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
