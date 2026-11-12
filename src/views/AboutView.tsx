import React from 'react';
import { PageId } from '../types';
import { COMPANY_INFO, ADVISORY_TEAM } from '../data/content';
import { Testimonials } from '../components/Testimonials';
import { ShieldCheck, Users, Award, Scale, CheckCircle2, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenApplicationModal,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Intro Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-[#0F4C81] border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-[#0F4C81]" />
          <span>Erkend in België · FSMA {COMPANY_INFO.fsma.split(' ')[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
          Over Snel Krediet
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {COMPANY_INFO.legalName} is een onafhankelijk kredietbemiddelingsbureau gevestigd in Brussel. Sinds onze oprichting hebben wij ons toegewijd aan het aanbieden van transparante, verantwoorde en persoonlijke kredietoplossingen voor particulieren in België.
        </p>
      </div>

      {/* Visual & Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Onze missie: Eerlijk en verantwoord lenen in België
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            De kredietwereld kan complex lijken, met uiteenlopende tarieven, kleine lettertjes en strikte regelgeving. Bij Snel Krediet geloven we dat financiële voorlichting helder, menselijk en eerlijk moet zijn.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Als kredietbemiddelaar treden wij op als neutrale gids tussen u en erkende Belgische kredietgevers. Wij analyseren uw leenbehoeften nauwkeurig en zoeken het krediet dat het beste past bij uw persoonlijke en financiële evenwicht.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#0F4C81]" />
                <span>Onafhankelijke bemiddeling</span>
              </div>
              <p className="text-xs text-slate-600">
                Niet gebonden aan één bank. Wij zoeken naar de meest voordelige marktvoorwaarden.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Scale className="w-4 h-4 text-[#0F4C81]" />
                <span>Strikte zorgplicht</span>
              </div>
              <p className="text-xs text-slate-600">
                Wij verstrekken geen krediet als dit uw financiële gezondheid in gevaar brengt.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="group relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <div className="h-80 overflow-hidden relative">
              <img
                src="/src/assets/images/belgian_finance_advisory_team_1794258355459.jpg"
                alt="Adviseursteam Snel Krediet Brussel"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

              {/* Floating Dynamic Badges */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 transition-transform group-hover:translate-y-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
                <span>Wetstraat 145, Brussel</span>
              </div>

              <div className="absolute top-3 right-3 bg-[#0F4C81]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                <span>FSMA 109482 A-B</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-bold text-sm text-sky-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span>Centraal Kantoor & Erkend Adviesteam</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Gecertificeerd volgens het Belgisch Wetboek van economisch recht (Boek VII WER)
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Fysiek kantoor & telefonisch:</span>
                <span className="font-semibold text-white">Ma. - Vr. 08:30 – 18:30</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F4C81] hover:bg-[#0c3e6b] text-white transition-colors"
              >
                Afspraak maken
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Team */}
      <div className="space-y-6 pt-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
            Erkende vakmensen
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Ons team van kredietbemiddelaars
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Al onze medewerkers beschikken over de wettelijk verplichte beroepskwalificaties opgelegd door de FSMA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ADVISORY_TEAM.map((advisor) => (
            <div
              key={advisor.name}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-bold text-[#0F4C81]">
                <Users className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">
                  {advisor.name}
                </h3>
                <div className="text-xs font-semibold text-[#0F4C81]">
                  {advisor.role}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {advisor.experience}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Specialisatie:</span> {advisor.specialty}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Regulatory Standing */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-[#0F4C81] shrink-0" />
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Wettelijke registraties & Toezicht in België
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div>
            <strong className="text-slate-800 block mb-1">Toezicht FSMA:</strong>
            Snel Krediet BV is geregistreerd in het register van kredietbemiddelaars bij de Autoriteit voor Financiële Diensten en Markten (FSMA) onder nummer {COMPANY_INFO.fsma}.
          </div>
          <div>
            <strong className="text-slate-800 block mb-1">Toezicht FOD Economie:</strong>
            De algemene economische controle op onze activiteiten wordt uitgeoefend door de Federale Overheidsdienst Economie, K.M.O., Middenstand en Energie (Algemene Directie Economische Inspectie).
          </div>
        </div>
      </div>

      {/* Social Proof & Customer Reviews */}
      <Testimonials onStartApplication={onOpenApplicationModal} />

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-[#0B2548] to-[#0F4C81] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold font-display text-white">
            Wilt u kennismaken met een van onze adviseurs?
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            U bent van harte welkom op ons kantoor in Brussel of vraag direct online een simulatie aan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            Contact opnemen
          </button>
          <button
            onClick={onOpenApplicationModal}
            className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#0F4C81] hover:bg-[#0c3e6b] text-white border border-white/30 shadow-md shadow-blue-950/40 flex items-center gap-1.5 transition-colors"
          >
            <span>Krediet aanvragen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
