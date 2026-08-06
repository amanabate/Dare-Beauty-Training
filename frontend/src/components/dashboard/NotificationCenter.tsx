'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  UserPlus, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  Filter, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { AppNotification, NotificationType, Language } from '../../types';

interface NotificationCenterProps {
  currentLang?: Language;
  onOpenReportsModal?: () => void;
  onOpenApply?: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-101',
    title: 'New Student Application',
    message: 'Hawi Girma submitted an application for Professional Hair Dressing & Styling (3 Months duration).',
    type: 'application',
    priority: 'high',
    timestamp: '5 mins ago',
    isRead: false
  },
  {
    id: 'notif-102',
    title: 'New Inquiry Received',
    message: 'Kaleb Tadesse asked: "Do you offer weekend shifts for Barbering & Men\'s Grooming?"',
    type: 'inquiry',
    priority: 'medium',
    timestamp: '28 mins ago',
    isRead: false
  },
  {
    id: 'notif-103',
    title: 'Tuition Fee Payment Verified',
    message: 'Abebe Kebede completed 6,000 ETB installment payment via Telebirr (Receipt REC-88401).',
    type: 'payment',
    priority: 'medium',
    timestamp: '1 hour ago',
    isRead: true
  },
  {
    id: 'notif-104',
    title: 'Prisma DB Auto-Backup Successful',
    message: 'System database snapshot backup completed with 100% record integrity verification.',
    type: 'system',
    priority: 'low',
    timestamp: '3 hours ago',
    isRead: true
  },
  {
    id: 'notif-105',
    title: 'New Student Application',
    message: 'Birtukan Mamo submitted an application for Makeup Artistry & Beauty Therapy.',
    type: 'application',
    priority: 'high',
    timestamp: '5 hours ago',
    isRead: false
  }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentLang = 'en',
  onOpenReportsModal,
  onOpenApply
}) => {
  // Start with default notifications; hydrate from localStorage after mount
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dare_notifications_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setNotifications(parsed);
      }
    } catch {}
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'application' | 'inquiry' | 'system'>('all');
  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dare_notifications_v1', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Derived unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filtered notifications list
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'application') return n.type === 'application';
    if (activeTab === 'inquiry') return n.type === 'inquiry';
    if (activeTab === 'system') return n.type === 'system' || n.type === 'payment';
    return true;
  });

  // Action handlers
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate incoming real-time notification
  const handleSimulateAlert = () => {
    const sampleNames = ['Sileshi Bekele', 'Aster Awoke', 'Yared Worku', 'Tigist Zewde', 'Dawit Desta'];
    const sampleCourses = ['Barbering & Grooming', 'Makeup Artistry', 'Nail Tech', 'Hair Dressing'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCourse = sampleCourses[Math.floor(Math.random() * sampleCourses.length)];

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Student Application Received',
      message: `${randomName} just applied online for ${randomCourse}. Review application details in Admin Center.`,
      type: 'application',
      priority: 'high',
      timestamp: 'Just now',
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setToastNotification(newNotif);

    // Auto dismiss toast after 6s
    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'application':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-[#D4AF37]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-amber-500" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative inline-block font-sans">
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#111111] dark:bg-[#1A1A1E] text-gray-300 hover:text-[#E9C349] border border-[#E9C349]/30 hover:border-[#E9C349] transition-all shadow-sm focus:outline-none"
        title="Notifications Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold text-[9px] leading-none shadow-md flex items-center justify-center min-w-[16px]"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Popover / Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing dropdown */}
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#FAFAFA] dark:bg-[#161619] border border-[#E9C349]/40 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[520px]"
            >
              {/* Header */}
              <div className="bg-[#111111] p-4 text-white border-b border-[#E9C349]/30 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#E9C349]/20 text-[#E9C349]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E9C349] text-black font-mono text-[10px] font-bold">
                          {unreadCount} unread
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleSimulateAlert}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E9C349] text-[10px] font-mono flex items-center space-x-1 transition-all"
                    title="Simulate incoming alert"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden sm:inline">Simulate Alert</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs Bar */}
              <div className="bg-[#161619] px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between text-[11px] shrink-0 overflow-x-auto gap-1">
                <div className="flex items-center space-x-1">
                  {(['all', 'unread', 'application', 'inquiry', 'system'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all capitalize ${
                        activeTab === tab
                          ? 'bg-[#E9C349] text-black font-bold'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-[#D4AF37] hover:underline font-mono shrink-0 flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Read all</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)] p-2 space-y-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto text-[#E9C349]/50" />
                    <p>No notifications found in this view.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-2xl transition-all relative group flex items-start space-x-3 ${
                        notif.isRead 
                          ? 'bg-transparent opacity-80' 
                          : 'bg-[#E9C349]/5 dark:bg-[#E9C349]/10 border border-[#E9C349]/20'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 shrink-0 mt-0.5">
                        {getTypeIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className={`text-xs font-bold truncate ${notif.isRead ? 'text-[var(--text-primary)]' : 'text-[#D4AF37]'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 flex items-center space-x-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{notif.timestamp}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>

                      {/* Quick item actions */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-black/60 backdrop-blur-md p-1 rounded-lg text-white">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-1 hover:text-[#E9C349]"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="bg-[#111111] p-3 px-4 border-t border-[#E9C349]/30 flex items-center justify-between text-xs text-gray-400 shrink-0">
                <button
                  onClick={clearAll}
                  className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                >
                  Clear all history
                </button>

                {onOpenReportsModal && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenReportsModal();
                    }}
                    className="text-[10px] text-[#E9C349] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>View Export Center</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification Popup */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 max-w-sm w-full bg-[#111111] text-white border-2 border-[#E9C349] rounded-2xl p-4 shadow-2xl flex items-start space-x-3 font-sans"
          >
            <div className="p-2 rounded-xl bg-[#E9C349]/20 text-[#E9C349] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#E9C349] uppercase tracking-wider">
                  {toastNotification.title}
                </h4>
                <button
                  onClick={() => setToastNotification(null)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-snug">
                {toastNotification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
