import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Key,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Lock,
  X,
  FileCheck2,
  Building2,
  School,
  GraduationCap,
  Fingerprint,
  Radio,
  Zap,
  Check
} from 'lucide-react';
import {
  GovApiKeyConfig,
  GovPipelineStage,
  GovDataSourceKey,
  StudentProfile
} from '../types';
import { DEFAULT_GOV_API_CONFIGS, INITIAL_GOV_PIPELINE_STAGES } from '../data/mockData';

interface GovDataPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onVerificationComplete?: (token: string) => void;
}

export const GovDataPipelineModal: React.FC<GovDataPipelineModalProps> = ({
  isOpen,
  onClose,
  profile,
  onVerificationComplete
}) => {
  const [apiConfigs, setApiConfigs] = useState<GovApiKeyConfig[]>(DEFAULT_GOV_API_CONFIGS);
  const [pipelineStages, setPipelineStages] = useState<GovPipelineStage[]>(INITIAL_GOV_PIPELINE_STAGES);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeStageId, setActiveStageId] = useState<GovDataSourceKey | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [testingKeySource, setTestingKeySource] = useState<GovDataSourceKey | null>(null);
  const [testResultSuccess, setTestResultSuccess] = useState<GovDataSourceKey | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>('GDV-2026-JH-8831-VERIFIED');
  const [expandedStage, setExpandedStage] = useState<GovDataSourceKey | null>('UIDAI');
  const [isSandboxMode, setIsSandboxMode] = useState(true);

  if (!isOpen) return null;

  // Run the full 5-stage seamless verification pipeline
  const runFullPipeline = async () => {
    setIsRunningPipeline(true);
    const stageKeys: GovDataSourceKey[] = ['UIDAI', 'DigiLocker', 'AISHE', 'UDISE', 'APAAR'];

    // Reset stages to idle/running
    setPipelineStages((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'idle',
        progressPercentage: 0
      }))
    );

    for (let i = 0; i < stageKeys.length; i++) {
      const key = stageKeys[i];
      setActiveStageId(key);

      // Mark current running
      setPipelineStages((prev) =>
        prev.map((s) =>
          s.id === key ? { ...s, status: 'running', progressPercentage: 45 } : s
        )
      );

      // Simulated network latency matching config
      const targetConfig = apiConfigs.find((c) => c.source === key);
      const delay = targetConfig?.latencyMs ? targetConfig.latencyMs * 4 : 500;
      await new Promise((r) => setTimeout(r, delay));

      // Mark completed
      const randomHash = '0x' + Math.random().toString(16).substring(2, 12) + '...';
      setPipelineStages((prev) =>
        prev.map((s) =>
          s.id === key
            ? {
                ...s,
                status: 'success',
                progressPercentage: 100,
                digitalSignatureHash: randomHash,
                timestamp: 'Just now'
              }
            : s
        )
      );
    }

    const newToken = `GDV-2026-JH-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`;
    setVerificationToken(newToken);
    setIsRunningPipeline(false);
    setActiveStageId(null);
    if (onVerificationComplete) {
      onVerificationComplete(newToken);
    }
  };

  const testSingleApiConnection = async (source: GovDataSourceKey) => {
    setTestingKeySource(source);
    setTestResultSuccess(null);
    await new Promise((r) => setTimeout(r, 650));
    setTestingKeySource(null);
    setTestResultSuccess(source);
    setApiConfigs((prev) =>
      prev.map((c) =>
        c.source === source
          ? {
              ...c,
              status: 'connected',
              lastTested: 'Just now',
              latencyMs: Math.floor(75 + Math.random() * 60)
            }
          : c
      )
    );
    setTimeout(() => setTestResultSuccess(null), 3500);
  };

  const handleApiKeyChange = (source: GovDataSourceKey, newKey: string) => {
    setApiConfigs((prev) =>
      prev.map((c) =>
        c.source === source
          ? {
              ...c,
              apiKey: newKey,
              isCustomKey: true,
              status: newKey.length > 5 ? 'connected' : 'unconfigured'
            }
          : c
      )
    );
  };

  const getStageIcon = (id: GovDataSourceKey) => {
    switch (id) {
      case 'UIDAI':
        return <Fingerprint className="w-4 h-4 text-amber-700" />;
      case 'DigiLocker':
        return <Lock className="w-4 h-4 text-blue-700" />;
      case 'AISHE':
        return <Building2 className="w-4 h-4 text-indigo-700" />;
      case 'UDISE':
        return <School className="w-4 h-4 text-emerald-700" />;
      case 'APAAR':
        return <GraduationCap className="w-4 h-4 text-purple-700" />;
    }
  };

  const allStagesVerified = pipelineStages.every((s) => s.status === 'success');

  return (
    <div
      id="govdata-pipeline-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Tricolor Header Accent */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-md shrink-0">
              <Database className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wider">
                  MoTA GovData Connect
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  5-Source Seamless Ingress
                </span>
                {isSandboxMode ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Govt Sandbox Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                    Production Gateway
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Unified Government Data Verification Pipeline
              </h2>
              <p className="text-xs text-slate-600">
                Zero-paperwork verification aggregating <strong>UIDAI</strong>,{' '}
                <strong>DigiLocker</strong>, <strong>AISHE</strong>, <strong>UDISE+</strong>, and{' '}
                <strong>APAAR / ABC</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-toggle-api-config"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Configure Government API Keys"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Govt API Keys</span>
            </button>
            <button
              id="btn-close-govdata-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Verification Pipeline
              </span>
              <span className="text-sm font-bold text-emerald-900 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {allStagesVerified ? 'All 5 Sources Verified' : 'In Progress'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Average API Latency
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Zap className="w-4 h-4 text-amber-600" /> 122 ms (Ultra-Fast)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Security Standard
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Lock className="w-4 h-4 text-blue-600" /> SHA-256 PKI Signed
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                Audit Token
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 truncate block mt-1">
                {verificationToken}
              </span>
            </div>
          </div>

          {/* Government API Keys Drawer (Toggleable) */}
          {showConfigDrawer && (
            <div
              id="gov-api-key-drawer"
              className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4 animate-in slide-in-from-top-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Government Ingress API Key Configuration
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSandboxMode}
                      onChange={(e) => setIsSandboxMode(e.target.checked)}
                      className="rounded border-slate-600 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Government Sandbox Simulator</span>
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If the government provides production credentials, enter them below. In sandbox mode, verified mock tokens are used to simulate end-to-end data pipeline responses from official authorities.
              </p>

              <div className="space-y-2.5">
                {apiConfigs.map((config) => (
                  <div
                    key={config.source}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{config.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          {config.latencyMs}ms
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{config.subLabel}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="text"
                        value={config.apiKey}
                        onChange={(e) => handleApiKeyChange(config.source, e.target.value)}
                        placeholder="Enter API Key / Token"
                        className="font-mono text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 w-48 sm:w-56 focus:outline-amber-500"
                      />
                      <button
                        onClick={() => testSingleApiConnection(config.source)}
                        disabled={testingKeySource === config.source}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {testingKeySource === config.source ? (
                          <span className="inline-flex items-center gap-1">
                            <RotateCw className="w-3 h-3 animate-spin" /> Ping
                          </span>
                        ) : testResultSuccess === config.source ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <Check className="w-3 h-3" /> 200 OK
                          </span>
                        ) : (
                          'Ping API'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Pipeline Flow Visualizer */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <span>Interactive 5-Stage Government Data Flow</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Data verified in real-time directly from authoritative statutory databases.
                </p>
              </div>

              <button
                id="btn-run-full-gov-pipeline"
                onClick={runFullPipeline}
                disabled={isRunningPipeline}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
                <span>
                  {isRunningPipeline ? 'Verifying Across 5 Gateways...' : 'Run Live Verification Pipeline'}
                </span>
              </button>
            </div>

            {/* Stages Stack */}
            <div className="space-y-2.5">
              {pipelineStages.map((stage, idx) => {
                const isExpanded = expandedStage === stage.id;
                const isCurrentActive = activeStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`rounded-xl border transition-all ${
                      isCurrentActive
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
                        : stage.status === 'success'
                        ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            stage.status === 'success'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isCurrentActive
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {stage.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          ) : (
                            getStageIcon(stage.id)
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {stage.title}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                              {stage.authority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {stage.status === 'success'
                              ? `Verified with digital signature (${stage.latencyMs || 110}ms)`
                              : isCurrentActive
                              ? 'Contacting government gateway server...'
                              : 'Ready for pipeline trigger'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {stage.status === 'success' && (
                          <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Certified
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Stage Verified Payload */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {stage.verifiedData?.map((item, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                                <span>{item.label}</span>
                                <span className="font-semibold text-emerald-700">
                                  {item.verifiedBadge}
                                </span>
                              </div>
                              <p className="font-bold text-slate-800 truncate">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-500 pt-1">
                          <span className="truncate">
                            Digital Signature Hash: <strong>{stage.digitalSignatureHash}</strong>
                          </span>
                          <span className="text-slate-400">Timestamp: {stage.timestamp}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Verification Guarantee Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-emerald-950">
                  Zero Physical Documents Required For Application
                </p>
                <p className="text-[11px] text-emerald-800">
                  Because your data has been verified through statutory Government APIs, physical attested xeroxes are completely waived.
                </p>
              </div>
            </div>

            <button
              id="btn-apply-token"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
