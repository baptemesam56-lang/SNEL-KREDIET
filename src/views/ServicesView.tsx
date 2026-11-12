import React from 'react';
import { PageId } from '../types';
import { CREDIT_PURPOSES } from '../data/content';
import { Check, ArrowRight, ShieldCheck, Euro, Car, Home as HomeIcon, Layers, FileText } from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: (amount?: number, duration?: number, purpose?: any) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onOpenApplicationModal,
}) => {
  const serviceIcons = {
    persoonlijk: Euro,
    auto: Car,
    verbouwing: HomeIcon,
    hergroepering: Layers,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Intro */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
          Dienstenaanbod in België
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Onze Krediet- & Financieringsdiensten
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Bij Snel Krediet vindt u een compleet palet aan kredietoplossingen op maat van uw behoeften, met vaste rentevoeten en looptijden afgestemd op uw financiële situatie.
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="space-y-12">
        {CREDIT_PURPOSES.map((service, idx) => {
          const Icon = serviceIcons[service.id] || Euro;
          const isEven = idx % 2 === 1;

          return (
            <div
              key={service.id}
              className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                      {service.title}
                    </h2>
                    <span className="text-xs font-semibold text-[#0F4C81]">
                      Vanaf {service.indicativeJKP}% vast JKP
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Specifics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>Leenbedrag: € {service.minAmount.toLocaleString('nl-BE')} tot € {service.maxAmount.toLocaleString('nl-BE')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>Looptijd: {service.minMonths} tot {service.maxMonths} maanden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>Vaste maandelijkse aflossing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>Duidelijke & transparante voorwaarden</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenApplicationModal(service.minAmount * 2, 48, service.id)}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 transition-colors flex items-center gap-2"
                  >
                    <span>Vrijblijvend aanvragen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('kredietmogelijkheden')}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Simuleer deze lening
                  </button>
                </div>
              </div>

              {/* Right decorative detail */}
              <div className="lg:col-span-5 bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Wettelijk kader & Inzichten
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    Voldoet aan de Belgische kredietreglementering. Voorafgaande solvabiliteitstoetsing bij de CKP (Nationale Bank van België).
                  </p>
                  <div className="p-2.5 rounded-lg bg-blue-50 text-[#0F4C81] font-medium border border-blue-200">
                    Advies van een erkend specialist inbegrepen.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Service Box */}
      <div className="bg-gradient-to-r from-[#0B2548] to-[#0F4C81] text-white rounded-2xl p-8 border border-blue-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-sky-300" />
          <h3 className="text-xl font-bold font-display">
            Financieel & Budgettair Advies
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-3xl">
          Naast de bemiddeling van leningen kunt u bij Snel Krediet ook terecht voor een grondige analyse van uw bestaande kredietlasten. Onze experts kijken samen met u hoe uw leningen kunnen worden geoptimaliseerd om uw maandelijkse leefruimte te vergroten.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] border border-white/30 shadow-md shadow-blue-950/40 transition-colors"
          >
            Neem contact op voor een vertrouwelijk gesprek
          </button>
        </div>
      </div>
    </div>
  );
};
