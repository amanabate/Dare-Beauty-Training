'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems } from '../../data/instituteData';
import { GalleryItem, Language } from '../../types';

interface GalleryProps {
  currentLang: Language;
}

export const Gallery: React.FC<GalleryProps> = ({ currentLang }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: currentLang === 'en' ? 'All Moments' : currentLang === 'am' ? 'ሁሉም' : 'Hunda' },
    { id: 'hair', label: currentLang === 'en' ? 'Hair Styling' : currentLang === 'am' ? 'የፀጉር አሰራር' : 'Rifeensa' },
    { id: 'barber', label: currentLang === 'en' ? 'Barbering' : currentLang === 'am' ? 'ባርበሪንግ' : 'Baarбариንጊ' },
    { id: 'makeup', label: currentLang === 'en' ? 'Makeup Art' : currentLang === 'am' ? 'ሜካፕ' : 'Mikaappii' },
    { id: 'nails', label: currentLang === 'en' ? 'Nail Art' : currentLang === 'am' ? 'ጥፍር አርት' : 'Qoollee (Nail)' },
    { id: 'classroom', label: currentLang === 'en' ? 'Classroom & Graduation' : currentLang === 'am' ? 'የመማሪያ ክፍል እና ምረቃ' : 'Kutaa & Eebba' },
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#FDF8F8] dark:bg-[#0B0B0B] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#A08000] dark:text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Academy Showcase' : currentLang === 'am' ? 'የተቋሙ ምስሎች' : 'Mul\'isa Dhaabbataa'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#FFFFFF] leading-tight mb-4">
            {currentLang === 'en' ? 'Campus & Training Gallery' : currentLang === 'am' ? 'የተግባር ልምምድ እና የተማሪዎች ምስሎች' : 'Gaalarii Shaakalaa fi Barattootaa'}
          </h2>

          <p className="text-[#444748] dark:text-[#CCCCCC] text-base">
            {currentLang === 'en'
              ? 'Take a glimpse inside our state-of-the-art training labs, live model practice sessions, and graduation celebrations.'
              : currentLang === 'am'
              ? 'በደሬ ኢንስቲትዩት ያለውን ዘመናዊ የመማሪያ አካባቢ፣ የተግባር ልምምዶችን እና የምረቃ ስነ-ስርዓቶችን ይመልከቱ።'
              : 'Mooraa leenjii ammayyaa fi eebba barattootaa keenyaa daawwadhaa.'}
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#111111] dark:bg-[#D4AF37] text-white dark:text-black border border-[#111111] dark:border-[#D4AF37] shadow'
                  : 'bg-white dark:bg-[#171717] text-[#444748] dark:text-[#CCCCCC] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] bg-gray-100 dark:bg-[#171717] overflow-hidden cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-lg text-white">
                    {currentLang === 'en' ? item.title : currentLang === 'am' ? item.amharicTitle : (item.oromoTitle || item.title)}
                  </h3>
                  <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white hover:text-[#D4AF37] focus:outline-none"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 p-3 text-white bg-black/50 hover:bg-[#D4AF37] hover:text-black transition-colors focus:outline-none"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 p-3 text-white bg-black/50 hover:bg-[#D4AF37] hover:text-black transition-colors focus:outline-none"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
              <img
                src={filteredItems[activeLightboxIndex].image}
                alt={filteredItems[activeLightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain border-2 border-[#D4AF37]/50"
              />
              <div className="mt-4 text-center text-white">
                <h3 className="font-serif text-xl font-bold text-[#D4AF37]">
                  {currentLang === 'en' 
                    ? filteredItems[activeLightboxIndex].title 
                    : currentLang === 'am'
                    ? filteredItems[activeLightboxIndex].amharicTitle
                    : (filteredItems[activeLightboxIndex].oromoTitle || filteredItems[activeLightboxIndex].title)}
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-lg">
                  {filteredItems[activeLightboxIndex].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
