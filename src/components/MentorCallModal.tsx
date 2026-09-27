import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  X
} from 'lucide-react';
import { Mentor } from '../types';

interface MentorCallModalProps {
  mentor: Mentor;
  studentName?: string;
  onClose: () => void;
  onSwitchToChat: (mentor: Mentor) => void;
}

export const MentorCallModal: React.FC<MentorCallModalProps> = ({
  mentor,
  studentName = 'Sanjay',
  onClose,
  onSwitchToChat
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [captionTopic, setCaptionTopic] = useState<string>('greeting');

  // Initial call connection simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallState('connected');
      setCurrentCaption(
        `Johar ${studentName}! I am ${mentor.name} on the MoTA Senior Scholar Line. I see your application was auto-escalated due to a 30-day delay. Don't worry, this happens often with institute nodal desks — I am here to tell you exactly how to resolve it!`
      );
    }, 2800);
    return () => clearTimeout(timer);
  }, [mentor, studentName]);

  // Call duration counter
  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAskTopic = (topic: string, question: string) => {
    setCaptionTopic(topic);
    if (topic === 'delay') {
      setCurrentCaption(
        `"On institute verification delays: First, go to your college's Tribal Welfare / Academic Cell in person. Take your Unified Student ID (${studentName === 'Sanjay' ? 'ST-2026-JH-8831' : 'ST-Verified'}) and ask the nodal officer for the batch dispatch slip. Since your application is already escalated under ticket GRV-MOTA, they are mandated to resolve it within 48 hours!"`
      );
    } else if (topic === 'hostel') {
      setCurrentCaption(
        `"Regarding hostel and mess fees: Under MoTA Top Class guidelines, non-refundable institute tuition is directly disbursed to the institute account, while living allowance (₹3,000/month) and stationery grants are credited directly to your Aadhaar-seeded bank account through APBS!"`
      );
    } else if (topic === 'aadhaar') {
      setCurrentCaption(
        `"Very crucial: Check your Aadhaar NPCI mapper! Even if your bank account has Aadhaar KYC, you must explicitly enable 'Direct Benefit Transfer (DBT) Mandate'. Once mapped, PFMS transfers occur seamlessly without any bank rejection."`
      );
    } else {
      setCurrentCaption(
        `"Keep your academic semester marksheets updated in your DigiLocker locker. For scholarship renewal in your next academic year, you just click 'One-Click Renewal' without re-uploading your ST caste or domicile certificates!"`
      );
    }
  };

  const handleEndCall = () => {
    setCallState('ended');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Voice call with ${mentor.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col justify-between min-h-[540px]">
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Radio className="w-3 h-3 animate-pulse" />
              MoTA Secure Peer Voice Bridge
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Call Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Calling Avatar & Status */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          {/* Avatar with Pulse Rings */}
          <div className="relative flex items-center justify-center my-2">
            {callState === 'connected' && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-indigo-500/20 animate-ping duration-1000"></span>
                <span className="absolute w-28 h-28 rounded-full bg-indigo-400/30 animate-pulse"></span>
              </>
            )}
            {callState === 'connecting' && (
              <span className="absolute w-32 h-32 rounded-full border-2 border-indigo-400/40 animate-spin"></span>
            )}

            <div
              className={`relative z-10 w-24 h-24 rounded-full text-white flex items-center justify-center font-bold text-2xl shadow-xl ring-4 ring-white/10 ${mentor.avatarBg}`}
            >
              {mentor.initials}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{mentor.name}</h3>
            <p className="text-xs text-indigo-300 font-medium mt-0.5">
              {mentor.institution} • {mentor.badge}
            </p>
            <p className="text-[11px] text-slate-400">{mentor.tribalGroup} Scholar Network</p>
          </div>

          {/* Status / Timer */}
          <div>
            {callState === 'connecting' && (
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Dialing mentor via MoTA Peer Gateway...</span>
              </div>
            )}

            {callState === 'connected' && (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{formatTime(seconds)}</span>
                </div>
                {/* Audio Waveform Simulator */}
                <div className="flex items-center justify-center gap-1 pt-1 h-5">
                  <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1 h-4 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-5 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="w-1 h-4 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                </div>
              </div>
            )}

            {callState === 'ended' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Ended (Duration: {formatTime(seconds)})</span>
              </div>
            )}
          </div>

          {/* Live Captions Transcript Box */}
          {callState === 'connected' && (
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-left space-y-2 mt-2">
              <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Live Mentor Voice Captions
                </span>
                <span className="text-emerald-400 font-normal">Active Voice</span>
              </div>
              <p className="text-xs text-slate-100 leading-relaxed font-medium italic">
                {currentCaption}
              </p>

              {/* In-Call Quick Questions */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-400 block mb-1">Tap to ask during call:</span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleAskTopic('delay', 'Ask about verification delay')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    ⚡ Verification Delay
                  </button>
                  <button
                    onClick={() => handleAskTopic('hostel', 'Ask about hostel & mess allowance')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    🏠 Hostel & Mess Fee
                  </button>
                  <button
                    onClick={() => handleAskTopic('aadhaar', 'Ask about Aadhaar NPCI seeding')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    💳 Bank NPCI Seeding
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ended Summary Box */}
          {callState === 'ended' && (
            <div className="w-full bg-white/10 rounded-2xl p-4 border border-white/10 text-left space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Consultation Summary Saved
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Key guidance from {mentor.name}: Follow up with college tribal welfare cell for ticket GRV-MOTA and ensure your bank account is seeded on NPCI mapper.
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onSwitchToChat(mentor)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Continue in Chat</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        {callState !== 'ended' && (
          <div className="p-5 bg-slate-950/60 border-t border-white/10 flex items-center justify-around">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isMuted
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              id="btn-end-mentor-call"
              onClick={handleEndCall}
              aria-label="End Call"
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 ring-4 ring-rose-900/40"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            {/* Speaker Button */}
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              aria-label={isSpeaker ? 'Speaker On' : 'Speaker Off'}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isSpeaker
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
