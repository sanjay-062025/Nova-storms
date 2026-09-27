import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Languages,
  Loader2,
  HelpCircle,
  IndianRupee,
  FileText,
  AlertOctagon,
  GripHorizontal,
  Move,
  RotateCcw
} from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

interface JagoChatbotProps {
  hasEscalated: boolean;
  onOpenChecker: () => void;
  onNavigateTab: (tab: 'home' | 'scholarships' | 'applications' | 'payments' | 'profile') => void;
}

export const JagoChatbot: React.FC<JagoChatbotProps> = ({
  hasEscalated,
  onOpenChecker,
  onNavigateTab
}) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Movable Coordinates State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update initial message when language changes if only welcome message is present
  useEffect(() => {
    let welcomeText =
      'Namaste Sanjay! I am JAGO, your dedicated MoTA Scholarship Assistant. How can I help with your tribal scholarship applications, DBT disbursements, or eligibility today?';
    let defaultQuickReplies = [
      'Application Status',
      'Check Eligibility',
      'Payment Status',
      'Required Documents',
      'Grievance Status'
    ];

    if (language === 'hi') {
      welcomeText =
        'नमस्ते संजय! मैं जागो (JAGO), आपका जनजातीय कार्य मंत्रालय (MoTA) छात्रवृत्ति सहायक हूँ। मैं आपके आवेदन, छात्रवृत्ति भुगतान या पात्रता में कैसे सहायता कर सकता हूँ?';
      defaultQuickReplies = ['आवेदन की स्थिति', 'पात्रता जांच', 'भुगतान स्थिति', 'आवश्यक दस्तावेज', 'शिकायत स्थिति'];
    } else if (language === 'sat') {
      welcomeText =
        'ᱡᱚᱦᱟᱨ ᱥᱚᱧᱡᱚᱭ! ᱤᱧ ᱫᱚ JAGO, MoTA ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ᱾ ᱫᱚᱨᱠᱷᱟᱥᱛ ᱦᱟᱞᱚᱛ, ᱴᱟᱠᱟ ᱧᱟᱢ, ᱥᱮ ᱥᱟᱠᱟᱢ ᱠᱚ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤᱧ ᱢᱮ᱾';
      defaultQuickReplies = ['ᱫᱚᱨᱠᱷᱟᱥᱛ ᱦᱟᱞᱚᱛ', 'ᱯᱟᱛᱨᱚᱛᱟ ᱡᱟᱸᱪ', 'ᱴᱟᱠᱟ ᱦᱟᱞᱚᱛ', 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱥᱟᱠᱟᱢ'];
    } else if (language === 'ta') {
      welcomeText =
        'வணக்கம் சஞ்சய்! நான் ஜாகோ (JAGO), உங்களின் MoTA கல்வி உதவித்தொகை உதவியாளர். விண்ணப்ப நிலை, பணம் செலுத்துதல் அல்லது தகுதி குறித்து என்னிடம் கேளுங்கள்.';
      defaultQuickReplies = ['விண்ணப்ப நிலை', 'தகுதி சரிபார்த்தல்', 'பணம் செலுத்துதல்', 'தேவையான ஆவணங்கள்'];
    }

    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: 'msg-init',
            sender: 'jago',
            text: welcomeText,
            timestamp: 'Just now',
            quickReplies: defaultQuickReplies
          }
        ];
      }
      return prev;
    });
  }, [language]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Dragging Handlers (Supports both Mouse and Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from header/handle or button, not inside inputs or buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }

    const currentEl = e.currentTarget;
    const rect = currentEl.getBoundingClientRect();
    dragStartOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isDraggingRef.current = true;
    currentEl.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const width = isOpen ? (window.innerWidth < 640 ? window.innerWidth : 420) : 180;
    const height = isOpen ? 580 : 54;

    const newX = Math.max(10, Math.min(window.innerWidth - width - 10, e.clientX - dragStartOffsetRef.current.x));
    const newY = Math.max(10, Math.min(window.innerHeight - height - 10, e.clientY - dragStartOffsetRef.current.y));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignored if capture already released
      }
    }
  };

  const resetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.askJago(query, language);
      const jagoMsg: ChatMessage = {
        id: `jago-${Date.now()}`,
        sender: 'jago',
        text: response.reply,
        timestamp: 'Just now',
        quickReplies: response.quickReplies
      };
      setMessages((prev) => [...prev, jagoMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `jago-err-${Date.now()}`,
          sender: 'jago',
          text: 'I apologize, I am temporarily having trouble reaching the central MoTA database. Please check your network or try again in a few moments.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Check Eligibility' || reply === 'पात्रता जांच' || reply === 'தகுதி சரிபார்த்தல்') {
      onOpenChecker();
      return;
    }
    if (reply === 'Application Status' || reply === 'आवेदन की स्थिति' || reply === 'விண்ணப்ப நிலை') {
      onNavigateTab('applications');
    }
    if (reply === 'Payment Status' || reply === 'भुगतान स्थिति' || reply === 'பணம் செலுத்துதல்') {
      onNavigateTab('payments');
    }
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Floating Chatbot Launch Button (Movable) */}
      {!isOpen && (
        <div
          id="btn-open-jago-chatbot-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={
            position
              ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
              : undefined
          }
          className={`fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing ${
            !position ? 'bottom-20 right-4 sm:right-6' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-white shadow-xl border border-emerald-500/40 hover:border-emerald-400">
            <span
              title="Drag to move JAGO"
              className="p-1.5 text-slate-400 hover:text-white cursor-grab"
            >
              <Move className="w-3.5 h-3.5" />
            </span>

            <button
              id="btn-open-jago-chatbot"
              onClick={() => setIsOpen(true)}
              aria-label="Open JAGO Scholarship Assistant"
              className="flex items-center gap-2 pr-3 py-1 text-white cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black block text-white leading-none">JAGO</span>
                  <span className="text-[9px] font-bold px-1 rounded bg-amber-400 text-slate-950">MoTA</span>
                </div>
                <span className="text-[10px] text-emerald-200 leading-none">Assistant</span>
              </div>
              {hasEscalated && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white animate-bounce">
                  Alert
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Movable JAGO Chat Window */}
      {isOpen && (
        <div
          id="jago-chat-window"
          role="dialog"
          aria-label="JAGO Chat Assistant"
          style={
            position
              ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
              : undefined
          }
          className={`fixed z-50 w-full sm:w-[420px] h-[85vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 select-none ${
            !position ? 'bottom-0 right-0 sm:bottom-6 sm:right-6' : ''
          }`}
        >
          {/* Draggable Chat Header */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="flex items-center gap-2">
              <span title="Drag to reposition JAGO" className="text-slate-400 hover:text-white p-1">
                <GripHorizontal className="w-4 h-4" />
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">JAGO</h4>
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-400 text-slate-950">
                    MoTA AI
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">• Movable</span>
                </div>
                <p className="text-[10px] text-emerald-300">Unified Scholarship Assistant</p>
              </div>
            </div>

            {/* Language Picker, Reset Position & Close */}
            <div className="flex items-center gap-1.5">
              {position && (
                <button
                  onClick={resetPosition}
                  title="Dock to bottom-right corner"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-[10px] border border-slate-700">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                      language === l.code ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                    title={l.label}
                  >
                    {l.badge}
                  </button>
                ))}
              </div>

              <button
                id="btn-close-jago"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close JAGO"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs select-text">
            {messages.map((msg) => {
              const isJago = msg.sender === 'jago';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isJago ? 'justify-start' : 'justify-end'}`}
                >
                  {isJago && (
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-0.5">
                      J
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-1.5">
                    <div
                      className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                        isJago
                          ? 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
                          : 'bg-emerald-800 text-white shadow-xs rounded-tr-xs font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Quick reply buttons under JAGO messages */}
                    {isJago && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickReplies.map((qr, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickReply(qr)}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isJago && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-0.5">
                      S
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-9">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>JAGO is retrieving MoTA records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Ask:</span>
            <button
              onClick={() => handleSendMessage('What is my scholarship status?')}
              className="text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg shrink-0 font-medium cursor-pointer"
            >
              Application Status
            </button>
            <button
              onClick={() => handleSendMessage('When will I receive my scholarship?')}
              className="text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg shrink-0 font-medium cursor-pointer"
            >
              Payment Timeline
            </button>
            <button
              onClick={() => handleSendMessage('What is my entitlement?')}
              className="text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg shrink-0 font-medium cursor-pointer"
            >
              Entitlement Wallet
            </button>
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                language === 'hi'
                  ? 'छात्रवृत्ति या आवेदन के बारे में पूछें...'
                  : language === 'ta'
                  ? 'கல்வி உதவித்தொகை பற்றி கேளுங்கள்...'
                  : 'Ask about applications, DBT payments, eligibility...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-medium text-slate-900 bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
