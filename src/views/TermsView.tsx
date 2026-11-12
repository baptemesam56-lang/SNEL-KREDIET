import React from 'react';
import { COMPANY_INFO } from '../data/content';
import { Scale, FileText, CheckCircle2 } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 text-slate-800">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0F4C81]">
          <Scale className="w-4 h-4 text-[#0F4C81]" />
          <span>Wettelijk Kader België</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Algemene Voorwaarden
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Geldig vanaf 1 januari 2026 · {COMPANY_INFO.legalName}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            1. Identificatie van de dienstverlener
          </h2>
          <p>
            Deze website wordt beheerd door <strong className="text-slate-900">{COMPANY_INFO.legalName}</strong>, met maatschappelijke zetel te {COMPANY_INFO.address}, ingeschreven in de Kruispuntbank van Ondernemingen (KBO) onder nummer {COMPANY_INFO.kbo}, en geregistreerd bij de FSMA onder nummer {COMPANY_INFO.fsma} als kredietbemiddelaar in consumentenkrediet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            2. Aard van onze dienstverlening
          </h2>
          <p>
            Snel Krediet treedt op als erkend onafhankelijk kredietbemiddelaar (kredietmakelaar) tussen kandidaat-kredietnemers en erkende kredietgevers in België. Wij verstrekken objectieve informatie en vergelijkingen met betrekking tot consumentenkrediet, in het bijzonder leningen op afbetaling.
          </p>
          <p>
            Het raadplegen van de website, het uitvoeren van een simulatie en het indienen van een informatie- of kredietaanvraag zijn <strong className="text-slate-900">volledig kosteloos en vrijblijvend</strong> voor de consument. Conform de Belgische wetgeving mag een kredietbemiddelaar geen enkele voorafgaande vergoeding of administratieve kost aan de consument aanrekenen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            3. Geen bindend kredietaanbod
          </h2>
          <p>
            De berekeningen en simulaties op deze website zijn louter indicatief en vormen onder geen beding een definitief of bindend kredietaanbod conform het Wetboek van economisch recht. Een daadwerkelijke kredietovereenkomst komt pas tot stand na:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Het indienen van een volledig en waarheidsgetrouw dossier;</li>
            <li>De wettelijke controle van uw solvabiliteit bij de Centrale voor Kredieten aan Particulieren (CKP);</li>
            <li>De formele goedkeuring door de kredietgever en de overhandiging van het wettelijk verplichte SECCI-informatieformulier;</li>
            <li>De wederzijdse ondertekening van de kredietovereenkomst door beide partijen.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            4. Verplichtingen van de gebruiker
          </h2>
          <p>
            De gebruiker verbindt zich ertoe te allen tijde correcte, volledige en actuele informatie te verstrekken bij het indienen van een aanvraag via onze formulieren. Het verstrekken van valse of misleidende gegevens kan leiden tot de onmiddellijke weigering van het dossier en kan strafrechtelijk worden vervolgd.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            5. Toepasselijk recht en bevoegde rechtbanken
          </h2>
          <p>
            Op deze voorwaarden en op alle diensten van Snel Krediet is uitsluitend het <strong className="text-slate-900">Belgisch recht</strong> van toepassing. In geval van een geschil dat niet minnelijk kan worden opgelost, zijn uitsluitend de rechtbanken van het gerechtelijk arrondissement Brussel bevoegd.
          </p>
        </section>
      </div>
    </div>
  );
};
