import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 text-slate-800">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0F4C81]">
          <ShieldCheck className="w-4 h-4 text-[#0F4C81]" />
          <span>GDPR / AVG Conform · Belgische Privacywetgeving</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Privacybeleid Snel Krediet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Laatst bijgewerkt: 1 januari 2026 · Van toepassing op alle diensten van {COMPANY_INFO.legalName}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0F4C81]" />
            <span>1. Wie is de verwerkingsverantwoordelijke?</span>
          </h2>
          <p>
            De verantwoordelijke voor de verwerking van uw persoonsgegevens is:{' '}
            <strong className="text-slate-900">{COMPANY_INFO.legalName}</strong>, gevestigd te{' '}
            {COMPANY_INFO.address}, ingeschreven in de Kruispuntbank van Ondernemingen (KBO) onder nummer{' '}
            <span className="font-mono font-semibold">{COMPANY_INFO.kbo}</span>, en geregistreerd bij de Autoriteit voor Financiële Diensten en Markten (FSMA) onder nummer{' '}
            <span className="font-mono font-semibold">{COMPANY_INFO.fsma}</span>.
          </p>
          <p>
            Voor al uw vragen over de bescherming van uw persoonsgegevens of voor het uitoefenen van uw rechten kunt u contact opnemen met onze Data Protection Officer (DPO) via{' '}
            <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#0F4C81] font-semibold underline">
              {COMPANY_INFO.email}
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F4C81]" />
            <span>2. Welke persoonsgegevens verzamelen wij?</span>
          </h2>
          <p>
            In het kader van onze kredietbemiddelingsactiviteiten verwerken wij uitsluitend de gegevens die strikt noodzakelijk zijn voor het onderzoeken en beheren van uw kredietaanvraag:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong className="text-slate-800">Identificatie- en contactgegevens:</strong> naam, voornaam, geboortedatum, domicilieadres in België, telefoonnummer en e-mailadres.</li>
            <li><strong className="text-slate-800">Financiële en socio-professionele gegevens:</strong> beroepsstatuut, maandelijks netto-inkomen, vaste lasten (zoals huur of hypotheekaflossingen) en gezinssamenstelling.</li>
            <li><strong className="text-slate-800">Kredietgeschiedenis:</strong> gegevens over eventuele lopende leningen, uitsluitend ter naleving van de wettelijke verplichting om overkreditering te voorkomen.</li>
            <li><strong className="text-slate-800">Gegevens via het contactformulier:</strong> onderwerp en inhoud van uw bericht.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C81]" />
            <span>3. Waarom en op welke rechtsgrond verwerken wij uw gegevens?</span>
          </h2>
          <div className="space-y-2">
            <p>
              <strong className="text-slate-800">Precontractuele maatregelen:</strong> Om uw kredietaanvraag te evalueren, een nauwkeurige simulatie te maken en een kredietofferte op maat voor te leggen.
            </p>
            <p>
              <strong className="text-slate-800">Wettelijke verplichting:</strong> Conform Boek VII van het Belgisch Wetboek van economisch recht (WER) is een kredietbemiddelaar wettelijk verplicht de financiële situatie en solvabiliteit van de consument te onderzoeken en te raadplegen bij de Centrale voor Kredieten aan Particulieren (CKP).
            </p>
            <p>
              <strong className="text-slate-800">Gerechtvaardigd belang en toestemming:</strong> Voor het beantwoorden van uw informatieverzoeken via ons contactformulier en voor de beveiliging van onze website (bijvoorbeeld preventie van fraude en spam).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            4. Met wie delen wij uw gegevens?
          </h2>
          <p>
            Uw persoonsgegevens worden <strong className="text-slate-900">nooit verkocht</strong> of gedeeld met commerciële derden voor direct marketing.
          </p>
          <p>
            Gegevens worden uitsluitend meegedeeld aan:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Erkende Belgische kredietgevers (banken en financiële instellingen) met het oog op het verkrijgen van een formeel kredietakkoord op uw verzoek.</li>
            <li>De Centrale voor Kredieten aan Particulieren van de Nationale Bank van België (NBB), conform de wettelijke voorschriften.</li>
            <li>Bevoegde toezichthoudende autoriteiten (FSMA, FOD Economie) wanneer de wet dit vereist.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            5. Hoe lang bewaren wij uw gegevens?
          </h2>
          <p>
            Indien een aanvraag niet leidt tot het afsluiten van een kredietovereenkomst, worden uw gegevens maximaal 6 maanden na afhandeling bewaard en vervolgens definitief gewist. Indien een kredietovereenkomst tot stand komt, worden de contractuele gegevens bewaard conform de wettelijke verjaringstermijnen (doorgaans 10 jaar na het beëindigen van de kredietovereenkomst).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            6. Wat zijn uw rechten onder de AVG / GDPR?
          </h2>
          <p>U beschikt over de volgende rechten:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Recht op inzage in uw persoonsgegevens.</li>
            <li>Recht op rectificatie van onjuiste of onvolledige gegevens.</li>
            <li>Recht op gegevenswissing ("recht op vergetelheid"), binnen de grenzen van wettelijke bewaarplichten.</li>
            <li>Recht op beperking van de verwerking en recht op bezwaar.</li>
            <li>Recht op overdraagbaarheid van gegevens (dataportabiliteit).</li>
          </ul>
          <p className="pt-2">
            U heeft tevens te allen tijde het recht om een klacht in te dienen bij de toezichthoudende autoriteit in België:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <strong>Gegevensbeschermingsautoriteit (GBA)</strong><br />
            Drukpersstraat 35, 1000 Brussel<br />
            Website:{' '}
            <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="underline text-[#0F4C81] font-semibold">
              www.gegevensbeschermingsautoriteit.be
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
