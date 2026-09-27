import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Crop,
  RotateCw,
  Check,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Move,
  Maximize2,
  Upload,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Zap,
  ZapOff,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { DocumentItem } from '../types';
import { getDocumentPreviewUrl } from '../utils/documentPreviews';

export interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentScanned: (document: DocumentItem) => void;
  defaultDocType?: string;
  schemeMandatoryDocs?: string[];
}

type ScannerMode = 'camera' | 'crop' | 'review';
type FilterMode = 'original' | 'crisp' | 'bw';
type AspectPreset = 'free' | 'a4' | 'card';

interface CropBox {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onDocumentScanned,
  defaultDocType,
  schemeMandatoryDocs = []
}) => {
  const [mode, setMode] = useState<ScannerMode>('camera');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);

  // Raw captured image
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<FilterMode>('crisp');
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>('a4');

  // Cropping rect in percentages [0..100]
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 8,
    y: 8,
    width: 84,
    height: 84
  });

  // Final cropped output
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);

  // Metadata form
  const [selectedDocName, setSelectedDocName] = useState<string>(
    defaultDocType || (schemeMandatoryDocs[0] ?? 'ST Caste Certificate')
  );
  const [customDocName, setCustomDocName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('Competent Revenue Authority (Self-Attested)');

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);

  // Active drag state
  const dragRef = useRef<{
    isDragging: boolean;
    handle: string | null; // 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'right' | 'bottom' | 'left' | 'move'
    startX: number;
    startY: number;
    initialCrop: CropBox;
  }>({
    isDragging: false,
    handle: null,
    startX: 0,
    startY: 0,
    initialCrop: { x: 8, y: 8, width: 84, height: 84 }
  });

  // Set default document name if changed externally
  useEffect(() => {
    if (defaultDocType) {
      setSelectedDocName(defaultDocType);
    } else if (schemeMandatoryDocs.length > 0 && !selectedDocName) {
      setSelectedDocName(schemeMandatoryDocs[0]);
    }
  }, [defaultDocType, schemeMandatoryDocs]);

  // Clean stop stream helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Initialize camera
  const startCamera = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);
    setHasCameraPermission(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported by your browser or environment.');
      setHasCameraPermission(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (err: unknown) {
        const errName = (err as Error)?.name || '';
        const errMsg = (err as Error)?.message || '';
        const isPermissionIssue =
          errName === 'NotAllowedError' ||
          errName === 'PermissionDeniedError' ||
          errName === 'AbortError' ||
          errName === 'SecurityError' ||
          errMsg.toLowerCase().includes('dismiss') ||
          errMsg.toLowerCase().includes('denied') ||
          errMsg.toLowerCase().includes('not allowed');

        // Do not attempt secondary getUserMedia if user or browser dismissed/denied permission
        if (isPermissionIssue) {
          throw err;
        }

        console.info('Retrying with basic video constraints', err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((e) => {
          console.warn('Video autoplay notice:', e);
        });
      }

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as { torch?: boolean };
        setTorchAvailable(Boolean(capabilities.torch));
      }
    } catch (err: unknown) {
      // User dismissing or denying camera permission is normal user/browser interaction,
      // not an unhandled application runtime crash. Use console.info instead of console.error.
      console.info('Camera permission dismissed or unavailable:', (err as Error)?.message || err);
      const errName = (err as Error)?.name || '';
      const errMsg = (err as Error)?.message || '';
      const isDenied =
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError' ||
        errName === 'SecurityError' ||
        errName === 'AbortError' ||
        errMsg.toLowerCase().includes('dismiss') ||
        errMsg.toLowerCase().includes('denied') ||
        errMsg.toLowerCase().includes('not allowed');

      setCameraError(
        isDenied
          ? 'Camera permission was dismissed or denied. You can select an existing document photo, capture using system camera, or load a sample document.'
          : 'Unable to access camera on this device. You can upload or select an existing document photo.'
      );
      setHasCameraPermission(false);
    }
  }, [facingMode, stopCameraStream]);

  // Handle modal lifecycle
  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, mode, startCamera, stopCameraStream]);

  // Toggle flashlight / torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !torchOn;
      // @ts-expect-error torch is valid in mobile browser constraint extension
      await videoTrack.applyConstraints({ advanced: [{ torch: nextTorch }] });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Failed to toggle torch', e);
    }
  };

  // Flip camera (environment <-> user)
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture current frame from video stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    stopCameraStream();
    setRawImageSrc(dataUrl);
    setRotationDegrees(0);

    // Set initial crop based on preset
    applyAspectPresetToCrop('a4', width, height);

    setMode('crop');
  };

  // File fallback upload
  const handleFileFallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        stopCameraStream();
        setRawImageSrc(event.target.result as string);
        setRotationDegrees(0);
        applyAspectPresetToCrop('a4', 1200, 800);
        setMode('crop');
      }
    };
    reader.readAsDataURL(file);
  };

  // Instant sample document fallback (allows testing scanner even without camera)
  const handleUseSampleDoc = () => {
    stopCameraStream();
    const sampleUrl = getDocumentPreviewUrl(`scan-${Date.now()}`, selectedDocName, 'MOTA/SCAN/2026/XXXX-8821');
    setRawImageSrc(sampleUrl);
    setRotationDegrees(0);
    applyAspectPresetToCrop('a4', 1200, 800);
    setMode('crop');
  };

  // Preset calculation
  const applyAspectPresetToCrop = (preset: AspectPreset, imgW = 1200, imgH = 800) => {
    setAspectPreset(preset);
    if (preset === 'free') {
      setCropBox({ x: 8, y: 8, width: 84, height: 84 });
      return;
    }

    // A4 is 1 : 1.414 (portrait) or 1.414 : 1 (landscape)
    let targetRatio = 1 / 1.414;
    if (imgW > imgH) {
      // Landscape A4 doc
      targetRatio = 1.414 / 1;
    }

    if (preset === 'card') {
      // ID Card ratio ~ 1.58 : 1
      targetRatio = 1.58;
    }

    // Fit rectangle with targetRatio inside 80% of container
    let w = 82;
    let h = (w * (imgW / imgH)) / targetRatio;
    if (h > 82) {
      h = 82;
      w = (h * targetRatio) / (imgW / imgH);
    }

    const x = Math.max(2, (100 - w) / 2);
    const y = Math.max(2, (100 - h) / 2);

    setCropBox({
      x,
      y,
      width: Math.min(96, Math.max(15, w)),
      height: Math.min(96, Math.max(15, h))
    });
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotationDegrees((prev) => (prev + 90) % 360);
  };

  // Interactive Pointer Events for Cropping Overlay
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    dragRef.current = {
      isDragging: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialCrop: { ...cropBox }
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging || !cropContainerRef.current) return;
    e.preventDefault();

    const rect = cropContainerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    const { handle, initialCrop } = dragRef.current;
    let { x, y, width, height } = initialCrop;

    const MIN_SIZE = 12; // min 12% width/height

    if (handle === 'move') {
      x = Math.max(0, Math.min(100 - width, initialCrop.x + deltaX));
      y = Math.max(0, Math.min(100 - height, initialCrop.y + deltaY));
    } else {
      // Corner / edge handles
      if (handle?.includes('l')) {
        const newX = Math.max(0, Math.min(initialCrop.x + initialCrop.width - MIN_SIZE, initialCrop.x + deltaX));
        width = initialCrop.width + (initialCrop.x - newX);
        x = newX;
      }
      if (handle?.includes('r')) {
        width = Math.max(MIN_SIZE, Math.min(100 - initialCrop.x, initialCrop.width + deltaX));
      }
      if (handle?.includes('t')) {
        const newY = Math.max(0, Math.min(initialCrop.y + initialCrop.height - MIN_SIZE, initialCrop.y + deltaY));
        height = initialCrop.height + (initialCrop.y - newY);
        y = newY;
      }
      if (handle?.includes('b')) {
        height = Math.max(MIN_SIZE, Math.min(100 - initialCrop.y, initialCrop.height + deltaY));
      }
    }

    setCropBox({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      width: Math.round(width * 10) / 10,
      height: Math.round(height * 10) / 10
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.isDragging) {
      dragRef.current.isDragging = false;
      dragRef.current.handle = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Perform Final Crop on Canvas
  const handleApplyCrop = () => {
    if (!rawImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Create temporary canvas to apply rotation if needed
      const rotCanvas = document.createElement('canvas');
      const rotCtx = rotCanvas.getContext('2d');
      if (!rotCtx) return;

      const isSideways = rotationDegrees === 90 || rotationDegrees === 270;
      rotCanvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
      rotCanvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

      rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
      rotCtx.rotate((rotationDegrees * Math.PI) / 180);
      rotCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      // 2. Crop area from rotated canvas
      const cropPixelX = (cropBox.x / 100) * rotCanvas.width;
      const cropPixelY = (cropBox.y / 100) * rotCanvas.height;
      const cropPixelW = (cropBox.width / 100) * rotCanvas.width;
      const cropPixelH = (cropBox.height / 100) * rotCanvas.height;

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = Math.max(100, Math.round(cropPixelW));
      finalCanvas.height = Math.max(100, Math.round(cropPixelH));
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) return;

      // Draw cropped slice
      finalCtx.drawImage(
        rotCanvas,
        cropPixelX,
        cropPixelY,
        cropPixelW,
        cropPixelH,
        0,
        0,
        finalCanvas.width,
        finalCanvas.height
      );

      // Apply filter effect if requested
      if (filterMode === 'crisp') {
        // Increase contrast and sharpness
        const imgData = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
        const d = imgData.data;
        const contrast = 25; // -255 to 255
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (let i = 0; i < d.length; i += 4) {
          d[i] = factor * (d[i] - 128) + 128 + 10; // R
          d[i + 1] = factor * (d[i + 1] - 128) + 128 + 10; // G
          d[i + 2] = factor * (d[i + 2] - 128) + 128 + 10; // B
        }
        finalCtx.putImageData(imgData, 0, 0);
      } else if (filterMode === 'bw') {
        // High-contrast clean black and white
        const imgData = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // S-curve threshold
          const thresholded = gray > 140 ? Math.min(255, gray * 1.15) : Math.max(0, gray * 0.85);
          d[i] = thresholded;
          d[i + 1] = thresholded;
          d[i + 2] = thresholded;
        }
        finalCtx.putImageData(imgData, 0, 0);
      }

      const croppedUrl = finalCanvas.toDataURL('image/jpeg', 0.88);
      setCroppedImageSrc(croppedUrl);

      // Estimate file size in bytes
      const approxBytes = Math.round((croppedUrl.length * 3) / 4);
      setFileSizeBytes(approxBytes);

      setMode('review');
    };
    img.src = rawImageSrc;
  };

  // Submit and attach document to application
  const handleAttachDocument = () => {
    if (!croppedImageSrc) return;

    const finalName =
      selectedDocName === 'Other / Custom Document'
        ? customDocName.trim() || 'Scanned Tribal Certificate'
        : selectedDocName;

    const sizeFormatted =
      fileSizeBytes > 1024 * 1024
        ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(fileSizeBytes / 1024)} KB`;

    const mask = documentNumber.trim()
      ? documentNumber.length > 8
        ? documentNumber.slice(0, 4) + '••••' + documentNumber.slice(-4)
        : documentNumber
      : `SCAN-ST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDoc: DocumentItem = {
      id: `doc-scan-${Date.now()}`,
      name: finalName,
      category: 'Camera Scanned Document',
      source: issuingAuthority || 'Direct Camera Scan (Self-Attested)',
      docNumberMask: mask,
      verificationStatus: 'verified',
      uploadedDate: 'Today (Camera Scan)',
      fileSize: `${sizeFormatted} (JPEG)`,
      digiLockerVerified: false,
      previewUrl: croppedImageSrc,
      isCameraScanned: true,
      scannedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    onDocumentScanned(newDoc);
    onClose();
  };

  if (!isOpen) return null;

  // Options for documents
  const docTypeOptions = [
    ...(schemeMandatoryDocs.length > 0
      ? schemeMandatoryDocs
      : [
          'ST Caste Certificate from competent revenue authority',
          'Annual Family Income Certificate',
          'Previous Academic Marksheet',
          'Aadhaar seeded bank account passbook'
        ]),
    'Bonafide Student Certificate from College/Institute',
    'College Fee Receipt & Admission Letter',
    'Hostel Accommodation Certificate',
    'Other / Custom Document'
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-slate-900 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Document Camera Scanner
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MoTA Optical Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {mode === 'camera' && 'Align document inside the viewfinder and tap shutter to scan'}
                {mode === 'crop' && 'Drag corner handles to crop document boundaries'}
                {mode === 'review' && 'Verify scan clarity and attach to your scholarship dossier'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden fallback file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileFallback}
          className="hidden"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col">
          {/* ================= MODE 1: LIVE CAMERA VIEW ================= */}
          {mode === 'camera' && (
            <div className="flex-1 flex flex-col items-center justify-between min-h-[360px] relative">
              {/* Document Type Selector Bar */}
              <div className="w-full mb-3 flex items-center justify-between gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 text-[11px] font-medium shrink-0 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Doc:</span>
                </span>
                <select
                  value={selectedDocName}
                  onChange={(e) => setSelectedDocName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full max-w-sm truncate"
                >
                  {docTypeOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Viewfinder Container */}
              <div className="w-full relative flex-1 min-h-[280px] sm:min-h-[360px] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                {hasCameraPermission === false ? (
                  /* Camera Permission Denied / Dismissed / Unavailable Fallback View */
                  <div className="p-6 text-center max-w-md space-y-3 animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                      <CameraOff className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm">Camera Permission Dismissed or Unavailable</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cameraError || 'Camera permission was dismissed. You can easily upload an existing document photo, take a photo via your device file dialog, or test using an official verified sample document.'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 justify-center">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Take Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleUseSampleDoc}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/40 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Use Sample Document</span>
                      </button>
                    </div>
                  </div>
                ) : hasCameraPermission === null ? (
                  /* Loading / Requesting Camera State */
                  <div className="p-6 text-center max-w-sm space-y-3 animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-spin border border-emerald-500/30">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Connecting to camera stream...</p>
                    <p className="text-[11px] text-slate-400">Please grant permission if prompted by your browser.</p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
                      >
                        Upload document photo &rarr;
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={handleUseSampleDoc}
                        className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
                      >
                        Use sample doc &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Live Video Stream with Viewfinder Overlay */
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Document Framing Reticle / Viewfinder Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                      <div className="w-full max-w-sm aspect-3/4 sm:aspect-1/1.414 border-2 border-emerald-400/70 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                        {/* 4 Framing Corner Highlights */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                        {/* Alignment instruction */}
                        <div className="absolute inset-x-0 bottom-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                            Keep physical document within the green frame
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Camera Control Overlays */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {torchAvailable && (
                        <button
                          type="button"
                          onClick={toggleTorch}
                          className={`p-2 rounded-full backdrop-blur-xs border transition-colors cursor-pointer ${
                            torchOn
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                          title="Toggle Torch / Flashlight"
                        >
                          {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={flipCamera}
                        className="p-2 rounded-full bg-slate-900/70 text-slate-300 border border-slate-700 hover:text-white backdrop-blur-xs transition-colors cursor-pointer"
                        title="Flip Front / Back Camera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Shutter and Alternative Action Bar */}
              <div className="w-full mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                    title="Upload from Device Gallery"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="hidden sm:inline">Upload Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseSampleDoc}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border border-emerald-500/40 transition-colors"
                    title="Load sample document photo"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Sample Doc</span>
                  </button>
                </div>

                {/* Main Shutter Button */}
                <button
                  id="btn-camera-shutter"
                  type="button"
                  disabled={!hasCameraPermission}
                  onClick={handleCapture}
                  className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 hover:border-emerald-400 transition-all p-1 cursor-pointer disabled:opacity-40"
                  title="Capture Document Photo"
                >
                  <div className="w-full h-full rounded-full bg-white group-hover:bg-emerald-400 transition-colors flex items-center justify-center shadow-lg">
                    <Camera className="w-6 h-6 text-slate-950 group-hover:scale-110 transition-transform" />
                  </div>
                </button>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">1080p Optical</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Auto-Focus</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 2: CROP & ADJUST VIEW ================= */}
          {mode === 'crop' && rawImageSrc && (
            <div className="flex-1 flex flex-col space-y-3">
              {/* Crop Toolbar: Aspect Presets, Rotation & Scan Filter */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                {/* Presets */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                    <Crop className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ratio:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => applyAspectPresetToCrop('a4')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      aspectPreset === 'a4'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    A4 Doc
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAspectPresetToCrop('card')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      aspectPreset === 'card'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ID Card
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAspectPresetToCrop('free')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      aspectPreset === 'free'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Freeform
                  </button>
                </div>

                {/* Rotation & Filter */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    title="Rotate 90 degrees clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rotate</span>
                  </button>

                  <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-700">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <select
                      value={filterMode}
                      onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                      className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer py-0.5"
                    >
                      <option value="crisp" className="bg-slate-900">Enhanced (Crisp Text)</option>
                      <option value="bw" className="bg-slate-900">B&W High Contrast</option>
                      <option value="original" className="bg-slate-900">Original Color</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interactive Cropping Canvas Stage */}
              <div
                ref={cropContainerRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full h-[320px] sm:h-[400px] bg-black rounded-xl overflow-hidden flex items-center justify-center select-none touch-none border border-slate-800"
              >
                {/* Captured Image display */}
                <img
                  src={rawImageSrc}
                  alt="Raw capture"
                  style={{
                    transform: `rotate(${rotationDegrees}deg)`,
                    maxWidth: rotationDegrees % 180 !== 0 ? '70%' : '100%',
                    maxHeight: rotationDegrees % 180 !== 0 ? '70%' : '100%'
                  }}
                  className="object-contain pointer-events-none transition-transform duration-200"
                />

                {/* Dark Mask outside crop area */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, rgba(0,0,0,0.65) ${cropBox.x}%, transparent ${cropBox.x}%, transparent ${
                      cropBox.x + cropBox.width
                    }%, rgba(0,0,0,0.65) ${cropBox.x + cropBox.width}%)`
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: 0,
                    bottom: `${100 - cropBox.y}%`,
                    left: `${cropBox.x}%`,
                    width: `${cropBox.width}%`,
                    backgroundColor: 'rgba(0,0,0,0.65)'
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: `${cropBox.y + cropBox.height}%`,
                    bottom: 0,
                    left: `${cropBox.x}%`,
                    width: `${cropBox.width}%`,
                    backgroundColor: 'rgba(0,0,0,0.65)'
                  }}
                />

                {/* Interactive Crop Box Window */}
                <div
                  id="crop-bounding-box"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`
                  }}
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  className="absolute border-2 border-emerald-400 bg-transparent cursor-move shadow-md"
                >
                  {/* Grid Lines (Rule of Thirds) */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-b border-white/25" />
                    <div className="border-r border-white/25" />
                    <div className="border-r border-white/25" />
                    <div />
                  </div>

                  {/* Corner Handles */}
                  {/* Top-Left */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'tl')}
                    className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-lg flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>

                  {/* Top-Right */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'tr')}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-lg flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>

                  {/* Bottom-Left */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'bl')}
                    className="absolute -bottom-2.5 -left-2.5 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-lg flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>

                  {/* Bottom-Right */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'br')}
                    className="absolute -bottom-2.5 -right-2.5 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-lg flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>

                  {/* Edge Handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'top')}
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/90 border border-emerald-600 rounded-full cursor-ns-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'bottom')}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/90 border border-emerald-600 rounded-full cursor-ns-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'left')}
                    className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 bg-white/90 border border-emerald-600 rounded-full cursor-ew-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'right')}
                    className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white/90 border border-emerald-600 rounded-full cursor-ew-resize"
                  />

                  {/* Center Drag indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <Move className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Crop Bottom Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setRawImageSrc(null);
                    setMode('camera');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>

                <button
                  id="btn-apply-crop-confirm"
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Crop & Continue</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE 3: REVIEW & ATTACH ================= */}
          {mode === 'review' && croppedImageSrc && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Left: Cropped Image Preview */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[240px] aspect-3/4 rounded-xl overflow-hidden bg-black border-2 border-emerald-500/50 shadow-lg relative group">
                    <img
                      src={croppedImageSrc}
                      alt="Cropped document"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs p-1.5 rounded-lg border border-slate-800 text-[10px] text-center font-mono text-emerald-400">
                      <span>✓ Optical Scan Ready ({Math.round(fileSizeBytes / 1024)} KB)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode('crop')}
                    className="mt-2 text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Adjust Crop / Filter</span>
                  </button>
                </div>

                {/* Right: Metadata & Form */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white">MoTA Document Validation Check</span>
                      <span className="text-[11px] text-slate-300 leading-relaxed block mt-0.5">
                        High-resolution capture calibrated for automated institutional OCR and district nodal officer verification.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Assign to Required Scheme Document:
                    </label>
                    <select
                      value={selectedDocName}
                      onChange={(e) => setSelectedDocName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {docTypeOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDocName === 'Other / Custom Document' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        Custom Document Title:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bonafide Certificate or Gap Affidavit"
                        value={customDocName}
                        onChange={(e) => setCustomDocName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Certificate / Document Number (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JH/TRB/2026/8831"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Issuing Authority / Remark:
                    </label>
                    <input
                      type="text"
                      value={issuingAuthority}
                      onChange={(e) => setIssuingAuthority(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Review Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('camera');
                    startCamera();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rescan Another</span>
                </button>

                <button
                  id="btn-attach-scanned-document"
                  type="button"
                  onClick={handleAttachDocument}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach Document to Application</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
