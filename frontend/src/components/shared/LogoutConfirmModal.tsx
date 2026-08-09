'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onConfirm,
  onCancel,
  userName,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <h3 className="font-serif font-bold text-[var(--text-primary)] text-base">Sign Out</h3>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-1">
                <p className="text-sm text-[var(--text-primary)] font-semibold">
                  Are you sure you want to sign out?
                </p>
                {userName && (
                  <p className="text-xs text-[var(--text-muted)]">
                    Signed in as <span className="font-semibold text-[#E9C349]">{userName}</span>
                  </p>
                )}
                <p className="text-xs text-[var(--text-muted)] pt-1">
                  You will be returned to the home page and will need to sign in again to access your portal.
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
