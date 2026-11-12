import React from 'react';
import { PageId } from '../types';
import { COMPANY_INFO } from '../data/content';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenCookieSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCookieSettings }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1F3D] text-slate-300 border-t border-blue-900/60 text-sm">
      {/* Compulsory Belgian Legal Banner */}
      <div className="bg-red-700/90 text-white py-3.5 px-4 text-center border-b border-red-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="font-extrabold tracking-wider text-sm sm:text-base uppercase font-display">
            {COMPANY_INFO.legalDisclaimer}
          </span>
          <span className="text-xs text-red-100 hidden md:inline">
            — Wetboek van economisch recht Boek VII (Consumentenkrediet).
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand info with new bespoke Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md pt-1">
              {COMPANY_INFO.legalName} is een erkend onafhankelijk kredietbemiddelaar in consumentenkrediet in België. Wij verstrekken betrouwbaar, transparant en verantwoord advies voor uw persoonlijke financieringen.
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-1 font-mono">
              <div>KBO / Ondernemingsnummer: <span className="text-slate-200 font-semibold">{COMPANY_INFO.kbo}</span></div>
              <div>FSMA registratie: <span className="text-slate-200 font-semibold">{COMPANY_INFO.fsma}</span></div>
              <div>Toezicht: <span className="text-slate-200">{COMPANY_INFO.supervisoryAuthority}</span></div>
            </div>
          </div>

          {/* Quick Links: Navigatie */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigatie
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Startpagina
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kredietmogelijkheden')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Kredietmogelijkheden
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('diensten')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Onze diensten
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('hoe-werkt-het')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Hoe werkt het?
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('over-ons')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Over ons
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Veelgestelde vragen
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Contact & Afspraak
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Juridisch & Privacy
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Privacybeleid (AVG / RGPD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('cookies')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Cookiebeleid
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCookieSettings}
                  className="hover:text-sky-300 transition-colors text-slate-300 inline-flex items-center gap-1 text-xs"
                >
                  <span>Cookie-instellingen beheren</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('voorwaarden')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Algemene voorwaarden
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('wettelijk')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Wettelijke informatie (FSMA)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kantoor Brussel
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-slate-400">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Openingsuren:</div>
                  <div>Ma. - Vr: 08:30 – 18:30</div>
                  <div>Zaterdag: 09:00 – 13:00</div>
                  <div>Zondag: Gesloten</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Representative Example */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p>
            {COMPANY_INFO.representativeExample}
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name} BV. Alle rechten voorbehouden.
          </div>
          <div className="flex items-center gap-3">
            <span>Erkend in België</span>
            <span>·</span>
            <span>GDPR-conform</span>
            <span>·</span>
            <span>SSL 256-bit Beveiligd</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
