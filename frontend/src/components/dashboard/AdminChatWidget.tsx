'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Copy, Check } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AdminChatWidgetProps {
  userRole?: 'Admin' | 'Instructor' | 'Student' | 'guest';
}

// ─────────────────────────────────────────────────────────────────────────────
// Language detection
// 'am' = Amharic (Ethiopic script)  'om' = Afaan Oromo  'en' = English (default)
// ─────────────────────────────────────────────────────────────────────────────
type Lang = 'en' | 'om' | 'am';

function detectLang(text: string): Lang {
  // 1. Ethiopic Unicode block → always Amharic
  if (/[\u1200-\u137F]/.test(text)) return 'am';

  // 2. Oromo-specific diacritics (ʼ, x̧, ɗ, etc. uncommon in English)
  if (/[ĉčšžŋ]/i.test(text)) return 'om';

  const lower = text.toLowerCase();

  // 3. Expanded Afaan Oromo word list — covers common conversational phrases,
  //    greetings, question words, and topic words a user would actually type.
  const oromoWords = [
    // greetings & politeness
    'baga','nagaan','dhuftan','akkam','nagaa','gammachuu','galatoomaa',
    'maaloo','ykn','fi','garuu',
    // question words
    'maali','maalii','akkamitti','eessatti','eessa','yoom','yoomi',
    'meeqa','hangam','eenyu','akkam','maaliif',
    // topic words (beauty / training / institute)
    'koorso','koorsoota','leenjii','barnoota','barnootaa',
    'galmee','galmeessuu','galmeeffachuu',
    'argama','argamtu','waraqaa','ragaa',
    'kafaltii','mindaa','beenyaa',
    'heeyyama','eeyyama','guyyaa','ji\'a',
    // common verbs & connectors a user might type
    'qabdu','qabduu','qabna','kennaa','kennituu','kennitu',
    'fudhata','fudhachuu','danda\'a','dandaa\'a','dandeetii',
    'gargaaruu','gargaarsi','barsiisaa','barsiisu',
    'dhufuu','deemuu','jira','jiruu','hin','wajjin',
    'yeroo','guutuu','xumura','xumuruu','itti',
    // numbers / duration words
    'sadii','jaha','torba','saddeet','sagal','kudhan',
    'ji\'a','torban','guyyaa',
  ];

  if (oromoWords.some(w => lower.includes(w))) return 'om';
  return 'en';
}

// ─────────────────────────────────────────────────────────────────────────────
// Static content — all three languages
// ─────────────────────────────────────────────────────────────────────────────
const WELCOME: Record<Lang, string> = {
  en: `Hello! 👋 Welcome to Dare Beauty Training Institute.\n\nI'm your AI assistant. Ask me anything about our programs, admissions, attendance, certificates, or contact information.`,
  om: `Baga nagaan dhuftan! 👋 Dare Beauty Training Institute.\n\nAni gargaaraa AI keessan. Koorsoota, galmee, argama, waraqaa ragaa, ykn qunnamtii ilaalchisee gaaffii kamiiyyuu na gaafadhaa.`,
  am: `እንኳን ወደ Dare Beauty Training Institute በደህና መጡ! 👋\n\nእኔ የ AI ረዳትዎ ነኝ። ስለ ስልጠናዎቻችን፣ ምዝገባ፣ መገኘት፣ ሰርተፊኬት ወይም የመገናኛ መረጃ ማንኛውንም ጥያቄ ይጠይቁኝ።`,
};

const PRESETS: Record<Lang, string[]> = {
  en: [
    'What programs do you offer?',
    'How long is the training?',
    'How can I register?',
    'Where are you located?',
    'Do you provide certificates?',
  ],
  om: [
    'Koorsoota maalii qabdu?',
    'Leenjiin yeroo meeqa fudhata?',
    "Akkamitti galmaa'uu danda'a?",
    'Eessatti argamtu?',
    'Waraqaa ragaa kennituu?',
  ],
  am: [
    'ምን አይነት ስልጠና አላችሁ?',
    'ስልጠናው ምን ያህል ጊዜ ይወስዳል?',
    'እንዴት መመዝገብ እችላለሁ?',
    'የት ነዎት የሚገኙት?',
    'ሰርተፊኬት ይሰጣሉ?',
  ],
};

const PLACEHOLDER: Record<Lang, string> = {
  en: 'Ask about programs, admissions, location…',
  om: 'Koorsoota, galmee, ykn argama gaafadhu…',
  am: 'ስለ ስልጠና፣ ምዝገባ ወይም አድራሻ ይጠይቁ…',
};

