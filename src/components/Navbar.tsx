import React, { useState } from 'react';
import { PageId, ColorTheme } from '../types';
import { Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import { COMPANY_INFO } from '../data/content';
import { Logo } from './Logo';
import { ThemeSelector } from './ThemeSelector';
import { THEMES } from '../utils/theme';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: () => void;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenApplicationModal,
  currentTheme,
  onSelectTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeCfg = THEMES[currentTheme];
  const isLightNav = themeCfg.logoVariant === 'dark';

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Startpagina' },
    { id: 'kredietmogelijkheden', label: 'Kredietoplossingen' },
    { id: 'diensten', label: 'Diensten' },
    { id: 'hoe-werkt-het', label: 'Werkwijze' },
    { id: 'over-ons', label: 'Over ons' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 ${themeCfg.navbarBg} border-b ${themeCfg.navbarBorder} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Zone with bespoke Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
          >
            <Logo variant={themeCfg.logoVariant} size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50/80 text-[#0F4C81] font-bold shadow-xs'
                      : 'text-slate-700 hover:text-[#0F4C81] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenApplicationModal}
              className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:ring-offset-2"
            >
              <span>KREDIET AANVRAGEN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenApplicationModal}
              className="sm:hidden px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#0F4C81]"
            >
              Aanvragen
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Menu openen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 ${
            isLightNav
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#0a172c] border-slate-800 text-white'
          }`}
        >
          <div className="grid gap-1 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? isLightNav
                      ? 'bg-blue-50 text-[#0F4C81] font-bold'
                      : 'bg-white/10 text-sky-300 font-semibold'
                    : isLightNav
                    ? 'text-slate-700 hover:bg-slate-50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={`pt-3 border-t flex flex-col gap-2 ${isLightNav ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApplicationModal();
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold shadow-md ${themeCfg.ctaButton}`}
            >
              <span>Vrijblijvende Aanvraag Indienen</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold ${
                isLightNav
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-500" />
              <span>Bel direct: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
