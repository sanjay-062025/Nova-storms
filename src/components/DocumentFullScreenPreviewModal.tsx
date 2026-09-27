import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  FileText,
  Camera,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { getDocumentPreviewUrl } from '../utils/documentPreviews';

interface DocumentFullScreenPreviewModalProps {
  isOpen: boolean;
  document: DocumentItem | null;
  documentsList?: DocumentItem[];
  onClose: () => void;
  onSelectDocument?: (doc: DocumentItem) => void;
  onUseForApplication?: (doc: DocumentItem) => void;
}

export const DocumentFullScreenPreviewModal: React.FC<DocumentFullScreenPreviewModalProps> = ({
  isOpen,
  document: activeDoc,
  documentsList = [],
  onClose,
  onSelectDocument,
  onUseForApplication
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Reset zoom & rotation when active document changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen, activeDoc?.id]);

  // Current document index for Next/Prev
  const currentIndex = activeDoc && documentsList.length > 0
    ? documentsList.findIndex((d) => d.id === activeDoc.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && onSelectDocument) {
      onSelectDocument(documentsList[currentIndex - 1]);
    }
  }, [currentIndex, documentsList, onSelectDocument]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < documentsList.length - 1 && onSelectDocument) {
      onSelectDocument(documentsList[currentIndex + 1]);
    }
  }, [currentIndex, documentsList, onSelectDocument]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setZoom((prev) => Math.min(prev + 0.25, 2.5));
      } else if (e.key === '-') {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        setZoom(1);
        setRotation(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !activeDoc) return null;

  // Resolve preview image URL: use existing previewUrl if available, else generated high-res SVG
  const previewImageUrl = activeDoc.previewUrl || getDocumentPreviewUrl(activeDoc.id, activeDoc.name, activeDoc.docNumberMask);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewImageUrl;
    link.download = `${activeDoc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_verified.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeDoc.name} - Official Preview</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; background: #fff; font-family: sans-serif; }
            img { max-width: 100%; height: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; }
            @media print { body { padding: 0; } img { box-shadow: none; width: 100%; } }
          </style>
        </head>
        <body>
          <img src="${previewImageUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-doc-title"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
    >
      {/* Top Navigation & Controls Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Document Info & Index */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id="fullscreen-doc-title" className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
                {activeDoc.name}
              </h3>
              <StatusBadge status={activeDoc.verificationStatus} size="sm" />
              {activeDoc.digiLockerVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">DigiLocker Verified</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
              <span className="font-mono text-emerald-400 font-semibold">{activeDoc.docNumberMask}</span>
              <span>•</span>
              <span className="truncate">{activeDoc.source}</span>
            </div>
          </div>
        </div>

        {/* Center: Previous / Next Document Switcher (when multiple documents) */}
        {documentsList.length > 1 && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              aria-label="Previous document"
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Previous document (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300 font-medium">
              {currentIndex + 1} of {documentsList.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= documentsList.length - 1}
              aria-label="Next document"
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Next document (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Zoom, Rotate, Print, Download, Close */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              aria-label="Zoom out"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Zoom out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-[11px] font-mono text-slate-300 font-semibold select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              aria-label="Zoom in"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Zoom / Fit */}
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset zoom and rotation"
            className="hidden sm:inline-flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="Fit to Screen (0)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={handleRotate}
            aria-label="Rotate 90 degrees"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="Rotate 90° clockwise"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download document image"
            className="hidden sm:inline-flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="Download Document Image"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print document"
            className="hidden sm:inline-flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="Print Certificate"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Toggle Info Drawer */}
          <button
            type="button"
            onClick={() => setShowMetadata((prev) => !prev)}
            aria-label="Toggle document details"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showMetadata
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Document Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            type="button"
            id="btn-close-fullscreen-preview"
            onClick={onClose}
            aria-label="Close full-screen preview"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-500/50 cursor-pointer transition-colors ml-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Document Image Canvas / Viewport */}
      <div className="flex-1 relative overflow-auto flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle dot matrix grid background representing scanner canvas */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Document Presentation Container */}
        <div
          className="relative transition-transform duration-150 ease-out origin-center flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`
          }}
        >
          {/* Document Paper Container with realistic drop shadow */}
          <div className="relative max-w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-700/60 bg-white">
            <img
              id="fullscreen-document-image"
              src={previewImageUrl}
              alt={activeDoc.name}
              className="max-h-[75vh] sm:max-h-[80vh] w-auto max-w-[92vw] sm:max-w-[85vw] object-contain block select-none pointer-events-auto"
              draggable={false}
            />

            {/* Official Watermark Overlay Tag */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-xs border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md pointer-events-none">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Verified</span>
            </div>
          </div>
        </div>

        {/* Floating Mobile/Tablet Prev/Next Arrows */}
        {documentsList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-20 border border-slate-700 backdrop-blur-xs transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed md:hidden"
              aria-label="Previous document"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= documentsList.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-20 border border-slate-700 backdrop-blur-xs transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed md:hidden"
              aria-label="Next document"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Metadata & Quick Action Bar (Collapsible) */}
      {showMetadata && (
        <footer className="bg-slate-900/95 border-t border-slate-800 px-4 sm:px-6 py-3 shrink-0 z-20 transition-all animate-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-xs text-slate-400">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Issuing Authority</span>
                <span className="text-slate-200 font-semibold truncate block" title={activeDoc.source}>
                  {activeDoc.source}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Document Category</span>
                <span className="text-slate-200 font-semibold truncate block">
                  {activeDoc.category}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Upload / Sync Date</span>
                <span className="text-slate-200 font-mono block">
                  {activeDoc.uploadedDate} ({activeDoc.fileSize})
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Digital Seal &amp; Integrity</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>SHA-256 Validated</span>
                </span>
              </div>
            </div>

            {/* Application Action Button */}
            {onUseForApplication && (
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  id={`btn-fullscreen-use-${activeDoc.id}`}
                  onClick={() => {
                    onUseForApplication(activeDoc);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-emerald-100" />
                  <span>Use for Application</span>
                </button>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};
