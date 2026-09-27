import React, { useState } from 'react';
import {
  AlertOctagon,
  X,
  CheckCircle2,
  Clock,
  User,
  Building,
  ShieldCheck,
  PlusCircle,
  FileText
} from 'lucide-react';
import { GrievanceRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievances: GrievanceRecord[];
  selectedGrievanceId?: string;
  onCreateGrievance: (data: { applicationNumber: string; subject: string; description: string }) => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  isOpen,
  onClose,
  grievances,
  selectedGrievanceId,
  onCreateGrievance
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [activeGrievanceId, setActiveGrievanceId] = useState<string>(
    selectedGrievanceId || (grievances.length > 0 ? grievances[0].id : '')
  );

  const [formAppNo, setFormAppNo] = useState('MOTA202600123');
  const [formSubject, setFormSubject] = useState('');
  const [formDesc, setFormDesc] = useState('');

  if (!isOpen) return null;

  const currentGrievance =
    grievances.find((g) => g.id === activeGrievanceId || g.grievanceNumber === activeGrievanceId) ||
    grievances[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject || !formDesc) return;
    onCreateGrievance({
      applicationNumber: formAppNo,
      subject: formSubject,
      description: formDesc
    });
    setFormSubject('');
    setFormDesc('');
    setActiveTab('list');
  };

  return (
    <div
      id="modal-grievance-manager"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-800/60 border border-rose-600/40 text-rose-200">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                MoTA Grievance & SLA Escalation System
              </h3>
              <p className="text-xs text-rose-200">
                Direct statutory oversight by District Nodal Officers (Tribal Welfare)
              </p>
            </div>
          </div>

          <button
            id="btn-close-grievance-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              id="tab-grievances-active"
              onClick={() => setActiveTab('list')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'border-rose-700 text-rose-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Grievances ({grievances.length})
            </button>
            <button
              id="tab-grievance-new"
              onClick={() => setActiveTab('new')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'border-rose-700 text-rose-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              + File Manual Grievance
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Integrated with CPGRAMS-MoTA
          </span>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'new' ? (
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mx-auto">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                <strong>Need help?</strong> While applications exceeding 30 days are automatically escalated by the system, you can also manually register inquiries or report document issues here.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Associated Application *
                </label>
                <select
                  value={formAppNo}
                  onChange={(e) => setFormAppNo(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-600 font-medium"
                >
                  <option value="MOTA202600123">#MOTA202600123 — Post-Matric Scholarship</option>
                  <option value="MOTA202600089">#MOTA202600089 — Top Class Scholarship</option>
                  <option value="MOTA202600041">#MOTA202600041 — Pre-Matric Scholarship</option>
                  <option value="GENERAL">General Scholarship Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in course fee refund breakdown"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Grievance Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain the specific issue encountered..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-600 font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Submit Grievance to Nodal Officer
                </button>
              </div>
            </form>
          ) : currentGrievance ? (
            <div className="space-y-5">
              {/* Select Grievance if multiple */}
              {grievances.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {grievances.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGrievanceId(g.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all ${
                        (currentGrievance?.id === g.id)
                          ? 'bg-rose-100/70 border-rose-400 text-rose-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g.grievanceNumber}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Ticket Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        {currentGrievance.grievanceNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        App #{currentGrievance.applicationNumber}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {currentGrievance.subject}
                    </h4>
                  </div>

                  <StatusBadge status={currentGrievance.status} />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-4 bg-white p-3 rounded-lg border border-slate-200/80">
                  {currentGrievance.description}
                </p>

                {/* Assigned Authority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Assigned Officer</span>
                      <span className="font-bold text-slate-900">{currentGrievance.assignedOfficer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Jurisdiction</span>
                      <span className="font-semibold text-slate-800">
                        {currentGrievance.officeDesignation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Timeline */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Statutory Resolution Timeline
                </h5>

                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {currentGrievance.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs">
                      <div
                        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          step.active
                            ? 'bg-rose-100 border-rose-600 text-rose-700'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {step.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`font-bold ${step.active ? 'text-slate-900' : 'text-slate-500'}`}>
                            {step.stage}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No active grievances recorded.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="btn-close-grievance-footer"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
