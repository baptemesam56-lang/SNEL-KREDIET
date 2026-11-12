import React, { useState, useMemo } from 'react';
import { CreditPurpose } from '../types';
import { TESTIMONIALS_DATA, TRUST_METRICS } from '../data/testimonials';
import { formatEuro } from '../utils/calculator';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Quote,
  ThumbsUp,
  Award,
  Sparkles,
  ArrowRight,
  MapPin,
} from 'lucide-react';

interface TestimonialsProps {
  onStartApplication?: (purpose?: CreditPurpose) => void;
  className?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  onStartApplication,
  className = '',
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<CreditPurpose | 'all'>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const filteredTestimonials = useMemo(() => {
    if (selectedPurpose === 'all') return TESTIMONIALS_DATA;
    return TESTIMONIALS_DATA.filter((item) => item.purpose === selectedPurpose);
  }, [selectedPurpose]);

  const pageSize = 3;
  const maxPages = Math.ceil(filteredTestimonials.length / pageSize);
  const currentItems = filteredTestimonials.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePurposeFilter = (purpose: CreditPurpose | 'all') => {
    setSelectedPurpose(purpose);
    setCurrentPage(0);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  return (
    <section className={`py-12 sm:py-16 ${className}`} id="klantervaringen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Heading & Trust Metric Bar */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0F4C81] text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-[#0F4C81]" />
            <span>Social Proof & Betrouwbaarheid in België</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
            Wat onze klanten zeggen over Snel Krediet
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Echte ervaringen van Belgische particulieren die via onze erkende kredietmakelaars hun persoonlijke lening, autofinanciering of hergroepering realiseerden.
          </p>
        </div>

        {/* TRUST SCORE HERO BANNER */}
        <div className="bg-gradient-to-br from-[#0B2548] via-[#0F3666] to-[#164E87] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/60 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score & Stars */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left border-b md:border-b-0 md:border-r border-blue-400/20 pb-5 md:pb-0 md:pr-6">
              <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 rounded-2xl w-24 h-24 shrink-0 shadow-inner">
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  {TRUST_METRICS.overallRating}
                </span>
                <span className="text-[11px] text-sky-200 font-medium">op 5.0</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400 filter drop-shadow-xs"
                    />
                  ))}
                </div>
                <div className="text-sm font-bold text-white">
                  Uitstekende klanttevredenheid
                </div>
                <div className="text-xs text-sky-200">
                  Gebaseerd op <strong>{TRUST_METRICS.totalReviews} geverifieerde dossiers</strong>
                </div>
              </div>
            </div>

            {/* Trust Highlights Strip */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-blue-950/60 border border-blue-400/20 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <ThumbsUp className="w-4 h-4 shrink-0" />
                  <span>{TRUST_METRICS.recommendationRate}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-tight">
                  Beveelt Snel Krediet aan bij vrienden en familie
                </div>
              </div>

              <div className="bg-blue-950/60 border border-blue-400/20 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>FSMA Erkend</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-tight">
                  Officiële kredietmakelaar registratie 109482 A-B
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-blue-950/60 border border-blue-400/20 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{TRUST_METRICS.averageResponseTime}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-tight">
                  Gemiddelde behandeltijd van een aanvraag
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => handlePurposeFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPurpose === 'all'
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Alle reviews ({TESTIMONIALS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => handlePurposeFilter('persoonlijk')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPurpose === 'persoonlijk'
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Persoonlijke lening
            </button>
            <button
              type="button"
              onClick={() => handlePurposeFilter('auto')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPurpose === 'auto'
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Autolening
            </button>
            <button
              type="button"
              onClick={() => handlePurposeFilter('verbouwing')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPurpose === 'verbouwing'
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Renovatie & Energie
            </button>
            <button
              type="button"
              onClick={() => handlePurposeFilter('hergroepering')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedPurpose === 'hergroepering'
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Hergroepering
            </button>
          </div>

          {/* Carousel Next / Prev Controls */}
          {maxPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 tabular-nums">
                Pagina {currentPage + 1} van {maxPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                  aria-label="Vorige klantervaringen"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                  aria-label="Volgende klantervaringen"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TESTIMONIAL CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between relative group"
            >
              {/* Quote icon watermark */}
              <Quote className="absolute top-4 right-4 w-10 h-10 text-slate-100 pointer-events-none group-hover:text-blue-50 transition-colors" />

              <div className="space-y-4">
                {/* Rating & Loan Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-semibold text-[#0F4C81] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                    {item.purposeLabel}
                  </span>
                </div>

                {/* Highlight Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  "{item.highlight}"
                </h3>

                {/* Review Body */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.review}
                </p>

                {/* Verified Loan Badge */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Leenbedrag: <strong className="text-slate-800">{formatEuro(item.amount)}</strong></span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
              </div>

              {/* Customer Profile Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#1A62A0] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {item.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.verified && (
                        <span title="Geverifieerde kredietklant" className="inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81]" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/80">
                  Geverifieerd
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SOCIAL PROOF REASSURANCE STRIP */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#0F4C81]">
              <Sparkles className="w-4 h-4 text-[#0F4C81]" />
              <span>Wilt u ook ervaren hoe eenvoudig kredietbemiddeling kan zijn?</span>
            </div>
            <p className="text-sm text-slate-700 font-semibold">
              Simuleer gratis uw lening en ontvang binnen 24 uur een vrijblijvend voorstel op maat.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onStartApplication && (
              <button
                type="button"
                onClick={() => onStartApplication()}
                className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-blue-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2"
              >
                <span>Direct Krediet Aanvragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