// Friendly error messages — shown instead of raw API errors
const ERROR_MSG: Record<Lang, string> = {
  en: 'Sorry, I\'m having trouble responding right now. Please try again.',
  om: 'Yeroo ammaa deebii kennuu irratti rakkoon uumameera. Maaloo irra deebi\'aa yaalaa.',
  am: 'ይቅርታ፣ አሁን ምላሽ ለመስጠት ችግር አጋጥሞናል። እባክዎ እንደገና ይሞክሩ።',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — make a welcome Message object
// ─────────────────────────────────────────────────────────────────────────────
function makeWelcome(lang: Lang): Message {
  return {
    id: 'welcome-1',
    sender: 'assistant',
    text: WELCOME[lang],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export const AdminChatWidget: React.FC<AdminChatWidgetProps> = ({ userRole = 'guest' }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [input,       setInput]       = useState('');
  const [isStreaming, setIsStreaming] = useState(false);   // true while SSE stream is open
  const [streamingId, setStreamingId] = useState<string | null>(null); // id of bubble being written
  const [unreadCount, setUnreadCount] = useState(1);
  const [copiedId,    setCopiedId]    = useState<string | null>(null);
  const [activeLang,  setActiveLang]  = useState<Lang>('en');

  const [messages, setMessages] = useState<Message[]>([makeWelcome('en')]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const abortRef       = useRef<AbortController | null>(null); // lets us cancel in-flight stream
  // Token queue — filled by the SSE reader, drained at typing speed by an interval
  const tokenQueueRef  = useRef<string[]>([]);
  const typeTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Typing speed constants ──────────────────────────────────────────────
  const TYPING_DELAY = 18; // ms between each character reveal — adjust to taste

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => () => {
    abortRef.current?.abort();
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
  }, []);

  // ── Restore persisted history ───────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dare_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // ── Persist history on change ───────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('dare_chat_history', JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  // ── Open: clear badge, focus input, scroll to bottom ───────────────────
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // ── Auto-scroll whenever messages change ───────────────────────────────
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);


  // ── Core: real Groq SSE stream + controlled typing speed ─────────────────
  const processQuery = useCallback(async (question: string) => {
    const lang = detectLang(question);
    setActiveLang(lang);

    // Cancel any previous in-flight stream and typing timer
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    if (typeTimerRef.current) { clearInterval(typeTimerRef.current); typeTimerRef.current = null; }
    tokenQueueRef.current = [];

    setIsStreaming(true);

    const history = messages
      .filter(m => m.id !== 'welcome-1')
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    // Empty bubble → shows bouncing dots immediately
    const sid = `ai-${Date.now()}`;
    setStreamingId(sid);
    setMessages(prev => [...prev, { id: sid, sender: 'assistant', text: '', timestamp: now() }]);

    // ── Typing drain: reveal one character from the queue every TYPING_DELAY ms
    // streamDone flag lets the timer know when to stop after the queue empties
    let streamDone = false;

    typeTimerRef.current = setInterval(() => {
      const ch = tokenQueueRef.current.shift();
      if (ch !== undefined) {
        setMessages(prev => prev.map(m =>
          m.id === sid ? { ...m, text: m.text + ch } : m
        ));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (streamDone) {
        // Queue empty and stream finished — we're done
        clearInterval(typeTimerRef.current!);
        typeTimerRef.current = null;
        setIsStreaming(false);
        setStreamingId(null);
        if (!isOpen) setUnreadCount(n => n + 1);
      }
    }, TYPING_DELAY);

    try {
      const res = await fetch('/api/chat/stream', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ message: question, history, role: userRole, lang }),
        signal : abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        let errMsg = ERROR_MSG[lang];
        try { const d = await res.json(); if (d?.error) errMsg = d.error; } catch { /* ignore */ }
        // Stop timer, show error immediately
        clearInterval(typeTimerRef.current!); typeTimerRef.current = null;
        tokenQueueRef.current = [];
        setMessages(prev => prev.map(m => m.id === sid ? { ...m, text: `⚠️ ${errMsg}` } : m));
        setIsStreaming(false); setStreamingId(null);
        return;
      }

      // Read SSE stream — push every character of every token into the queue.
      // The typing timer above drains it at a controlled pace.
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';
      let   hasError = false;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (raw === '[DONE]') break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              // Push error message into queue so it types in naturally too
              clearInterval(typeTimerRef.current!); typeTimerRef.current = null;
              tokenQueueRef.current = [];
              setMessages(prev => prev.map(m =>
                m.id === sid ? { ...m, text: `⚠️ ${ERROR_MSG[lang]}` } : m
              ));
              setIsStreaming(false); setStreamingId(null);
              hasError = true;
              break;
            }
            if (parsed.token) {
              // Split token into individual characters and enqueue each one
              for (const ch of parsed.token) {
                tokenQueueRef.current.push(ch);
              }
            }
          } catch { /* malformed chunk — skip */ }
        }
        if (hasError) break;
      }

      // Signal the drain timer that no more characters are coming
      if (!hasError) streamDone = true;

    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        clearInterval(typeTimerRef.current!); typeTimerRef.current = null;
        return;
      }
      clearInterval(typeTimerRef.current!); typeTimerRef.current = null;
      tokenQueueRef.current = [];
      setMessages(prev => prev.map(m =>
        m.id === sid ? { ...m, text: `⚠️ ${ERROR_MSG[lang]}` } : m
      ));
      setIsStreaming(false); setStreamingId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, userRole, isOpen]);


  // ── Send handler ────────────────────────────────────────────────────────
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    // Add user bubble
    setMessages(prev => [...prev, {
      id: `usr-${Date.now()}`, sender: 'user', text, timestamp: now(),
    }]);
    setInput('');
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    processQuery(text);
  };

  // Enter → send  |  Shift+Enter → newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Preset chip: send directly without touching the input field
  const handlePreset = (q: string) => {
    if (isStreaming) return;
    setMessages(prev => [...prev, {
      id: `usr-${Date.now()}`, sender: 'user', text: q, timestamp: now(),
    }]);
    processQuery(q);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    abortRef.current?.abort();
    if (typeTimerRef.current) { clearInterval(typeTimerRef.current); typeTimerRef.current = null; }
    tokenQueueRef.current = [];
    setIsStreaming(false);
    setStreamingId(null);
    setActiveLang('en');
    setMessages([makeWelcome('en')]);
    try { localStorage.removeItem('dare_chat_history'); } catch { /* ignore */ }
  };

  // ── Derived ─────────────────────────────────────────────────────────────
  const presets     = PRESETS[activeLang];
  const placeholder = PLACEHOLDER[activeLang];
  const isBusy      = isStreaming;
  // The streaming bubble has text only once tokens arrive; before that dots show
  const streamingBubbleEmpty = streamingId
    ? (messages.find(m => m.id === streamingId)?.text ?? '') === ''
    : false;


  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">

      {/* ── FAB trigger button ── */}
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
            ? <motion.div key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:  90, opacity: 0 }} transition={{ duration: 0.18 }}><X className="w-6 h-6" /></motion.div>
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
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{   opacity: 0, y: 20, scale: 0.92  }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="absolute bottom-[72px] right-0 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)]"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[var(--bg-base)] border-b border-[#E9C349]/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/images/dareLogo.jpeg"
                  alt="Dare Institute Logo"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#E9C349]/50 shadow shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold font-serif leading-tight" style={{ color: 'var(--text-primary)' }}>
                    Dare AI Assistant
                  </h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                    {isBusy
                      ? <><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />Typing…</>
                      : <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Online</>
                    }
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
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scroll-smooth">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#E9C349] text-black'
                      : 'bg-[var(--bg-panel)] text-[#E9C349] border border-[#E9C349]/30'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`group relative max-w-[82%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#E9C349] text-black font-medium rounded-br-sm'
                      : 'bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-bl-sm'
                  }`}>
                    <p className="whitespace-pre-line break-words">
                      {msg.text}
                      {/* Blinking cursor on the active streaming bubble */}
                      {msg.id === streamingId && !streamingBubbleEmpty && (
                        <span className="inline-block w-[2px] h-[14px] bg-current ml-0.5 opacity-70 animate-pulse align-text-bottom rounded-full" />
                      )}
                    </p>

                    {/* Timestamp + copy */}
                    <div className="mt-2 flex items-center justify-between gap-2 text-[10px] opacity-40 group-hover:opacity-70 transition-opacity">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'assistant' && msg.text && !msg.text.startsWith('⚠️') && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:opacity-100 transition-opacity"
                        >
                          {copiedId === msg.id
                            ? <><Check className="w-3 h-3 text-emerald-500" /><span>Copied</span></>
                            : <><Copy className="w-3 h-3" /><span>Copy</span></>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Bouncing dots — only while waiting for the first token */}
              {streamingBubbleEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-xl bg-[var(--bg-panel)] border border-[#E9C349]/30 text-[#E9C349] flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                    {[0, 120, 240].map(delay => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-[#E9C349] animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>


            {/* ── Preset chips — language-aware, hidden once conversation starts ── */}
            {messages.length <= 1 && (
              <div className="px-3 pt-1.5 pb-2 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
                <p className="text-[10px] text-[var(--text-muted)] mb-1.5 px-0.5">Suggested questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handlePreset(q)}
                      disabled={isBusy}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[#E9C349]/60 hover:text-[#D4AF37] hover:bg-[#E9C349]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Scrollable quick-access chips during conversation ── */}
            {messages.length > 1 && (
              <div className="px-3 pt-2 pb-1.5 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] shrink-0">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {presets.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handlePreset(q)}
                      disabled={isBusy}
                      className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--bg-panel)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[#E9C349]/60 hover:text-[#D4AF37] hover:bg-[#E9C349]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input area ── */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-end gap-2 shrink-0"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isBusy}
                className="flex-1 resize-none text-[13px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] focus:ring-1 focus:ring-[#E9C349]/30 text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none transition-all leading-relaxed disabled:opacity-50"
                style={{ minHeight: '40px', maxHeight: '100px', overflowY: 'auto' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#E9C349] text-black hover:brightness-110 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 shadow-md"
              >
                {isBusy
                  ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
