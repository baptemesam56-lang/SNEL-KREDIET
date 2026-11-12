import React from 'react';
import { PageId, CreditPurpose } from '../types';
import { HOW_IT_WORKS_STEPS } from '../data/content';
import { RequiredDocumentsChecklist } from '../components/RequiredDocumentsChecklist';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: (amount?: number, duration?: number, purpose?: CreditPurpose) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onNavigate,
  onOpenApplicationModal,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Intro */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
          Transparante Procedure
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Hoe verloopt uw kredietaanvraag?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Bij Snel Krediet verloopt het proces vlot, discreet en 100% transparant. Van uw eerste simulatie tot de uitbetaling van het geld op uw Belgische bankrekening begeleiden wij u stap voor stap.
        </p>
      </div>

      {/* 4 Steps In-depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HOW_IT_WORKS_STEPS.map((item) => (
          <div
            key={item.step}
            className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-[#0F4C81] text-white font-mono text-2xl font-extrabold flex items-center justify-center shadow-md shadow-[#0F4C81]/25">
                  {item.step}
                </span>
                <span className="text-xs font-semibold text-[#0F4C81] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  {item.timing}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {item.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F4C81] shrink-0" />
              <span>Conform Belgische consumentenwetgeving</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Required Documents Checklist Component */}
      <RequiredDocumentsChecklist
        onStartApplication={(purp) => onOpenApplicationModal(undefined, undefined, purp)}
      />

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-[#0B2548] to-[#0F4C81] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold font-display text-white">
            Klaar om uw aanvraag te starten?
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Simuleer direct uw gewenste lening en ontvang binnen 24 uur vrijblijvend advies.
          </p>
        </div>
        <button
          onClick={() => onOpenApplicationModal()}
          className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] border border-white/20 shadow-md shadow-blue-950/40 transition-colors flex items-center gap-2 shrink-0"
        >
          <span>Krediet aanvragen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
