import React, { useState } from 'react';
import { PageId, CreditPurpose, ColorTheme } from './types';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { LoanApplicationModal } from './components/LoanApplicationModal';

// Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ServicesView } from './views/ServicesView';
import { CreditSolutionsView } from './views/CreditSolutionsView';
import { HowItWorksView } from './views/HowItWorksView';
import { FaqView } from './views/FaqView';
import { ContactView } from './views/ContactView';
import { PrivacyView } from './views/PrivacyView';
import { CookiesView } from './views/CookiesView';
import { TermsView } from './views/TermsView';
import { LegalView } from './views/LegalView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem('snelkrediet_theme') as ColorTheme;
      if (saved && (saved === 'luminous-blue' || saved === 'royal-navy' || saved === 'emerald-gold')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'luminous-blue';
  });

  const handleSelectTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem('snelkrediet_theme', theme);
    } catch {
      // ignore
    }
  };

  // Modal states for loan application
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState(10000);
  const [modalDuration, setModalDuration] = useState(48);
  const [modalPurpose, setModalPurpose] = useState<CreditPurpose>('persoonlijk');

  // Cookie settings modal trigger
  const [forceCookieSettings, setForceCookieSettings] = useState(false);

  const handleOpenApplicationModal = (
    amount = 10000,
    duration = 48,
    purpose: CreditPurpose = 'persoonlijk'
  ) => {
    setModalAmount(amount);
    setModalDuration(duration);
    setModalPurpose(purpose);
    setIsApplicationModalOpen(true);
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with office hours and contact info */}
      <TopBar />

      {/* Main Navbar with brand new bespoke logo and theme switcher */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenApplicationModal={() => handleOpenApplicationModal()}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenApplicationModal={handleOpenApplicationModal}
            currentTheme={currentTheme}
          />
        )}
        {currentPage === 'over-ons' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenApplicationModal={() => handleOpenApplicationModal()}
          />
        )}
        {currentPage === 'diensten' && (
          <ServicesView
            onNavigate={handleNavigate}
            onOpenApplicationModal={handleOpenApplicationModal}
          />
        )}
        {currentPage === 'kredietmogelijkheden' && (
          <CreditSolutionsView
            onNavigate={handleNavigate}
            onOpenApplicationModal={handleOpenApplicationModal}
          />
        )}
        {currentPage === 'hoe-werkt-het' && (
          <HowItWorksView
            onNavigate={handleNavigate}
            onOpenApplicationModal={handleOpenApplicationModal}
          />
        )}
        {currentPage === 'faq' && <FaqView onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactView />}
        {currentPage === 'privacy' && <PrivacyView />}
        {currentPage === 'cookies' && (
          <CookiesView onOpenCookieSettings={() => setForceCookieSettings(true)} />
        )}
        {currentPage === 'voorwaarden' && <TermsView />}
        {currentPage === 'wettelijk' && <LegalView />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCookieSettings={() => setForceCookieSettings(true)}
      />

      {/* GDPR Cookie Consent Banner & Preferences Modal */}
      <CookieBanner
        onNavigate={handleNavigate}
        forceOpenSettings={forceCookieSettings}
        onCloseSettings={() => setForceCookieSettings(false)}
      />

      {/* Loan Application Inquiry Modal */}
      <LoanApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        initialAmount={modalAmount}
        initialDuration={modalDuration}
        initialPurpose={modalPurpose}
      />
    </div>
  );
}
