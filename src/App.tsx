import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { PassValue } from './components/PassValue';
import { Events } from './components/Events';
import { PassCTA } from './components/PassCTA';
import { Schedule } from './components/Schedule';
import { EventDay } from './components/EventDay';
import { FAQ } from './components/FAQ';
import { Prizes } from './components/Prizes';
import { Venue } from './components/Venue';
import { Gallery } from './components/Gallery';
import { Team } from './components/Team';
import { Footer } from './components/Footer';
import { RegisterModal } from './components/RegisterModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { PassPage } from './pages/PassPage';
import { AdminPage } from './pages/AdminPage';
import { ScanPage } from './pages/ScanPage';
import { ArrowUp, Ticket } from 'lucide-react';

// ── Public website layout ─────────────────────────────────────

const PublicSite: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showFloatingBtns, setShowFloatingBtns] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtns(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenRegister = () => setIsModalOpen(true);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-obsidian text-smoke relative">
      <div className="grain-overlay" />
      <div className="halftone-overlay" />

      <Navbar onOpenRegister={handleOpenRegister} />

      <main>
        <Hero onOpenRegister={handleOpenRegister} />
        <About />
        <PassValue onOpenRegister={handleOpenRegister} />
        <Events />
        <PassCTA onOpenRegister={handleOpenRegister} />
        <Schedule />
        <EventDay />
        <FAQ />
        <Prizes />
        <Venue />
        <Gallery />
        <Team />
      </main>

      <Footer onOpenRegister={handleOpenRegister} />

      {/* Floating Action Controls */}
      {showFloatingBtns && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[800] flex flex-col items-end gap-2 sm:gap-3 animate-fadeIn pb-[env(safe-area-inset-bottom,0)]">
          <button
            onClick={handleOpenRegister}
            id="floating-pass-btn"
            className="floating-register-btn font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian px-3 sm:px-5 py-2 sm:py-3 shadow-[4px_4px_0_#C1121F] hover:-translate-y-1 hover:shadow-[6px_6px_0_#C1121F] transition-all flex items-center gap-1.5 sm:gap-2"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-obsidian" />
            <span className="hidden xs:inline">Get Your Pass</span>
            <span className="xs:hidden">Pass</span>
          </button>

          <button
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="w-9 h-9 sm:w-12 sm:h-12 bg-carbon text-marigold border-2 border-marigold flex items-center justify-center shadow-[3px_3px_0_#7A0606] hover:bg-marigold hover:text-obsidian hover:-translate-y-1 transition-all"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Register Modal */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowToast={addToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};

// ── Root App with Routes ──────────────────────────────────────

export const App: React.FC = () => (
  <Routes>
    {/* Public website */}
    <Route path="/" element={<PublicSite />} />

    {/* Participant pass page — no link on public site */}
    <Route path="/pass/:token" element={<PassPage />} />

    {/* Admin panel — no link on public site */}
    <Route path="/admin" element={<AdminPage />} />

    {/* Coordinator scanner — no link on public site, no public mention */}
    <Route path="/scan" element={<ScanPage />} />

    {/* Catch-all: redirect to home */}
    <Route path="*" element={<PublicSite />} />
  </Routes>
);

export default App;
