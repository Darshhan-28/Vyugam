import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '../data/gallery';

export const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = galleryImages.length;

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Reset and restart auto-play timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 3000);
  }, [next]);

  // Auto-play
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, selected, resetTimer]);

  const getSlideClass = (idx: number): string => {
    const offset = idx - currentIndex;
    if (offset === 0) return 'gallery-slide-active';
    if (offset === -1 || (currentIndex === 0 && idx === total - 1)) return 'gallery-slide-prev';
    if (offset === 1 || (currentIndex === total - 1 && idx === 0)) return 'gallery-slide-next';
    return 'gallery-slide-hidden';
  };

  const handleArrowClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    resetTimer();
  };

  return (
    <section id="gallery" className="py-24 px-4 bg-gallery border-t-4 border-marigold border-b-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
            Moments
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
            Gallery
          </h2>
          <p className="font-body text-base text-cream/90 max-w-xl mx-auto">
            A glimpse into our events and memories captured.
          </p>
        </div>

        {/* CoverFlow Carousel */}
        <div
          className="gallery-carousel mx-auto"
          onMouseEnter={() => {
            if (timerRef.current) clearInterval(timerRef.current);
          }}
          onMouseLeave={resetTimer}
        >
          <div className="gallery-track">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className={`gallery-slide ${getSlideClass(idx)}`}
                onClick={() => {
                  if (idx === currentIndex) setSelected(src);
                  else goTo(idx);
                }}
              >
                <img
                  src={src}
                  alt={`Event photo ${idx + 1}`}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={(e) => handleArrowClick(e, prev)}
            aria-label="Previous image"
            className="gallery-arrow gallery-arrow-left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => handleArrowClick(e, next)}
            aria-label="Next image"
            className="gallery-arrow gallery-arrow-right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-4 sm:mt-5">
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { goTo(idx); resetTimer(); }}
              aria-label={`Go to image ${idx + 1}`}
              className={`gallery-dot ${idx === currentIndex ? 'gallery-dot-active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 backdrop-blur-md p-4"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="Enlarged event photo"
            className="max-h-[85vh] max-w-[90vw] border-2 border-marigold shadow-[8px_8px_0_#7A0606]"
          />
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-carbon border-2 border-marigold text-marigold hover:bg-marigold hover:text-obsidian flex items-center justify-center font-bold text-xl transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
