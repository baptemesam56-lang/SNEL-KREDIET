import React from 'react';
import { PageId, CreditPurpose, ColorTheme } from '../types';
import { COMPANY_INFO, CREDIT_PURPOSES, HOW_IT_WORKS_STEPS, FAQ_LIST } from '../data/content';
import { THEMES } from '../utils/theme';
import { LoanCalculator } from '../components/LoanCalculator';
import { HeroLoanWidget } from '../components/HeroLoanWidget';
import { Testimonials } from '../components/Testimonials';
import { ClientStories } from '../components/ClientStories';
import { ContactForm } from '../components/ContactForm';
import advisoryTeamImg from '../assets/images/belgian_finance_advisory_team_1794258355459.jpg';
import personalLoanImg from '../assets/images/personal_loan_lifestyle_1794428025687.jpg';
import electricCarImg from '../assets/images/modern_electric_car_loan_1794258355966.jpg';
import renovationLoanImg from '../assets/images/family_home_renovation_loan_1794258355533.jpg';
import consolidationImg from '../assets/images/loan_consolidation_meeting_1794428041079.jpg';
import {
  ShieldCheck,
  Clock,
  Euro,
  FileCheck2,
  ArrowRight,
  ChevronRight,
  PhoneCall,
  Check,
  Building2,
  HelpCircle,
  Car,
  Home as HomeIcon,
  Layers,
  Sparkles,
  Sliders,
  Eye,
  X,
  Maximize2,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import {
  ROTATING_HERO_TOPICS,
  ADVISORY_PROFILES,
  EmploymentCategory,
  getTailoredAdvice,
} from '../data/advisoryMatrix';
import { formatEuro } from '../utils/calculator';

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onOpenApplicationModal: (amount?: number, duration?: number, purpose?: CreditPurpose) => void;
  currentTheme?: ColorTheme;
}

