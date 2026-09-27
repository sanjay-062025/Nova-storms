import React, { useState } from 'react';
import { Users, Phone, MessageSquare, Award, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Mentor } from '../types';
import { MentorChatModal } from './MentorChatModal';
import { MentorCallModal } from './MentorCallModal';
import { useLanguage } from '../i18n/LanguageContext';

interface MentorConnectSectionProps {
  mentors: Mentor[];
  studentName?: string;
}

export const MentorConnectSection: React.FC<MentorConnectSectionProps> = ({
  mentors,
  studentName = 'Sanjay'
}) => {
  const { t } = useLanguage();
  const [selectedMentorForChat, setSelectedMentorForChat] = useState<Mentor | null>(null);
  const [selectedMentorForCall, setSelectedMentorForCall] = useState<Mentor | null>(null);

  const handleCall = (mentor: Mentor) => {
    setSelectedMentorForChat(null);
    setSelectedMentorForCall(mentor);
  };

  const handleChat = (mentor: Mentor) => {
    setSelectedMentorForCall(null);
    setSelectedMentorForChat(mentor);
  };

  return (
    <div id="section-mentor-connect" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {t('mentor_connect_heading')}
            </h4>
            <p className="text-xs text-slate-500">
              {t('mentor_connect_sub')}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 hidden sm:inline-block">
          Peer Guidance Network
        </span>
      </div>

      {/* 3 Mock Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
          >
            <div>
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${mentor.avatarBg}`}
                >
                  {mentor.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="text-sm font-bold text-slate-900">{mentor.name}</h5>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 block">
                    {mentor.badge}
                  </span>
                  <span className="text-[11px] text-slate-500">{mentor.tribalGroup}</span>
                </div>
              </div>

              {/* Institution & qualification */}
              <div className="space-y-1 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 mb-2">
                <p className="font-semibold text-slate-800">{mentor.institution}</p>
                <p className="text-[11px] text-slate-500">{mentor.qualification}</p>
              </div>

              <div className="text-[11px] text-slate-500">
                <span className="font-medium">Languages:</span> {mentor.languages.join(', ')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2">
              <button
                id={`btn-call-mentor-${mentor.id}`}
                onClick={() => handleCall(mentor)}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('btn_call')}</span>
              </button>

              <button
                id={`btn-chat-mentor-${mentor.id}`}
                onClick={() => handleChat(mentor)}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('btn_chat')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Chat Modal */}
      {selectedMentorForChat && (
        <MentorChatModal
          mentor={selectedMentorForChat}
          studentName={studentName}
          onClose={() => setSelectedMentorForChat(null)}
          onSwitchToCall={(m) => {
            setSelectedMentorForChat(null);
            setSelectedMentorForCall(m);
          }}
        />
      )}

      {/* Interactive Call Modal */}
      {selectedMentorForCall && (
        <MentorCallModal
          mentor={selectedMentorForCall}
          studentName={studentName}
          onClose={() => setSelectedMentorForCall(null)}
          onSwitchToChat={(m) => {
            setSelectedMentorForCall(null);
            setSelectedMentorForChat(m);
          }}
        />
      )}
    </div>
  );
};

