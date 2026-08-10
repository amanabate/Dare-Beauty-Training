'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, UserCheck, X, Sparkles, Database } from 'lucide-react';

export interface AttendanceSuccessModalProps {
  open: boolean;
  onClose: () => void;
  dateStr?: string;
  totalStudents?: number;
  presentCount?: number;
  lateCount?: number;
  absentCount?: number;
  excusedCount?: number;
  sessionName?: string;
  currentLang?: string;
}

const T_MODAL: Record<string, {
  title: string;
  subtitle: string;
  syncedBadge: string;
  total: string;
  present: string;
  late: string;
  absent: string;
  excused: string;
  done: string;
  summaryTitle: string;
}> = {
  en: {
    title: 'Attendance Submitted!',
    subtitle: 'Roll call record has been logged and synchronized with the Registrar database.',
    syncedBadge: 'Synced with Registrar Database',
    total: 'Total',
    present: 'Present',
    late: 'Late',
    absent: 'Absent',
    excused: 'Excused',
    done: 'Done & Close',
    summaryTitle: 'Session Summary',
  },
  am: {
    title: 'የተማሪዎች አቴንዳንስ በስኬት ተልኳል!',
    subtitle: 'የዛሬው የክፍል አቴንዳንስ ተመዝግቦ ወደ ሬጅስትራር ዳታቤዝ ተልኳል።',
    syncedBadge: 'ከሬጅስትራር ዳታቤዝ ጋር ተገናኝቷል',
    total: 'ጠቅላላ',
    present: 'የተገኙ',
    late: 'የዘገዩ',
    absent: 'የቀሩ',
    excused: 'በፈቃድ',
    done: 'ጨርስ & ዝጋ',
    summaryTitle: 'የክፍለ ጊዜው ማጠቃለያ',
  },
  om: {
    title: 'Hirmaannaan Ergameera!',
    subtitle: 'Galmeen hirmaannaa har\'aa qabamee gara kuusaa deetaa Registrar tti ergameera.',
    syncedBadge: 'Gara Registrar tti isinkroonii ta\'eera',
    total: 'Ida\'ama',
    present: 'Kan Argaaman',
    late: 'Kan Turan',
    absent: 'Kan Hafan',
    excused: 'Eeyyamaan',
    done: 'Xumuri & Cuf',
    summaryTitle: 'Cuunfaa Seshiinii',
  },
};

export const AttendanceSuccessModal: React.FC<AttendanceSuccessModalProps> = ({
  open,
  onClose,
  dateStr = new Date().toDateString(),
  totalStudents = 0,
  presentCount = 0,
  lateCount = 0,
  absentCount = 0,
  excusedCount = 0,
  sessionName = 'Practical Lab Attendance',
  currentLang = 'en',
}) => {
  const t = T_MODAL[currentLang] || T_MODAL.en;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="attendance-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            key="attendance-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-2xl overflow-hidden relative">

              {/* Glowing Background Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-7 space-y-6 relative z-0">
                {/* Header Icon & Title */}
                <div className="text-center space-y-3 pt-2">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E9C349] text-black flex items-center justify-center shadow-md">
                      <Sparkles className="w-3.5 h-3.5 fill-black" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-[var(--text-primary)] text-xl sm:text-2xl tracking-tight">
                      {t.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-xs mx-auto">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {/* Database Sync Status Badge */}
                <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit mx-auto">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Database className="w-3.5 h-3.5" />
                  <span>{t.syncedBadge}</span>
                </div>

                {/* Session & Date Header */}
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[var(--border-subtle)] pb-2.5">
                    <span className="text-[var(--text-muted)] font-medium">{sessionName}</span>
                    <span className="text-[#E9C349] font-mono font-semibold">{dateStr}</span>
                  </div>

                  {/* Summary Breakdown Grid */}
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      {t.summaryTitle}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-base font-bold text-[var(--text-primary)]">{totalStudents}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium">{t.total}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-base font-bold text-emerald-400">{presentCount}</div>
                        <div className="text-[10px] text-emerald-400/80 font-medium">{t.present}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="text-base font-bold text-amber-400">{lateCount}</div>
                        <div className="text-[10px] text-amber-400/80 font-medium">{t.late}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="text-base font-bold text-red-400">{absentCount + excusedCount}</div>
                        <div className="text-[10px] text-red-400/80 font-medium">{t.absent}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
                >
                  <UserCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{t.done}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
