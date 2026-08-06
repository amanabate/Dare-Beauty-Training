'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { instituteInfo } from '../../data/instituteData';
import { Language } from '../../types';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48 6.31 6.31 0 0 0 1.86-4.47V9.03a8.16 8.16 0 0 0 4.87 1.6V7.17a4.85 4.85 0 0 1-1-.48z"/>
  </svg>
);

interface FooterProps {
  currentLang: Language;
  onOpenApply: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenApply, onOpenContact }) => {
  return (
    <footer id="contact" className="bg-[#111111] dark:bg-[#0B0B0B] text-white pt-20 pb-10 border-t border-[#D4AF37]/30 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-[#D4AF37]/20">
          
          {/* Column 1: Institute Identity */}
          <div className="space-y-4">
            <a href="#home" className="block">
              <span className="font-serif text-2xl font-bold text-[#D4AF37] block">
                Dare Institute
              </span>
              <span className="text-[10px] text-gray-300 tracking-widest uppercase block mt-1">
                {currentLang === 'en' ? instituteInfo.nameEn : currentLang === 'am' ? instituteInfo.nameAmharic : (instituteInfo.nameOromo || instituteInfo.nameEn)}
              </span>
            </a>

            <p className="text-gray-400 leading-relaxed text-xs">
              {currentLang === 'en'
                ? "Premier vocational beauty academy providing certified practical training in Hair Dressing, Barbering, Makeup Art, Nail Technology, Esthetics, Lash Extensions, and Salon Business."
                : currentLang === 'am'
                ? "በፀጉር አሰራር፣ ባርበሪንግ፣ ሜካፕ፣ ጥፍር እና የቆዳ እንክብካቤ ዘርፎች በከፍተኛ ጥራት በስራ ላይ ያተኮረ የሙያ ስልጠና የሚሰጥ ተቋም።"
                : "Dhaabbata leenjii ogummaa miidhaginaa rifeensaa, baarбариንጊ, mikaappii, qoollee fi gogaa ammayyaa."}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={instituteInfo.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-[#D4AF37]/30 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={instituteInfo.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-[#D4AF37]/30 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={instituteInfo.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-[#D4AF37]/30 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={instituteInfo.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#E9C349]/10 border border-[#E9C349] text-[#E9C349] hover:bg-[#E9C349] hover:text-black transition-all flex items-center space-x-1.5 text-xs font-semibold rounded-lg"
                aria-label="TikTok @dere295"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok @dere295</span>
              </a>
              <a
                href={instituteInfo.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 border border-[#D4AF37]/30 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              {currentLang === 'en' ? 'Quick Links' : currentLang === 'am' ? 'ቀጥታ ሊንኮች' : 'Geessituu Gabaabaa'}
            </h4>
            <ul className="space-y-2 text-gray-300 uppercase tracking-wider">
              <li>
                <a href="#home" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'Home' : currentLang === 'am' ? 'ዋና ገፅ' : 'Fuula Duraa'}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'About Us' : currentLang === 'am' ? 'ስለ እኛ' : 'Waa\'ee Keenya'}
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'Training Programs' : currentLang === 'am' ? 'የትምህርት ክፍሎች' : 'Prograamota Leenjii'}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'Campus Gallery' : currentLang === 'am' ? 'ጋለሪ' : 'Gaalarii'}
                </a>
              </li>
              <li>
                <a href="#admissions" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'Admissions' : currentLang === 'am' ? 'ምዝገባ' : 'Galmee'}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D4AF37] transition-colors">
                  {currentLang === 'en' ? 'FAQs' : currentLang === 'am' ? 'ጥያቄዎች' : 'Gaaffilee'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Programs */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              {currentLang === 'en' ? 'Featured Programs' : currentLang === 'am' ? 'የሚሰጡ ኮርሶች' : 'Prograamota'}
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>{currentLang === 'en' ? '• Hair Dressing & Styling' : currentLang === 'am' ? '• የሴቶች ፀጉር አሰራር' : '• Rifeensa Dubartootaa'}</li>
              <li>{currentLang === 'en' ? '• Barbering & Men\'s Grooming' : currentLang === 'am' ? '• የወንዶች ባርበሪንግ' : '• Baarбариንጊ Dhiiraa'}</li>
              <li>{currentLang === 'en' ? '• Professional Makeup Artistry' : currentLang === 'am' ? '• ፕሮፌሽናል ሜካፕ' : '• Mikaappii Ogummaa'}</li>
              <li>{currentLang === 'en' ? '• Nail Tech & Acrylic Extensions' : currentLang === 'am' ? '• የጥፍር አሰራር' : '• Ogummaa Qoollee (Nail)'}</li>
              <li>{currentLang === 'en' ? '• Beauty Therapy & Skincare' : currentLang === 'am' ? '• የፊት ቆዳ እንክብካቤ' : '• Kunuunsa Gogaa'}</li>
              <li>{currentLang === 'en' ? '• Russian Lash & Waxing' : currentLang === 'am' ? '• የዐይን ቆብ ኤክስቴንሽን' : '• Ija fi Waxing'}</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              {currentLang === 'en' ? 'Contact Us' : currentLang === 'am' ? 'አድራሻና ስልክ' : 'Teessoo fi Bilbila'}
            </h4>
            
            <div className="space-y-2.5 text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {currentLang === 'en' ? instituteInfo.locationEn : currentLang === 'am' ? instituteInfo.locationAmharic : (instituteInfo.locationOromo || instituteInfo.locationEn)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${instituteInfo.phonePrimary}`} className="hover:text-[#D4AF37] transition-colors font-bold">
                  {instituteInfo.phonePrimary}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${instituteInfo.email}`} className="hover:text-[#D4AF37] transition-colors">
                  {instituteInfo.email}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{instituteInfo.workingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenContact}
                className="px-4 py-2 bg-[#D4AF37] text-black text-[11px] font-bold uppercase tracking-wider hover:bg-white transition-colors"
              >
                {currentLang === 'en' ? 'Inquire / Visit Campus' : currentLang === 'am' ? 'አድራሻ እና የስልክ መረጃ' : 'Odeeffannoo Teessoo'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} {instituteInfo.nameEn}. All rights reserved.</p>

          <div className="flex space-x-6">
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">
              {currentLang === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ'}
            </a>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">
              {currentLang === 'en' ? 'Terms of Service' : 'የአገልግሎት ውል'}
            </a>
            <a href="#admissions" className="hover:text-[#D4AF37] transition-colors">
              {currentLang === 'en' ? 'Student Portal' : 'የተማሪዎች ገፅ'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
