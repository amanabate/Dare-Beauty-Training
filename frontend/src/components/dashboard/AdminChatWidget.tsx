'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AdminChatWidgetProps {
  userRole?: 'Admin' | 'Instructor' | 'Student' | 'guest';
}

const PRESET_QUESTIONS = [
  'What programs does Dare Institute offer?',
  'How long is the Hair Dressing course?',
  'What are the admission requirements?',
  'What is the minimum attendance for COC?',
  'Are payment installments available?',
];

export const AdminChatWidget: React.FC<AdminChatWidgetProps> = ({ userRole = 'guest' }) => {
  const [isOpen, setIsOpen]     = useState(false);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const welcomeMsg: Message = {
    id: 'welcome-1',
    sender: 'assistant',
    text: `Hi! I'm the Dare Institute AI Assistant.\n\nAsk me anything about our programs, admissions, fees, attendance, or certificates.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref to cancel any in-progress typing animation when a new message arrives
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // Persist chat history per session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dare_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('dare_chat_history', JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [isOpen, messages]);

  const processQuery = async (question: string) => {
    // Cancel any previous typing animation still running
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setIsLoading(true);

    const history = messages
      .filter(m => m.id !== 'welcome-1')
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history, role: userRole }),
      });
      const data = await res.json();

      setIsLoading(false);

      const fullText: string = res.ok
        ? (data.reply ?? '')
        : `⚠️ ${data?.error ?? `Request failed (${res.status})`}`;

      // Insert blank message then type into it character by character
      const sid = `ai-${Date.now()}`;
      setStreamingId(sid);
      setMessages(prev => [...prev, {
        id: sid,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

      // Reveal ~3 characters per tick at ~18ms — smooth and fast like ChatGPT
      let index = 0;
      const CHUNK = 2;
      const DELAY = 30;

      typingTimerRef.current = setInterval(() => {
        index += CHUNK;
        const visible = fullText.slice(0, index);

        setMessages(prev => prev.map(m =>
          m.id === sid ? { ...m, text: visible } : m
        ));

        // Auto-scroll while typing
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        if (index >= fullText.length) {
          clearInterval(typingTimerRef.current!);
          typingTimerRef.current = null;
          setStreamingId(null);
          if (!isOpen) setUnreadCount(n => n + 1);
        }
      }, DELAY);
    } catch {
      setIsLoading(false);
      setStreamingId(null);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ Could not reach the AI service. Make sure the backend is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setMessages(prev => [...prev, {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    processQuery(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([welcomeMsg]);
    try { localStorage.removeItem('dare_chat_history'); } catch { /* ignore */ }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">

      {/* ── Floating trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open Dare AI Assistant"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
          isOpen
            ? 'bg-[#111] text-[#E9C349] border-2 border-[#E9C349]'
            : 'bg-gradient-to-tr from-[#D4AF37] via-[#E9C349] to-[#F5D468] text-black shadow-[0_4px_25px_rgba(212,175,55,0.5)]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="sp" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Sparkles className="w-6 h-6 fill-current" /></motion.div>
          }
        </AnimatePresence>

        {!isOpen && unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.93 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 18, scale: 0.93 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute bottom-[72px] right-0 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)]"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[var(--bg-base)] border-b border-[#E9C349]/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/images/dareLogo.jpeg"
                  alt="Dare Institute Logo"
                  className="w-8 h-8 rounded-full object-cover border border-[#E9C349]/40 shadow shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold font-serif text-white leading-tight">Dare AI Assistant</h3>
                  <p className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleClear} title="Clear chat"
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#E9C349] hover:bg-white/10 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close"
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-[#E9C349] text-black'
                      : 'bg-[var(--bg-panel)] text-[#E9C349] border border-[#E9C349]/30'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`group max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#E9C349] text-black font-medium rounded-br-sm'
                      : 'bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-bl-sm'
                  }`}>
                    <p className="whitespace-pre-line">
                      {msg.text}
                      {/* Blinking cursor while this message is being streamed */}
                      {msg.id === streamingId && msg.text !== '' && (
                        <span className="inline-block w-0.5 h-3.5 bg-[var(--text-primary)] ml-0.5 opacity-80 animate-pulse align-text-bottom" />
                      )}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[9px] opacity-50">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'assistant' && (
                        <button onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-0.5 hover:opacity-100 transition-opacity">
                          {copiedId === msg.id
                            ? <><Check className="w-2.5 h-2.5 text-emerald-500" /><span>Copied</span></>
                            : <><Copy className="w-2.5 h-2.5" /><span>Copy</span></>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator — shown only while waiting for first token */}
              {streamingId && messages.find(m => m.id === streamingId)?.text === '' && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[var(--bg-panel)] border border-[#E9C349]/30 text-[#E9C349] flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349] animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset prompts */}
            <div className="px-3 pt-2 pb-1.5 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {PRESET_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => setInput(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[#E9C349]/50 hover:text-[#D4AF37] transition-all shrink-0">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSend}
              className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about programs, fees, admissions…"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none transition-all"
              />
              <button type="submit" disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-[#E9C349] text-black hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center shrink-0 shadow">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
