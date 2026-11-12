import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { Award, ShieldAlert, Building2, HelpCircle, AlertCircle, ExternalLink } from 'lucide-react';

export const LegalView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 text-slate-800">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0F4C81]">
          <Award className="w-4 h-4 text-[#0F4C81]" />
          <span>Statutaire & Wettelijke Gegevens</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Wettelijke Informatie & Toezicht
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Informatie verstrekt overeenkomstig Boek VII van het Belgisch Wetboek van economisch recht (WER).
        </p>
      </div>

      {/* Mandatory Statutory Warning Banner */}
      <div className="bg-red-700 text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-2">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs sm:text-sm text-red-200">
          <ShieldAlert className="w-5 h-5 text-red-100" />
          <span>Wettelijk Verplichte Vermelding (Art. VII.64 WER)</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold font-display">
          {COMPANY_INFO.legalDisclaimer}
        </div>
        <p className="text-xs text-red-100 leading-relaxed pt-1">
          Kredietvorm: Lening op afbetaling. Een lening bindt u en moet worden terugbetaald. Controleer altijd vooraf uw terugbetalingscapaciteit.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0F4C81]" />
            <span>1. Bedrijfs- en Registratiegegevens</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
            <div><strong>Handelsnaam:</strong> {COMPANY_INFO.name}</div>
            <div><strong>Juridische benaming:</strong> {COMPANY_INFO.legalName}</div>
            <div><strong>Rechtsvorm:</strong> Besloten Vennootschap naar Belgisch recht (BV)</div>
            <div><strong>Maatschappelijke zetel:</strong> {COMPANY_INFO.address}</div>
            <div><strong>Ondernemingsnummer (KBO / BTW):</strong> {COMPANY_INFO.kbo}</div>
            <div><strong>FSMA registratienummer:</strong> {COMPANY_INFO.fsma}</div>
            <div><strong>Beroepskwalificatie:</strong> Kredietbemiddelaar in consumentenkrediet</div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            2. Toezichthoudende Autoriteiten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900">Autoriteit voor Financiële Diensten en Markten (FSMA)</div>
              <p className="text-xs text-slate-600">
                Toezichthouder op de kredietbemiddelaars en de gedragsregels.
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Congresstraat 12-14, 1000 Brussel<br />
                <a href="https://www.fsma.be" target="_blank" rel="noopener noreferrer" className="text-[#0F4C81] font-semibold underline inline-flex items-center gap-1">
                  <span>www.fsma.be</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900">FOD Economie, K.M.O., Middenstand en Energie</div>
              <p className="text-xs text-slate-600">
                Algemene Directie Economische Inspectie.
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                City Atrium, Vooruitgangsstraat 50, 1210 Brussel<br />
                <a href="https://economie.fgov.be" target="_blank" rel="noopener noreferrer" className="text-[#0F4C81] font-semibold underline inline-flex items-center gap-1">
                  <span>economie.fgov.be</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            3. Klachtenbehandeling & Ombudsdienst
          </h2>
          <p>
            Wij streven naar de hoogste kwaliteit van dienstverlening. Heeft u desondanks een klacht over onze tussenkomst of onze adviezen, dan kunt u contact opnemen met onze interne klachtendienst via{' '}
            <strong className="text-slate-900">{COMPANY_INFO.email}</strong>.
          </p>
          <p>
            Indien er geen minnelijke oplossing wordt bereikt, kunt u zich wenden tot de bevoegde ombudsdienst voor de financiële sector in België:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <strong className="text-slate-900">Ombudsfin vzw – Ombudsman in financiële geschillen</strong><br />
            North Gate II, Koning Albert II-laan 8, bus 2, 1000 Brussel<br />
            E-mail: ombudsman@ombudsfin.be<br />
            Website:{' '}
            <a href="https://www.ombudsfin.be" target="_blank" rel="noopener noreferrer" className="text-[#0F4C81] font-semibold underline inline-flex items-center gap-1">
              <span>www.ombudsfin.be</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