interface LoanCardImageDetail {
  title: string;
  image: string;
  badge: string;
  purpose: CreditPurpose;
  description: string;
  minAmount: number;
  maxAmount: number;
  minMonths: number;
  maxMonths: number;
  indicativeJKP: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenApplicationModal,
  currentTheme = 'luminous-blue',
}) => {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);
  const [heroTopicIndex, setHeroTopicIndex] = React.useState<number>(0);
  const [selectedAdvisoryProfile, setSelectedAdvisoryProfile] =
    React.useState<EmploymentCategory>('bediende');
  const [selectedAdvisoryPurpose, setSelectedAdvisoryPurpose] =
    React.useState<CreditPurpose>('verbouwing');
  const [activeImageModal, setActiveImageModal] =
    React.useState<LoanCardImageDetail | null>(null);

  const themeCfg = THEMES[currentTheme];
  const isLightHero = currentTheme === 'luminous-blue';

  // Automatically cycle through hero topics every 4.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeroTopicIndex((prev) => (prev + 1) % ROTATING_HERO_TOPICS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeTopic = ROTATING_HERO_TOPICS[heroTopicIndex];
  const tailoredAdvice = React.useMemo(
    () => getTailoredAdvice(selectedAdvisoryProfile, selectedAdvisoryPurpose),
    [selectedAdvisoryProfile, selectedAdvisoryPurpose]
  );

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-24">
      {/* HERO SECTION */}
      <section className={`relative overflow-hidden pt-5 sm:pt-10 lg:pt-16 pb-8 sm:pb-14 lg:pb-20 transition-colors duration-300 ${themeCfg.heroBg}`}>
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isLightHero ? '#1D4ED8' : '#38bdf8'} 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold tracking-wide ${themeCfg.heroBadgeBg} ${themeCfg.heroBadgeBorder} ${themeCfg.heroBadgeText}`}>
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Erkend Kredietbemiddelaar in België · FSMA {COMPANY_INFO.fsma.split(' ')[0]}</span>
              </div>

              {/* Dynamic Interactive Topic Selector Chips in Hero */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {ROTATING_HERO_TOPICS.map((topic, idx) => {
                  const isActive = idx === heroTopicIndex;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setHeroTopicIndex(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0F4C81] text-white shadow-md ring-2 ring-white/30 scale-105'
                          : isLightHero
                          ? 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs'
                          : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/15'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-300' : 'bg-slate-400'}`} />
                      <span>{topic.badge}</span>
                    </button>
                  );
                })}
              </div>

              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.12] ${themeCfg.heroText}`}>
                Verantwoorde lening voor{' '}
                <span
                  key={activeTopic.id}
                  className={`inline-block transition-all duration-500 text-transparent bg-clip-text underline decoration-[#0F4C81]/30 underline-offset-8 animate-in fade-in slide-in-from-bottom-2 ${
                    currentTheme === 'emerald-gold'
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300'
                      : isLightHero
                      ? 'bg-gradient-to-r from-[#0F4C81] via-[#1A62A0] to-[#0A355A]'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-300'
                  }`}
                >
                  {activeTopic.target}
                </span>
              </h1>

              {/* Dynamic Paragraph adapting to the active topic */}
              <p
                key={`desc-${activeTopic.id}`}
                className={`text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed transition-all duration-300 min-h-[56px] animate-in fade-in ${themeCfg.heroSubtitle}`}
              >
                {activeTopic.desc}{' '}
                <strong className={isLightHero ? 'text-[#0F4C81] font-bold' : 'text-white font-semibold'}>
                  SNEL KREDIET
                </strong>{' '}
                informeert en begeleidt u helder, discreet en volgens de strikte Belgische consumentenwetgeving (Boek VII WER).
              </p>

              {/* Core Feature Checklist */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2 text-xs sm:text-sm ${
                isLightHero ? 'text-slate-700' : 'text-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLightHero ? 'bg-blue-100 text-[#0F4C81]' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Vaste rentevoet gedurende de looptijd</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLightHero ? 'bg-blue-100 text-[#0F4C81]' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Duidelijke & transparante voorwaarden</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLightHero ? 'bg-blue-100 text-[#0F4C81]' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Snelle reactie binnen 24 werkuren</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLightHero ? 'bg-blue-100 text-[#0F4C81]' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>100% discrete & veilige aanvraag</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenApplicationModal()}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${themeCfg.ctaButton}`}
                >
                  <span>KREDIET AANVRAGEN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('kredietmogelijkheden')}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold border transition-colors ${
                    isLightHero
                      ? 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300 shadow-sm'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border-slate-700'
                  }`}
                >
                  <span>Bekijk Kredietmogelijkheden</span>
                  <ChevronRight className={`w-4 h-4 ${isLightHero ? 'text-[#0F4C81]' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Statutory Micro Note */}
              <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
                <span className="font-semibold text-amber-500">{COMPANY_INFO.legalDisclaimer}</span>
                <span>·</span>
                <span>Consumentenkrediet in België</span>
              </div>
            </div>

            {/* Right Column: Prominent Interactive Loan Repayment Calculator Widget */}
            <div className="lg:col-span-5 relative space-y-3">
              <HeroLoanWidget
                onStartApplication={(amt, dur, purp) => onOpenApplicationModal(amt, dur, purp)}
                onExploreDetails={() => {
                  const el = document.getElementById('kredietsimulator');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />

              {/* Brussels Office Trust Strip */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={advisoryTeamImg}
                    alt="Financieel adviseurs Brussel"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Centraal Kantoor Brussel</div>
                    <div className="text-[11px] text-slate-500">Wetstraat 145 · Erkend advies</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F4C81] hover:bg-[#0c3e6b] text-white transition-colors shadow-xs"
                >
                  Afspraak
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-COLUMN TRUST METRIC STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-[#0F4C81] shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 font-display">Binnen 24u</div>
              <div className="text-xs text-slate-500 mt-0.5">Persoonlijk antwoord en dossierbeoordeling</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-[#0F4C81] shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 font-display">Flexibele Looptijd</div>
              <div className="text-xs text-slate-500 mt-0.5">Looptijden van 12 tot 120 maanden op maat</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-[#0F4C81] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 font-display">100% Erkend</div>
              <div className="text-xs text-slate-500 mt-0.5">FSMA-registratie 109482 A-B in België</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-[#0F4C81] shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 font-display">Vaste Rente</div>
              <div className="text-xs text-slate-500 mt-0.5">Geen onaangename schommelingen</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE LOAN CALCULATOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C81] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Online Kredietsimulatie België</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Simuleer direct uw krediet op maat
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Kies uw gewenste leenbedrag en looptijd. Bereken direct uw geschatte maandelijkse aflossing met duidelijke voorwaarden volgens het Belgisch wettelijk kader.
          </p>
        </div>

        <LoanCalculator
          onStartApplication={(amt, dur, purp) => onOpenApplicationModal(amt, dur, purp)}
        />
      </section>

      {/* 4 CORE CREDIT SOLUTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Financieringsoplossingen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Onze kredietoplossingen voor particulieren
            </h2>
          </div>
          <button
            onClick={() => onNavigate('kredietmogelijkheden')}
            className="text-xs sm:text-sm font-semibold text-[#0F4C81] hover:text-[#0c3e6b] flex items-center gap-1 self-start md:self-auto"
          >
            <span>Vergelijk alle kredieten in detail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Persoonlijke Lening (Dynamic Image) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
            <div
              onClick={() =>
                setActiveImageModal({
                  title: 'Persoonlijke Lening',
                  image: personalLoanImg,
                  badge: '100% Vrij te besteden',
                  purpose: 'persoonlijk',
                  description:
                    'Vrij te besteden krediet voor al uw projecten. U hoeft geen aankoopfacturen of offertes voor te leggen. Volledige privacy en vaste maandlasten.',
                  minAmount: 1250,
                  maxAmount: 50000,
                  minMonths: 12,
                  maxMonths: 84,
                  indicativeJKP: 6.49,
                })
              }
              className="h-40 overflow-hidden relative cursor-pointer group/img"
              title="Klik om foto en details te vergroten"
            >
              <img
                src={personalLoanImg}
                alt="Persoonlijke Lening in België"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-sky-300" />
                  <span>Vergroot foto & details</span>
                </span>
                <span className="text-[10px] font-bold text-sky-200">6,49% JKP</span>
              </div>
              <div className="absolute top-2 right-2 bg-[#0F4C81] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Vrij project
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Euro className="w-4 h-4 text-[#0F4C81]" />
                <span>Persoonlijke Lening</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vrij te besteden krediet voor al uw projecten. U hoeft geen aankoopfacturen voor te leggen.
              </p>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>Bedrag: <strong className="text-slate-800">€ 1.250 tot € 50.000</strong></div>
                <div>Looptijd: <strong className="text-slate-800">12 tot 84 maanden</strong></div>
                <div>Rente: <strong className="text-[#0F4C81]">Vanaf 6,49% JKP</strong></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenApplicationModal(10000, 48, 'persoonlijk')}
                className="text-xs font-bold text-slate-900 hover:text-[#0F4C81] flex items-center gap-1"
              >
                <span>Aanvragen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Autolening (Dynamic Image) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
            <div
              onClick={() =>
                setActiveImageModal({
                  title: 'Autolening & Mobiliteit',
                  image: electricCarImg,
                  badge: 'Gunstig mobiliteitstarief',
                  purpose: 'auto',
                  description:
                    'Financiering voor nieuwe of tweedehands wagens, hybride/elektrische voertuigen of motorfietsen. Tot 100% financiering van de factuurwaarde inclusief btw.',
                  minAmount: 2500,
                  maxAmount: 75000,
                  minMonths: 12,
                  maxMonths: 84,
                  indicativeJKP: 4.89,
                })
              }
              className="h-40 overflow-hidden relative cursor-pointer group/img"
              title="Klik om foto en details te vergroten"
            >
              <img
                src={electricCarImg}
                alt="Autolening in België"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-sky-300" />
                  <span>Vergroot foto & details</span>
                </span>
                <span className="text-[10px] font-bold text-sky-200">4,89% JKP</span>
              </div>
              <div className="absolute top-2 right-2 bg-[#0F4C81] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Populair
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#0F4C81]" />
                <span>Autolening & Mobiliteit</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Financiering voor nieuwe of tweedehands wagens, hybride/elektrische voertuigen of motorfietsen.
              </p>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>Bedrag: <strong className="text-slate-800">€ 2.500 tot € 75.000</strong></div>
                <div>Looptijd: <strong className="text-slate-800">12 tot 84 maanden</strong></div>
                <div>Rente: <strong className="text-[#0F4C81]">Vanaf 4,89% JKP</strong></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenApplicationModal(20000, 60, 'auto')}
                className="text-xs font-bold text-slate-900 hover:text-[#0F4C81] flex items-center gap-1"
              >
                <span>Aanvragen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Renovatielening (Dynamic Image) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
            <div
              onClick={() =>
                setActiveImageModal({
                  title: 'Renovatielening & Energie',
                  image: renovationLoanImg,
                  badge: 'Groen tarief',
                  purpose: 'verbouwing',
                  description:
                    'Lage rentevoet voor verbouwingswerken, zonnepanelen, isolatie of interieur. Geen hypothecaire aktekosten noch notariskosten verschuldigd.',
                  minAmount: 2500,
                  maxAmount: 60000,
                  minMonths: 18,
                  maxMonths: 120,
                  indicativeJKP: 5.25,
                })
              }
              className="h-40 overflow-hidden relative cursor-pointer group/img"
              title="Klik om foto en details te vergroten"
            >
              <img
                src={renovationLoanImg}
                alt="Renovatielening België"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-sky-300" />
                  <span>Vergroot foto & details</span>
                </span>
                <span className="text-[10px] font-bold text-sky-200">5,25% JKP</span>
              </div>
              <div className="absolute top-2 right-2 bg-[#0F4C81] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Groen tarief
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4 text-[#0F4C81]" />
                <span>Renovatielening & Energie</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verbouwingswerken, zonnepanelen, isolatie of interieur. Lage rentevoet voor energiezuinige investeringen.
              </p>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>Bedrag: <strong className="text-slate-800">€ 2.500 tot € 60.000</strong></div>
                <div>Looptijd: <strong className="text-slate-800">18 tot 120 maanden</strong></div>
                <div>Rente: <strong className="text-[#0F4C81]">Vanaf 5,25% JKP</strong></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenApplicationModal(15000, 60, 'verbouwing')}
                className="text-xs font-bold text-slate-900 hover:text-[#0F4C81] flex items-center gap-1"
              >
                <span>Aanvragen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Kredietsamenvoeging (Dynamic Image) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
            <div
              onClick={() =>
                setActiveImageModal({
                  title: 'Hergroepering van Kredieten',
                  image: consolidationImg,
                  badge: 'Eén overzichtelijke lening',
                  purpose: 'hergroepering',
                  description:
                    'Breng rust in uw budget. Voeg meerdere leningen, autofinancieringen en kredietkaarten samen tot één duidelijke maandlast tegen een vaste rentevoet.',
                  minAmount: 5000,
                  maxAmount: 75000,
                  minMonths: 24,
                  maxMonths: 120,
                  indicativeJKP: 7.15,
                })
              }
              className="h-40 overflow-hidden relative cursor-pointer group/img"
              title="Klik om foto en details te vergroten"
            >
              <img
                src={consolidationImg}
                alt="Hergroepering Kredieten België"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover/img:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                <span className="text-[11px] font-semibold text-white flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-sky-300" />
                  <span>Vergroot foto & details</span>
                </span>
                <span className="text-[10px] font-bold text-sky-200">7,15% JKP</span>
              </div>
              <div className="absolute top-2 right-2 bg-[#0F4C81] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                Rust in budget
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0F4C81]" />
                <span>Hergroepering Kredieten</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Breng rust in uw budget. Voeg meerdere leningen samen tot één duidelijke maandlast tegen een vaste rente.
              </p>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>Bedrag: <strong className="text-slate-800">€ 5.000 tot € 75.000</strong></div>
                <div>Looptijd: <strong className="text-slate-800">24 tot 120 maanden</strong></div>
                <div>Rente: <strong className="text-[#0F4C81]">Vanaf 7,15% JKP</strong></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenApplicationModal(25000, 84, 'hergroepering')}
                className="text-xs font-bold text-slate-900 hover:text-[#0F4C81] flex items-center gap-1"
              >
                <span>Aanvragen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC TAILORED ADVICE GENERATOR (DYNAMIC PARAGRAPHS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
                <Sparkles className="w-4 h-4 text-[#0F4C81]" />
                <span>Interactief Kenniscentrum · Advies op Maat</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Dynamisch Kredietadvies voor uw Situatie
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selecteer uw professionele situatie en gewenst kredietdoel. Ons systeem genereert live een deskundige adviesparagraaf met de exacte Belgische regels en documenten.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conform Boek VII WER</span>
            </div>
          </div>

          {/* Interactive Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Profile Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Kies uw beroepssituatie in België:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ADVISORY_PROFILES.map((prof) => {
                  const isSelected = selectedAdvisoryProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => setSelectedAdvisoryProfile(prof.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#0F4C81] text-white font-bold shadow-sm ring-2 ring-[#0F4C81]/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="truncate font-semibold">{prof.label}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-sky-200' : 'text-slate-400'
                        }`}
                      >
                        {prof.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Purpose Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Kies uw financieringsdoel:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CREDIT_PURPOSES.map((purp) => {
                  const isSelected = selectedAdvisoryPurpose === purp.id;
                  return (
                    <button
                      key={purp.id}
                      type="button"
                      onClick={() => setSelectedAdvisoryPurpose(purp.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#0F4C81] text-white font-bold shadow-sm ring-2 ring-[#0F4C81]/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="truncate font-semibold">{purp.title}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-sky-200' : 'text-slate-400'
                        }`}
                      >
                        {purp.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC GENERATED PARAGRAPH CARD */}
          <div
            key={`${selectedAdvisoryProfile}-${selectedAdvisoryPurpose}`}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 animate-in fade-in zoom-in-98 duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                {tailoredAdvice.headline}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F4C81] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Vast JKP: {tailoredAdvice.indicativeJKP}%
                </span>
              </div>
            </div>

            {/* Dynamic Core Analysis Paragraph */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {tailoredAdvice.analysisParagraph}
            </p>

            {/* Legal context & advice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Wettelijk toezicht & Bescherming:</div>
              <p className="leading-relaxed">{tailoredAdvice.legalGuidance}</p>
            </div>

            {/* Tailored documents list for this combination */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Vereiste documenten voor dit profiel & project:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {tailoredAdvice.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100"
                  >
                    <Check className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory footnote and action CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 max-w-lg">
                ℹ️ {tailoredAdvice.statutoryThresholdNotice}
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenApplicationModal(
                    tailoredAdvice.recommendedAmount,
                    tailoredAdvice.recommendedDuration,
                    selectedAdvisoryPurpose
                  )
                }
                className="px-6 py-3 rounded-xl bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0F4C81]/20 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Aanvraag starten voor dit profiel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (HOE WERKT HET?) */}
      <section className="bg-gradient-to-br from-[#0B2548] via-[#0E3563] to-[#0A1F3B] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-blue-900/60 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Eenvoudig, discreet en snel
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
              Hoe werkt het aanvragen bij Snel Krediet?
            </h2>
            <p className="text-sm text-slate-200">
              In vier transparante stappen van uw online simulatie tot de uitbetaling op uw rekening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((stepItem, idx) => (
              <div
                key={stepItem.step}
                className="bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm rounded-2xl p-6 relative flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-extrabold text-blue-300">
                      {stepItem.step}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-100 bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-400/30">
                      {stepItem.timing}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-display">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('hoe-werkt-het')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <span>Lees de volledige procedure en documentenlijst</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & BELGIAN LEGAL GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
              Onze garanties
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Waarom kiezen Belgen voor Snel Krediet?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Als onafhankelijk erkend kredietbemiddelaar zijn wij niet gebonden aan één enkele bank. Wij vergelijken de mogelijkheden binnen het Belgische bankenlandschap om voor u het meest geschikte en voordelige kredietvoorstel te vinden.
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1">
                  Bescherming tegen overkreditering
                </div>
                <p className="text-slate-600">
                  Wij hanteren strikte verantwoorde leennormen. We controleren altijd uw leencapaciteit zodat uw maandelijkse leefkwaliteit gegarandeerd blijft.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1">
                  Volledige conformiteit met FSMA & FOD Economie
                </div>
                <p className="text-slate-600">
                  Al onze adviseurs zijn officieel gecertificeerd volgens de wetgeving op het consumentenkrediet (Boek VII WER).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1">
                  Transparant & Vrijblijvend advies
                </div>
                <p className="text-slate-600">
                  Onze berekeningen en offertes zijn 100% vrijblijvend. U beslist in alle vrijheid over uw kredietvoorstel.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-[#0B2548] to-[#0F4C81] rounded-2xl p-8 text-white space-y-6 border border-blue-900/60 shadow-xl">
              <h3 className="text-xl font-bold font-display text-white">
                Direct persoonlijk advies nodig?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Heeft u een specifieke vraag over uw leenmogelijkheden, een lopend krediet of uw terugbetalingscapaciteit? Onze adviseurs in Brussel staan telefonisch en per e-mail voor u klaar.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-950/60 border border-blue-400/20">
                  <PhoneCall className="w-5 h-5 text-sky-300 shrink-0" />
                  <div>
                    <div className="text-xs text-blue-200">Bel ons kantoor in Brussel:</div>
                    <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} className="font-bold text-white text-base hover:text-sky-300">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-950/60 border border-blue-400/20">
                  <Clock className="w-5 h-5 text-sky-300 shrink-0" />
                  <div>
                    <div className="text-xs text-blue-200">Beschikbaarheid:</div>
                    <div className="font-semibold text-white">{COMPANY_INFO.openingHours}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] border border-white/20 transition-colors shadow-md text-center"
                >
                  Afspraak of contactformulier openen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT STORIES CAROUSEL */}
      <ClientStories
        onStartApplication={(purp) => onOpenApplicationModal(undefined, undefined, purp)}
      />

      {/* SOCIAL PROOF & CLIENT TESTIMONIALS */}
      <Testimonials
        onStartApplication={(purp) => onOpenApplicationModal(undefined, undefined, purp)}
      />

      {/* FAQ SECTION PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
            Duidelijkheid vooraf
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Veelgestelde vragen over leningen in België
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Antwoorden op de meest voorkomende vragen over leenvoorwaarden, documenten en de wetgeving.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.slice(0, 4).map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-[#0F4C81] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <span className="text-lg text-slate-400 font-mono shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <button
            type="button"
            onClick={() => onNavigate('faq')}
            className="text-xs sm:text-sm font-semibold text-[#0F4C81] hover:text-[#0c3e6b] underline inline-flex items-center gap-1"
          >
            <span>Bekijk alle vragen en antwoorden</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CONTACT SECTION ON HOMEPAGE */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Neem contact op
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Stel uw vraag aan onze kredietdeskundigen
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Heeft u advies nodig of wilt u meer weten over onze dienstverlening? Vul onderstaand contactformulier in.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* DYNAMIC IMAGE LIGHTBOX MODAL */}
      {activeImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header with close button */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
              <img
                src={activeImageModal.image}
                alt={activeImageModal.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    {activeImageModal.badge}
                  </span>
                  <h3 className="text-2xl font-bold font-display">{activeImageModal.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 block">Vast tarief:</span>
                  <span className="text-xl font-extrabold text-sky-300 font-display">
                    {activeImageModal.indicativeJKP}% JKP
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeImageModal.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Kredietbedrag:</span>
                  <strong className="text-slate-900 text-sm">
                    {formatEuro(activeImageModal.minAmount)} – {formatEuro(activeImageModal.maxAmount)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Looptijd:</span>
                  <strong className="text-slate-900 text-sm">
                    {activeImageModal.minMonths} tot {activeImageModal.maxMonths} mnd
                  </strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Wettelijke toetsing:</span>
                  <strong className="text-emerald-700 text-sm flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Boek VII WER</span>
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveImageModal(null)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Venster sluiten
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const purpose = activeImageModal.purpose;
                    const amount = activeImageModal.minAmount * 2;
                    setActiveImageModal(null);
                    onOpenApplicationModal(amount, 48, purpose);
                  }}
                  className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 transition-colors flex items-center gap-2"
                >
                  <span>Direct simuleren & aanvragen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
