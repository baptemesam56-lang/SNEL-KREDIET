import React from 'react';
import { PageId, CreditPurpose } from '../types';
import { CREDIT_PURPOSES, COMPANY_INFO } from '../data/content';
import { LoanCalculator } from '../components/LoanCalculator';
import { RequiredDocumentsChecklist } from '../components/RequiredDocumentsChecklist';
import { ShieldCheck, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface CreditSolutionsViewProps {
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: (amount?: number, duration?: number, purpose?: CreditPurpose) => void;
}

export const CreditSolutionsView: React.FC<CreditSolutionsViewProps> = ({
  onNavigate,
  onOpenApplicationModal,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
          Kredietmogelijkheden in België
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Vind de geschikte lening voor uw situatie
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Vergelijk de verschillende kredietformules, simuleer uw maandelijkse termijn en ontdek welke oplossing het beste aansluit bij uw plannen.
        </p>
      </div>

      {/* Simulator Section */}
      <div>
        <LoanCalculator
          onStartApplication={(amt, dur, purp) => onOpenApplicationModal(amt, dur, purp)}
        />
      </div>

      {/* Comparison Table */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Vergelijking van onze kredietformules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Overzicht van de indicatieve voorwaarden en kenmerken per type lening op afbetaling in België.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#0F4C81] text-white border-b border-blue-900">
                <th className="py-4 px-4 sm:px-6 font-semibold">Type Krediet</th>
                <th className="py-4 px-4 sm:px-6 font-semibold">Leenbedrag</th>
                <th className="py-4 px-4 sm:px-6 font-semibold">Looptijd</th>
                <th className="py-4 px-4 sm:px-6 font-semibold">Indicatief JKP</th>
                <th className="py-4 px-4 sm:px-6 font-semibold">Aankoopbewijs nodig?</th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-right">Aanvraag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {CREDIT_PURPOSES.map((cred) => (
                <tr key={cred.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                    <div>{cred.title}</div>
                    <span className="text-[11px] font-normal text-slate-500">{cred.badge}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 tabular-nums text-slate-700">
                    € {cred.minAmount.toLocaleString('nl-BE')} – € {cred.maxAmount.toLocaleString('nl-BE')}
                  </td>
                  <td className="py-4 px-4 sm:px-6 tabular-nums text-slate-700">
                    {cred.minMonths} tot {cred.maxMonths} mnd
                  </td>
                  <td className="py-4 px-4 sm:px-6 tabular-nums font-bold text-[#0F4C81]">
                    Vanaf {cred.indicativeJKP}%
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600">
                    {cred.id === 'persoonlijk' ? 'Nee (vrij te besteden)' : 'Ja (factuur of offerte)'}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenApplicationModal(cred.minAmount * 2, 48, cred.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-xs transition-colors"
                    >
                      Aanvragen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Required Documents Checklist Component */}
      <RequiredDocumentsChecklist
        onStartApplication={(purp) => onOpenApplicationModal(undefined, undefined, purp)}
      />

      {/* Belgian Regulatory Caveat */}
      <div className="bg-amber-500/10 border border-amber-600/30 rounded-2xl p-6 text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-950 block uppercase text-sm font-display">
            {COMPANY_INFO.legalDisclaimer}
          </strong>
          <p className="text-slate-700 leading-relaxed">
            Het aangaan van een lening is een financiële verbintenis die moet worden nagekomen. Controleer uw aflossingscapaciteit voordat u zich verbindt. Conform de wettelijke bepalingen van Boek VII van het Wetboek van economisch recht worden alle aanvragen getoetst bij de Centrale voor Kredieten aan Particulieren (CKP).
          </p>
        </div>
      </div>
    </div>
  );
};
