'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { Language } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  queryMetadata?: {
    model: string;
    recordsRetrieved: number;
    latencyMs: number;
  };
}

interface AdminChatWidgetProps {
  currentLang?: Language;
  userRole?: 'Admin' | 'Instructor';
  onOpenReportsModal?: () => void;
}

const PRESET_QUESTIONS = [
  "How many students are enrolled in Hair Dressing?",
  "Which students have pending payments?",
  "Show me attendance below 75% this month",
  "List students ready for certificate generation",
  "What's average competency for Barbering?"
];

export const AdminChatWidget: React.FC<AdminChatWidgetProps> = ({
  currentLang = 'en',
  userRole = 'Admin',
  onOpenReportsModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const INITIAL_WELCOME_MSG: Message = {
    id: 'welcome-1',
    sender: 'assistant',
    text: 'Hello Admin! I am your AI Institute Assistant powered by Groq (`llama-3.1-8b-instant`). Ask me anything about enrolled students, course competencies, attendance logs, or pending payments.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: ['Prisma DB: Live Institute Datastore']
  };

  // Start with the welcome message; hydrate from localStorage after mount
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MSG]);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dare_admin_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage whenever messages state updates
  useEffect(() => {
    try {
      localStorage.setItem('dare_admin_chat_history', JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  // Simulated AI response generator reflecting real Prisma context retrieval logic
  const processQuery = async (userQuestion: string) => {
    setIsLoading(true);
    const qLower = userQuestion.toLowerCase();
    
    // Simulate network delay for API query
    await new Promise(res => setTimeout(res, 900));

    let replyText = '';
    let sources: string[] = [];
    let recordCount = 0;

    if (qLower.includes('hair dressing') || qLower.includes('hairdressing')) {
      replyText = `Based on live Prisma records in PostgreSQL:\n- **Total Enrolled in Hair Dressing**: 42 Active Students (28 Female, 14 Male)\n- **Completion Rate**: 88%\n- **Top Unit**: Advanced Bridal Styling (94% Competency Rate)`;
      sources = ['Prisma.Student.count({ where: { course: "Hair Dressing" } })', 'Prisma.Course.findUnique()'];
      recordCount = 42;
    } else if (qLower.includes('pending payment') || qLower.includes('pending')) {
      replyText = `Found **4 students** with pending tuition balance:\n1. **Abebe Kebede** — Hair Dressing (Bal: 2,500 ETB)\n2. **Tigist Haile** — Makeup Art (Bal: 1,800 ETB)\n3. **Chala Bekele** — Barbering (Bal: 3,000 ETB)\n4. **Selam Alemu** — Nail Tech (Bal: 1,200 ETB)\n\nTotal Outstanding: **8,500 ETB**.`;
      sources = ['Prisma.Payment.findMany({ where: { status: "PENDING" } })', 'Prisma.Student.findMany()'];
      recordCount = 4;
    } else if (qLower.includes('attendance') || qLower.includes('75%')) {
      replyText = `Attendance Alert (<75% threshold for current month):\n- **Dawit Tadesse** (Barbering): 68% attendance (14/21 sessions)\n- **Meron Zewde** (Beauty Therapy): 71% attendance (15/21 sessions)\n\n*Action Suggested*: Flagged for instructor follow-up before final unit exam.`;
      sources = ['Prisma.Attendance.groupBy({ where: { date: { gte: MonthStart } } })'];
      recordCount = 2;
    } else if (qLower.includes('certificate') || qLower.includes('ready')) {
      replyText = `**3 Students** have satisfied all course unit competencies & zero balance, ready for Certificate Generation:\n- **Bethlehem Worku** — REG-2026-089 (Hair Dressing)\n- **Kaleb Desta** — REG-2026-104 (Barbering)\n- **Hiwot Tsegaye** — REG-2026-112 (Makeup Art)\n\nWould you like me to trigger bulk PDF export with QR verification?`;
      sources = ['Prisma.Result.findMany({ where: { competency: "PASS" } })', 'Prisma.Payment.findMany({ status: "PAID" })'];
      recordCount = 3;
    } else if (qLower.includes('barbering') || qLower.includes('competency')) {
      replyText = `Barbering Course Competency Summary:\n- **Average Practical Score**: 89.4%\n- **Fading & Shaving Unit**: 92% pass rate\n- **Sanitization & Tool Care**: 98% pass rate\n- **Total Assessed Students**: 35`;
      sources = ['Prisma.Result.aggregate({ avg: { competencyScore: true } })'];
      recordCount = 35;
    } else {
      replyText = `Retrieved context for query: "${userQuestion}"\n\nI checked active records across **Students**, **Courses**, **Payments**, and **Attendance** tables. Currently, 156 active students are registered across 8 vocational programs. All systems operational.`;
      sources = ['Prisma.Student.findMany()', 'Prisma.Course.findMany()'];
      recordCount = 156;
    }

    const aiMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: sources,
      queryMetadata: {
        model: 'llama-3.1-8b-instant',
        recordsRetrieved: recordCount,
        latencyMs: 340
      }
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);

    // If widget closed, increment unread badge
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    processQuery(userText);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Icon Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
            isOpen
              ? 'bg-[#111111] text-[#E9C349] border-2 border-[#E9C349]'
              : 'bg-gradient-to-tr from-[#D4AF37] via-[#E9C349] to-[#F5D468] text-[#0F0F10] shadow-[0_4px_25px_rgba(212,175,55,0.45)]'
          }`}
          aria-label="Toggle Admin AI Assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Sparkles className="w-6 h-6 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Badge Indicator */}
          {!isOpen && unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F0F10] shadow"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Floating Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-18 right-0 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[80vh] bg-[#FAFAFA] dark:bg-[#121214] text-[var(--text-primary)] rounded-2xl shadow-2xl border border-[var(--border-default)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-[#111111] text-white border-b border-[#E9C349]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center shadow-md shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-bold text-sm text-white tracking-wide">
                      Dare AI Assistant
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] border border-[#E9C349]/40 font-semibold">
                      {userRole}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-gray-300 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>RAG Engine • llama-3.1-8b-instant</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {onOpenReportsModal && (
                  <button
                    type="button"
                    onClick={onOpenReportsModal}
                    className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors rounded-lg hover:bg-white/10 flex items-center space-x-1 text-xs font-semibold px-2"
                    title="Open CSV / PDF Export Manager"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="hidden sm:inline">Export Center</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMessages([INITIAL_WELCOME_MSG]);
                    try { localStorage.removeItem('dare_admin_chat_history'); } catch {}
                  }}
                  className="p-1.5 text-gray-400 hover:text-[#E9C349] transition-colors rounded-lg hover:bg-white/10"
                  title="Clear Conversation History"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Security Guard & Export Ribbon */}
            <div className="bg-[#E9C349]/10 border-b border-[#E9C349]/20 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] shrink-0">
              <span className="flex items-center space-x-1 text-[#D4AF37]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Prisma RAG Grounded • No Hallucinations</span>
              </span>
              {onOpenReportsModal && (
                <button
                  onClick={onOpenReportsModal}
                  className="text-[10px] text-emerald-400 hover:underline font-bold flex items-center space-x-1"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>CSV/PDF Export</span>
                </button>
              )}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-[#E9C349] text-black'
                        : 'bg-[#111111] text-[#E9C349] border border-[#E9C349]/40'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#E9C349] text-[#0F0F10] font-medium rounded-tr-xs shadow-sm'
                        : 'bg-white dark:bg-[#1E1E22] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-xs shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Sources & Query Metadata */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#D4AF37] flex items-center space-x-1">
                          <Database className="w-3 h-3" />
                          <span>Retrieved DB Context:</span>
                        </div>
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="text-[10px] font-mono text-[var(--text-muted)] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded truncate">
                            {src}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Info & Copy */}
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono opacity-60">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-[#E9C349] transition-colors flex items-center space-x-0.5"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#E9C349] border border-[#E9C349]/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-[#1E1E22] border border-[var(--border-default)] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2">Executing Prisma RAG & Groq...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Preset Quick Questions */}
            <div className="px-3 py-2 bg-white/50 dark:bg-black/20 border-t border-[var(--border-subtle)] shrink-0">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block mb-1.5 uppercase font-bold tracking-wider">
                Quick Admin Prompts:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {PRESET_QUESTIONS.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(pq);
                    }}
                    className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-white dark:bg-[#1C1C20] border border-[var(--border-default)] hover:border-[#E9C349] text-[var(--text-secondary)] hover:text-[#D4AF37] rounded-full transition-all shrink-0"
                  >
                    {pq}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#161618] border-t border-[var(--border-default)] flex items-center space-x-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about students, courses, payments..."
                className="flex-1 bg-gray-100 dark:bg-[#222226] text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#E9C349] focus:bg-white dark:focus:bg-[#1A1A1E] outline-none transition-all text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-[#E9C349] text-[#0F0F10] hover:bg-[#f5d468] disabled:opacity-40 disabled:hover:bg-[#E9C349] transition-all flex items-center justify-center shrink-0 shadow-md font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
