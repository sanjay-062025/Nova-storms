import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Clock,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X,
  Send,
  AlertCircle,
  GraduationCap,
  Globe,
  BookOpen,
  Volume2,
  Check
} from 'lucide-react';
import {
  StudentProfile,
  InactiveUserMentorshipPlan,
  ScholarshipScheme
} from '../types';
import { MOCK_INACTIVE_USER_PLAN, OFFICIAL_MOTA_URL } from '../data/mockData';

interface InactiveUserMentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onOpenCall: (mentor: any) => void;
  onOpenChat: (mentor: any) => void;
  onFastTrackApply: (schemeId: string) => void;
}

export const InactiveUserMentorshipModal: React.FC<InactiveUserMentorshipModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenCall,
  onOpenChat,
  onFastTrackApply
}) => {
  const plan: InactiveUserMentorshipPlan = MOCK_INACTIVE_USER_PLAN;
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme>(plan.unclaimedSchemes[0].scheme);
  const [nudgeSent, setNudgeSent] = useState<'whatsapp' | 'sms' | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleSendNudge = (channel: 'whatsapp' | 'sms') => {
    setNudgeSent(channel);
    setTimeout(() => {
      setNudgeSent(null);
    }, 4000);
  };

  const handlePlayVoiceGuidance = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  return (
    <div
      id="inactive-user-mentorship-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Tricolor Government Strip */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-white flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                  Proactive Mentorship & Outreach
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Inactive for 42 Days
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ₹19.3 Lakhs Unclaimed
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Proactive Scholarship Matching & Alumni Mentorship
              </h2>
              <p className="text-xs text-slate-600">
                AI and MoTA rules engine identified unclaimed high-value scholarships matching{' '}
                <strong>{profile.name}</strong> ({profile.tribe || 'Santhal/Oraon ST'}).
              </p>
            </div>
          </div>

          <button
            id="btn-close-inactive-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Assigned Alumni Mentor Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md border-2 border-amber-400 shrink-0">
                  {plan.assignedMentor.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">
                      {plan.assignedMentor.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {plan.assignedMentor.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {plan.assignedMentor.institution}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {plan.assignedMentor.qualification}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-call-assigned-mentor"
                  onClick={() => onOpenCall(plan.assignedMentor)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Mentor (Free)</span>
                </button>
                <button
                  id="btn-chat-assigned-mentor"
                  onClick={() => onOpenChat(plan.assignedMentor)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Mentor's Personalized Voice / Note */}
            <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5 text-slate-200">
                <div className="p-1 rounded bg-amber-400/20 text-amber-300 mt-0.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="italic text-[11px] sm:text-xs leading-relaxed">
                  "{plan.personalizedNudgeMessage}"
                </p>
              </div>

              <button
                onClick={handlePlayVoiceGuidance}
                disabled={isPlayingAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors shrink-0 cursor-pointer disabled:opacity-75"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Playing Santhali Audio...' : 'Audio Voice Guide'}</span>
              </button>
            </div>
          </div>

          {/* Matched Unclaimed Schemes List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Available Scholarships Matched with Your Eligibility</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Sourced from official dataset at{' '}
                  <a
                    href={OFFICIAL_MOTA_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-emerald-800 font-bold"
                  >
                    tribal.nic.in/ScholarshiP.aspx
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {plan.unclaimedSchemes.map((item) => {
                const isSelected = selectedScheme.id === item.scheme.id;

                return (
                  <div
                    key={item.scheme.id}
                    onClick={() => setSelectedScheme(item.scheme)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.scheme.pillar === 'overseas'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {item.scheme.pillar === 'overseas'
                              ? '✈️ National Overseas (NOS)'
                              : '🏛️ National Scholarship'}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {item.matchScore}% Match
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {item.scheme.schemeName}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-900 block">
                          {item.potentialGrantFormatted}
                        </span>
                        <span className="text-[10px] font-semibold text-rose-600 block">
                          {item.deadlineAlert}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {item.scheme.description}
                    </p>

                    {/* Eligibility Highlights */}
                    <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80 mb-3 text-[11px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Why You Are Eligible:
                      </span>
                      {item.eligibilityHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fast Track CTA */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Slots: {item.scheme.annualSlots || 'Open'} candidates / yr
                      </span>
                      <button
                        id={`btn-fasttrack-${item.scheme.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFastTrackApply(item.scheme.id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>1-Click Fast-Track Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multi-Channel Outreach Simulator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Multi-Channel Proactive Nudge Dispatch (Automated)</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  Sends personalized reminder alerts to student's mobile ({profile.phoneMask}) with direct link to connect with mentor.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="btn-send-whatsapp-nudge"
                  onClick={() => handleSendNudge('whatsapp')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                >
                  {nudgeSent === 'whatsapp' ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> WhatsApp Sent!
                    </span>
                  ) : (
                    'Test WhatsApp Alert'
                  )}
                </button>
                <button
                  id="btn-send-sms-nudge"
                  onClick={() => handleSendNudge('sms')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                >
                  {nudgeSent === 'sms' ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> SMS Dispatched!
                    </span>
                  ) : (
                    'Test SMS Alert'
                  )}
                </button>
              </div>
            </div>

            {/* Live Message Preview Box */}
            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Dispatched SMS / WhatsApp Message Template:
              </span>
              <p className="text-[11px] text-slate-800 leading-relaxed">
                "Johar Sanjay! Ministry of Tribal Affairs (MoTA) alert: You have{' '}
                <strong className="text-emerald-800">₹19.3 Lakhs</strong> in unclaimed ST scholarships (National Overseas & Top Class). Senior ST Mentor Rajesh Soren is ready to assist you. Tap here to resume: https://tribal.nic.in/ScholarshiP.aspx?track=JH8831"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <a
            href={OFFICIAL_MOTA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-900 font-bold hover:underline"
          >
            <span>Official MoTA Scholarship Rules</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
