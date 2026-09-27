import React, { useState } from 'react';
import {
  FolderLock,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
  FileCheck,
  Sparkles,
  AlertCircle,
  Plus,
  RefreshCw,
  Link2,
  UserCheck,
  Camera,
  Maximize2
} from 'lucide-react';
import { DocumentItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { ManualDocumentModal } from './ManualDocumentModal';
import { DocumentFullScreenPreviewModal } from './DocumentFullScreenPreviewModal';
import { getDocumentPreviewUrl } from '../utils/documentPreviews';

interface DocumentWalletSectionProps {
  documents: DocumentItem[];
  digiLockerConnected: boolean;
  onUseForApplication: (doc: DocumentItem) => void;
}

export const DocumentWalletSection: React.FC<DocumentWalletSectionProps> = ({
  documents: initialDocuments,
  digiLockerConnected: initialConnected = true,
  onUseForApplication
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [isDigiLockerConnected, setIsDigiLockerConnected] = useState<boolean>(initialConnected);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUseDoc = (doc: DocumentItem) => {
    onUseForApplication(doc);
    setToastMessage(`✓ ${doc.name} attached to active application drafts.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDigiLocker = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsDigiLockerConnected((prev) => !prev);
      setIsSyncing(false);
      setToastMessage(
        !isDigiLockerConnected
          ? 'DigiLocker account linked & verified credentials synced.'
          : 'DigiLocker disconnected. You may still manually upload and verify documents.'
      );
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  const handleAddManualDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setToastMessage(`✓ ${newDoc.name} manually submitted and verified by assigned nodal officer.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div id="section-document-wallet" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
              Digital Document Wallet & Statutory Verification
            </h4>
            <p className="text-xs text-slate-500">
              Unified verification layer supporting automated DigiLocker fetch and nodal officer manual attestation
            </p>
          </div>
        </div>

        {/* Action Controls: DigiLocker Link + Manual Fill */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-toggle-digilocker"
            onClick={handleToggleDigiLocker}
            disabled={isSyncing}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDigiLockerConnected
                ? 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-700" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>{isDigiLockerConnected ? 'DigiLocker Connected' : 'Connect DigiLocker'}</span>
          </button>

          <button
            id="btn-manual-doc-upload"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manual Fill & Verify</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc) => {
          const docPreview = doc.previewUrl || getDocumentPreviewUrl(doc.id, doc.name, doc.docNumberMask);
          return (
            <div
              key={doc.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Clickable Certificate Thumbnail */}
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      aria-label={`Open full-screen preview for ${doc.name}`}
                      className="w-7 h-9 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-300 shadow-2xs hover:scale-105 hover:border-emerald-500 transition-transform cursor-pointer relative group/thumb"
                      title="Click to preview image in full screen"
                    >
                      <img
                        src={docPreview}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Eye className="w-3 h-3" />
                      </div>
                    </button>

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(doc)}
                        className="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-800 transition-colors truncate block max-w-full cursor-pointer"
                        title={doc.name}
                      >
                        {doc.name}
                      </button>
                    </div>
                  </div>

                  {/* Actions next to uploaded document title: Eye Icon Button & Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      id={`btn-eye-preview-${doc.id}`}
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      aria-label={`Open full-screen preview for ${doc.name}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border border-emerald-200 hover:border-emerald-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-105"
                      title="Preview full-screen document image"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {doc.isCameraScanned && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <Camera className="w-2.5 h-2.5" />
                        <span>Scanned</span>
                      </span>
                    )}
                    <StatusBadge status={doc.verificationStatus} size="sm" />
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pl-9">
                  <p>
                    <strong className="text-slate-700">Source:</strong> {doc.source}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ref: <span className="font-mono">{doc.docNumberMask}</span> • Uploaded: {doc.uploadedDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs">
                <button
                  id={`btn-view-doc-${doc.id}`}
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  title="Open full-screen certificate preview"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full-Screen Preview</span>
                </button>

                <button
                  id={`btn-use-doc-${doc.id}`}
                  type="button"
                  onClick={() => handleUseDoc(doc)}
                  className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Use for Application</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Document Fill Modal */}
      <ManualDocumentModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddDocument={handleAddManualDocument}
      />

      {/* Full-Screen Document Preview Modal */}
      <DocumentFullScreenPreviewModal
        isOpen={!!selectedDoc}
        document={selectedDoc}
        documentsList={documents}
        onClose={() => setSelectedDoc(null)}
        onSelectDocument={(doc) => setSelectedDoc(doc)}
        onUseForApplication={handleUseDoc}
      />
    </div>
  );
};
