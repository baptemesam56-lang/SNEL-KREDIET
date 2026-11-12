import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { ContactForm } from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Building2, Train, Car } from 'lucide-react';

export const ContactView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
          Contact & Bereikbaarheid
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Neem contact op met Snel Krediet
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Heeft u een vraag over een kredietaanvraag of wenst u een afspraak met een van onze erkende adviseurs in Brussel? Wij staan voor u klaar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Section 6 requirements */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Stuur ons een bericht
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vul onderstaand formulier in. U ontvangt uiterlijk binnen 24 werkuren een discreet en professioneel antwoord.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Right Info: Brussels Headquarters & Opening Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A2540] text-white rounded-2xl p-6 sm:p-8 border border-blue-900/60 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-sky-300 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-display">Centraal Kantoor Brussel</h3>
                <span className="text-xs text-blue-200">Snel Krediet BV</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Adres:</div>
                  <div>{COMPANY_INFO.address}</div>
                  <div className="text-xs text-blue-200 mt-0.5">Europese Wijk (vlakbij Schuman & Maalbeek)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Telefoon:</div>
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                    className="text-white hover:text-sky-300 font-bold block"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                  <div className="text-xs text-blue-200">Directe lijn naar onze adviseurs</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">E-mailadres:</div>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-white hover:text-sky-300 block"
                  >
                    {COMPANY_INFO.email}
                  </a>
                  <div className="text-xs text-blue-200">Reactie gegarandeerd binnen 24u</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-blue-900/80">
                <Clock className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Openingsuren:</div>
                  <div className="text-xs space-y-1 mt-1">
                    <div className="flex justify-between gap-4">
                      <span>Maandag - Vrijdag:</span>
                      <span className="text-white font-medium">08:30 – 18:30</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Zaterdag:</span>
                      <span className="text-white font-medium">09:00 – 13:00</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Zondag:</span>
                      <span className="text-slate-400">Gesloten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Bereikbaarheid van ons kantoor
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-[#0F4C81] shrink-0" />
                <span>Metro 1 & 5: Halte Maalbeek of Schuman (3 min lopen)</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#0F4C81] shrink-0" />
                <span>Parkeergelegenheid: Parking Wetstraat / Europese Wijk</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F4C81] shrink-0" />
                <span>Toegankelijk voor personen met beperkte mobiliteit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
