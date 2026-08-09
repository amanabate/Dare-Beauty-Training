'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Video, Clock, Navigation, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { instituteInfo } from '../../data/instituteData';
import { Language } from '../../types';

interface LocationSectionProps {
  currentLang: Language;
  onOpenApply: () => void;
  onOpenContact: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  currentLang,
  onOpenApply,
  onOpenContact
}) => {
  const mapSearchQuery = encodeURIComponent("Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia");
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="py-24 bg-[#F5EFEA] dark:bg-[#121212] transition-colors duration-300 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#A08000] dark:text-[#D4AF37] text-xs font-semibold uppercase tracking-widest rounded-full">
            <Building2 className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'en'
                ? 'Campus Location'
                : currentLang === 'am'
                ? 'የካምፓሳችን አድራሻ'
                : 'Teessoo Mooraa'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] dark:text-[#FFFFFF] tracking-tight">
            {currentLang === 'en'
              ? 'Visit Our Training Campus'
              : currentLang === 'am'
              ? 'ፃራ ጽዮን የሚገኘውን ዋና ካምፓሳችንን ይጎብኙ'
              : 'Mooraa Leenjii Tsara Tsion Daawwadhaa'}
          </h2>

          <p className="text-sm sm:text-base text-[#444748] dark:text-[#CCCCCC] leading-relaxed">
            {currentLang === 'en'
              ? 'Located in Tsara Tsion, Burayu, Sheger City. Step into our state-of-the-art beauty training labs, live salon workstations, and modern classrooms.'
              : currentLang === 'am'
              ? 'ቡራዩ ፃራ ጽዮን፣ ሸገር ከተማ የሚገኘውን ዘመናዊ የውበት ሙያ ማሰልጠኛ ካምፓስ በአካል መጥተው ይጎብኙ።'
              : 'Magaalaa Shegger, Burayyuu Tsara Tsion irratti dhaabbata leenjii miidhaginaa ammayyaa keenya dhuftanii daawwachuu dandeessu.'}
          </p>
        </motion.div>

        {/* Content Grid: Contact Details Cards + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Cards: Contact & Location Info (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-4"
          >
            {/* Location Address Card */}
            <div className="p-6 bg-white dark:bg-[#1A1A1A] border border-[#D4AF37]/30 shadow-md relative group hover:border-[#D4AF37] transition-all">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#FFF8F0] dark:bg-[#262626] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A08000] dark:text-[#D4AF37]">
                    {currentLang === 'en' ? 'Official Address' : currentLang === 'am' ? 'ዋና አድራሻ' : 'Teessoo'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FFFFFF]">
                    {currentLang === 'en'
                      ? 'Tsara Tsion Campus'
                      : currentLang === 'am'
                      ? 'ፃራ ጽዮን ካምፓስ'
                      : 'Mooraa Tsara Tsion'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#444748] dark:text-[#CCCCCC] leading-relaxed font-medium">
                    {currentLang === 'en'
                      ? instituteInfo.locationEn
                      : currentLang === 'am'
                      ? instituteInfo.locationAmharic
                      : instituteInfo.locationOromo}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & Hotline Card */}
            <div className="p-6 bg-white dark:bg-[#1A1A1A] border border-[#D4AF37]/30 shadow-md relative group hover:border-[#D4AF37] transition-all">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#FFF8F0] dark:bg-[#262626] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A08000] dark:text-[#D4AF37]">
                    {currentLang === 'en' ? 'Admission Hotline' : currentLang === 'am' ? 'የአድሚሽን ስልክ' : 'Bilbila Galmee'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#111111] dark:text-[#FFFFFF]">
                    <a href={`tel:${instituteInfo.phonePrimary}`} className="hover:text-[#D4AF37] transition-colors">
                      {instituteInfo.phonePrimary}
                    </a>
                  </h3>
                  <p className="text-xs text-[#444748] dark:text-[#CCCCCC]">
                    {currentLang === 'en'
                      ? 'Call or WhatsApp us for instant queries and program details.'
                      : currentLang === 'am'
                      ? 'ስለ ትምህርት ዘርፎች እና ምዝገባ በስልክ ይደውሉልን።'
                      : 'Waa\'ee koorsii fi galmee bilbilaan nu quunnamaa.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="p-4 bg-[#FFF8F0] dark:bg-[#222222] border-l-4 border-[#D4AF37] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-[#111111] dark:text-[#FFFFFF] font-semibold">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{instituteInfo.workingHours}</span>
              </div>
              <span className="text-[10px] uppercase bg-[#D4AF37] text-black px-2 py-0.5 font-bold">Open Today</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${instituteInfo.phonePrimary}`}
                className="py-3 px-4 bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider text-center hover:bg-[#D4AF37] dark:hover:bg-white hover:text-black transition-colors shadow flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hotline</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 border border-[#111111] dark:border-[#D4AF37] text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black text-xs font-bold uppercase tracking-wider text-center transition-colors shadow flex items-center justify-center space-x-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Directions</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Embedded Interactive Google Map (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col h-full min-h-[420px] bg-white dark:bg-[#1A1A1A] border border-[#D4AF37]/40 shadow-xl overflow-hidden relative group"
          >
            {/* Map Top Bar */}
            <div className="p-4 bg-[#111111] text-white flex items-center justify-between text-xs border-b border-[#D4AF37]/30">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold tracking-wide">
                  Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia
                </span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-[#D4AF37] text-black font-bold uppercase text-[10px] tracking-wider hover:bg-white transition-colors flex items-center space-x-1"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Interactive Google Map iframe */}
            <div className="relative flex-1 w-full h-full min-h-[360px]">
              <iframe
                title="Dare Institute Campus Interactive Map Location"
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d389.20640050535764!2d38.66450443215932!3d9.07043707038044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sTsara%20Tsion%2C%20Burayu%2C%20Sheger%20City%2C%20Oromia%2C%20Ethiopia!5e1!3m2!1sen!2set!4v1786168844443!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>

            {/* Map Bottom Footer Note */}
            <div className="p-3 bg-[#FFF8F0] dark:bg-[#222222] border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#444748] dark:text-[#CCCCCC] gap-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>
                  {currentLang === 'en'
                    ? 'Convenient public transport access & student parking available.'
                    : currentLang === 'am'
                    ? 'ቀላል የትራንስፖርት አማራጭ እና የመኪና ማቆሚያ ቦታ ያለው።'
                    : 'Geejjiba sabataaf mijataa kan ta\'e.'}
                </span>
              </div>
              <button
                onClick={onOpenContact}
                className="text-xs font-bold uppercase text-[#111111] dark:text-[#D4AF37] hover:underline"
              >
                {currentLang === 'en' ? 'Book Campus Visit →' : 'ካምፓሱን ይጎብኙ →'}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
