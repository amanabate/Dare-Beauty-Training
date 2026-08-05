'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { instituteInfo } from '../data/instituteData';
import { Language } from '../types';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48 6.31 6.31 0 0 0 1.86-4.47V9.03a8.16 8.16 0 0 0 4.87 1.6V7.17a4.85 4.85 0 0 1-1-.48z"/>
  </svg>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay-modal-bg)] backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-8 transition-colors duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--text-secondary)] hover:text-[#E9C349] focus:outline-none transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
              {currentLang === 'en' ? 'Contact & Campus Visit' : currentLang === 'am' ? 'አድራሻ እና የካምፓስ ጉብኝት' : 'Teessoo fi Daawwannoo Mooraa'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mb-6 font-sans">
              {currentLang === 'en' 
                ? 'Send an inquiry or call our admission advisors directly.'
                : currentLang === 'am'
                ? 'ጥያቄዎትን ይላኩ ወይም በቀጥታ በስልክ ያናግሩን።'
                : 'Gaaffii keessan ergaa ykn kallattiin bilbilaan nu quunnamaa.'}
            </p>

            {/* Quick Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <a
                href={`tel:${instituteInfo.phonePrimary}`}
                className="p-3 bg-white/5 border border-[var(--border-default)] hover:border-[#E9C349] rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <Phone className="w-5 h-5 text-[#E9C349] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold block">
                    {currentLang === 'en' ? 'Hotline' : currentLang === 'am' ? 'የአድሚሽን ስልክ' : 'Bilbila Galmee'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] block truncate">{instituteInfo.phonePrimary}</span>
                </div>
              </a>

              <a
                href="https://maps.google.com/maps?q=Tsara+Tsion,+Burayu,+Sheger+City,+Oromia,+Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 border border-[var(--border-default)] hover:border-[#E9C349] rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-[#E9C349] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold block">
                    {currentLang === 'en' ? 'Campus Location' : currentLang === 'am' ? 'የካምፓስ አድራሻ' : 'Teessoo Mooraa'}
                  </span>
                  <span className="text-xs font-sans font-bold text-[var(--text-primary)] block truncate">
                    {currentLang === 'en' ? instituteInfo.locationEn : currentLang === 'am' ? instituteInfo.locationAmharic : instituteInfo.locationOromo}
                  </span>
                </div>
              </a>

              <a
                href={instituteInfo.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 border border-[var(--border-default)] hover:border-[#E9C349] rounded-xl flex items-center space-x-3 transition-colors group"
              >
                <TikTokIcon className="w-5 h-5 text-[#E9C349] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold block">
                    TikTok Official
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] block truncate">@dere295</span>
                </div>
              </a>
            </div>

            {/* Embedded Map Preview in Modal */}
            <div className="mb-6 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-inner">
              <iframe
                title="Dare Institute Campus Location Map"
                src="https://maps.google.com/maps?q=Tsara%20Tsion%2C%20Burayu%2C%20Sheger%20City%2C%20Oromia%2C%20Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  {currentLang === 'en' ? 'Your Name *' : currentLang === 'am' ? 'ስምዎት *' : 'Maqaa Keessan *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bethlehem Kebede"
                  className="w-full px-4 py-2.5 bg-[var(--bg-glass)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] rounded-xl focus:border-[#E9C349]/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                    {currentLang === 'en' ? 'Phone Number *' : currentLang === 'am' ? 'ስልክ ቁጥር *' : 'Lakkoofsa Bilbilaa *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0911234567"
                    className="w-full px-4 py-2.5 bg-[var(--bg-glass)] border border-[var(--border-default)] text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-faint)] rounded-xl focus:border-[#E9C349]/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                    {currentLang === 'en' ? 'Email Address' : currentLang === 'am' ? 'ኢሜይል' : 'Teessoo Imeelii'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2.5 bg-[var(--bg-glass)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] rounded-xl focus:border-[#E9C349]/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  {currentLang === 'en' ? 'Message / Question' : currentLang === 'am' ? 'መልዕክት ወይም ጥያቄ' : 'Ergaa ykn Gaaffii'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask about course dates, tuition, campus tours..."
                  className="w-full px-4 py-2.5 bg-[var(--bg-glass)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] rounded-xl focus:border-[#E9C349]/50 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="px-8 py-3 bg-[#E9C349] text-[#0F0F10] text-xs font-sans font-bold uppercase tracking-wider rounded-xl hover:bg-[#f5d468] transition-colors shadow-[0_0_24px_rgba(233,195,73,0.35)] flex items-center space-x-2 touch-target"
                >
                  <Send className="w-3.5 h-3.5 text-[#0F0F10]" />
                  <span>{currentLang === 'en' ? 'Send Message' : currentLang === 'am' ? 'መልዕክቱን ላክ' : 'Ergaa Ergaa'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#E9C349] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              {currentLang === 'en' ? 'Thank You for Contacting Us!' : currentLang === 'am' ? 'መልዕክትዎ ደርሶናል!' : 'Galatoomaa Nu Quunnamsiisuu Keessaniif!'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-sans">
              {currentLang === 'en'
                ? 'Our team at Dare Institute will review your message and reply via phone or email shortly.'
                : currentLang === 'am'
                ? 'የደሬ ኢንስቲትዩት የደንበኞች አገልግሎት በቅርቡ በስልክ ወይም በኢሜይል ያናግርዎታል።'
                : 'Gareen Dare Institute ergaa keessan ilaalee bilbilaan ykn imeeliin dhiheenyatti isin quunnama.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="px-8 py-3 bg-[#E9C349] text-[#0F0F10] text-xs font-sans font-bold uppercase tracking-wider rounded-xl hover:bg-[#f5d468] transition-colors touch-target"
            >
              {currentLang === 'en' ? 'Close' : currentLang === 'am' ? 'ዝጋ' : 'Cufi'}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
