import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Phone,
  ShieldCheck,
  Bot,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Mentor, MentorChatMessage } from '../types';

interface MentorChatModalProps {
  mentor: Mentor;
  studentName?: string;
  onClose: () => void;
  onSwitchToCall: (mentor: Mentor) => void;
}

export const MentorChatModal: React.FC<MentorChatModalProps> = ({
  mentor,
  studentName = 'Sanjay',
  onClose,
  onSwitchToCall
}) => {
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested questions customized for each mentor
  const suggestedQuestions: Record<string, string[]> = {
    'm-1': [ // Asha Murmu (Top Class, IIT Delhi)
      'How do I speed up my institute nodal verification?',
      'Is hostel accommodation fully covered under Top Class?',
      'Do I need to submit an affidavit for income under ₹6L?',
      'Tips for ST students applying for IIT M.Tech fellowships'
    ],
    'm-2': [ // Ravi Kumar (NOS, IIM Bangalore)
      'What documents are critical for National Overseas Scholarship?',
      'How does Post-Matric renewal work in senior years?',
      'How to open an Aadhaar-seeded bank account for DBT?',
      'Career guidance for ST students targeting premier IIMs'
    ],
    'm-3': [ // Meena Oraon (NFST Fellowship, Univ of Hyderabad)
      'How does UGC-NET score correlate with NFST fellowship?',
      'What is the monthly contingency allowance under NFST?',
      'My application is pending at District level, what to do?',
      'How can I get research publications funded by MoTA?'
    ]
  };

  const currentSuggestions = suggestedQuestions[mentor.id] || [
    'How do I expedite my scholarship approval?',
    'What documents should I keep ready for verification?',
    'How long does PFMS take to disburse the amount?',
    'Can I apply for multiple tribal scholarships?'
  ];

  // Initialize welcoming message
  useEffect(() => {
    let initialGreeting = '';
    if (mentor.id === 'm-1') {
      initialGreeting = `Johar ${studentName}! I am Asha Murmu from IIT Delhi. Congratulations on pursuing your B.Tech at NIT Jamshedpur! I was a beneficiary of MoTA's Top Class ST Scholarship during my engineering years. How can I guide you with your applications, verification, or institute documentation today?`;
    } else if (mentor.id === 'm-2') {
      initialGreeting = `Namaste ${studentName}! Ravi Kumar here from IIM Bangalore. I utilized both the Post-Matric Scholarship and National Overseas Scholarship for my studies. Don't hesitate to ask about bank seeding, PFMS disbursement stages, or career pathways!`;
    } else {
      initialGreeting = `Johar ${studentName}! I am Meena Oraon, currently doing my Ph.D. at University of Hyderabad under the National Fellowship for ST Students (NFST). Feel free to ask me anything about scholarship documentation, nodal escalations, or higher research!`;
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'mentor',
        text: initialGreeting,
        timestamp: 'Just now'
      }
    ]);
  }, [mentor, studentName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Realistic mentor advice generator
  const getMentorReply = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('speed') || q.includes('expedite') || q.includes('delay') || q.includes('verification') || q.includes('nodal')) {
      return `For institute verification delays, visit your college's Tribal Welfare / Academic Section in person with a printout of your Application Summary and DigiLocker caste certificate. If it crosses 30 days, the MoTA SLA engine automatically flags an escalation to the District Nodal Officer (just like on this portal). You can also show them your auto-generated Grievance ID!`;
    }

    if (q.includes('hostel') || q.includes('mess') || q.includes('allowance')) {
      return `Under the Top Class ST Scholarship, non-refundable tuition fees are paid directly to your premier institute (NIT/IIT/IIM), plus you receive a living allowance of ₹3,000/month (₹36,000/year), books & stationery allowance of ₹5,000/year, and a computer allowance of up to ₹45,000 one-time! Make sure your college submits the fee breakup correctly.`;
    }

    if (q.includes('income') || q.includes('affidavit') || q.includes('ceiling') || q.includes('limit')) {
      return `For Post-Matric ST Scholarship, the parental income ceiling is ₹2.5 Lakhs/year. For Top Class Higher Education, it is ₹6.0 Lakhs/year. For NFST Fellowship, there is no income ceiling! Make sure your income certificate is issued by an Executive Magistrate or Tehsildar within the valid fiscal year.`;
    }

    if (q.includes('bank') || q.includes('aadhaar') || q.includes('dbt') || q.includes('npci') || q.includes('pfms')) {
      return `All MoTA central disbursements use the Aadhaar Payment Bridge (APBS). Ensure your bank account is seeded with NPCI mapper (not just linked for KYC). You can check NPCI seeding status on UIDAI portal or with your home branch bank manager. Once PFMS sanctions the batch, funds land directly within 48 to 72 hours!`;
    }

    if (q.includes('nos') || q.includes('overseas') || q.includes('foreign') || q.includes('abroad')) {
      return `The National Overseas Scholarship (NOS) provides 100% coverage (tuition, flights, £9,900 to $15,400 annual stipend) for ST candidates admitted into top 500 QS ranked global universities. Start prepping GRE/IELTS in your 3rd year and ensure your aggregate marks remain above 55%.`;
    }

    if (q.includes('net') || q.includes('phd') || q.includes('research') || q.includes('nfst') || q.includes('fellowship')) {
      return `For NFST (National Fellowship for ST Students), qualifying UGC-NET / CSIR-NET is required. MoTA awards 750 fellowships each year: Junior Research Fellowship (JRF) starts at ₹37,000/month plus HRA and contingency grants. It is one of the best programs for tribal scholars!`;
    }

    return `That's a very practical question, ${studentName}! In my experience navigating the Ministry of Tribal Affairs portal, keeping all certificates verified on DigiLocker ahead of the deadline eliminates 90% of verification stalls. Feel free to ask more specifics about guidelines or contact your District Nodal Officer if needed. I am right here to help!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: MentorChatMessage = {
      id: `student-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay for realistic interaction
    setTimeout(() => {
      const replyText = getMentorReply(text);
      const mentorMsg: MentorChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${mentor.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[85vh] sm:h-[620px] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${mentor.avatarBg}`}>
              {mentor.initials}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-indigo-950"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm sm:text-base font-extrabold text-white">{mentor.name}</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  {mentor.badge}
                </span>
              </div>
              <p className="text-[11px] text-indigo-200">
                {mentor.institution} • {mentor.tribalGroup} Group
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Call Button in header */}
            <button
              onClick={() => onSwitchToCall(mentor)}
              aria-label="Switch to Call"
              className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              title="Start Voice Consultation"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mentor Credential Strip */}
        <div className="bg-indigo-50/80 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-xs text-indigo-900">
          <span className="flex items-center gap-1 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Verified MoTA Senior Scholar Network
          </span>
          <span className="text-[10px] text-slate-500">
            Languages: {mentor.languages.join(', ')}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white ${
                  msg.sender === 'student' ? 'bg-emerald-700' : `${mentor.avatarBg}`
                }`}
              >
                {msg.sender === 'student' ? studentName.charAt(0) : mentor.initials}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'student'
                    ? 'bg-indigo-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                <div className="font-semibold text-[10px] mb-1 opacity-75">
                  {msg.sender === 'student' ? 'You (Sanjay Kumar)' : `${mentor.name}`}
                </div>
                <p className="whitespace-pre-line font-medium">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'student' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${mentor.avatarBg}`}>
                {mentor.initials}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-[11px] shadow-2xs">
                <span className="font-medium text-slate-600">{mentor.name} is typing</span>
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-2.5 bg-white border-t border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Suggested Questions for {mentor.name}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {currentSuggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${mentor.name}...`}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
