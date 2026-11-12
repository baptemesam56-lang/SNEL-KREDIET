import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CreditPurpose } from '../types';
import { CLIENT_STORIES, ClientStory } from '../data/clientStories';
import { formatEuro } from '../utils/calculator';
import {
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  MapPin,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Clock,
  Euro,
  Calendar,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

interface ClientStoriesProps {
  onStartApplication?: (purpose?: CreditPurpose) => void;
  className?: string;
}

export const ClientStories: React.FC<ClientStoriesProps> = ({
  onStartApplication,
  className = '',
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<CreditPurpose | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter stories based on selected loan category
  const filteredStories = useMemo(() => {
    if (selectedPurpose === 'all') return CLIENT_STORIES;
    return CLIENT_STORIES.filter((story) => story.purpose === selectedPurpose);
  }, [selectedPurpose]);

  // Ensure currentIndex stays within bounds when filtering
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedPurpose]);

  const totalStories = filteredStories.length;
  const currentStory: ClientStory = filteredStories[currentIndex] || filteredStories[0];

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (isPlaying && !isHovered && totalStories > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalStories);
      }, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, totalStories]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalStories - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalStories);
  };

  const handleSelectStory = (idx: number) => {
    setCurrentIndex(idx);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <section
      className={`py-12 sm:py-16 ${className}`}
      id="client-stories"
      aria-label="Klantervaringen en testimonials in België"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header with Title and Section Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
              <ShieldCheck className="w-4 h-4 text-[#0F4C81]" />
              <span>Geverifieerde Ervaringen · 100% Belgisch Kredietkader</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Client Stories: Hoe wij Belgen vooruit helpen
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Lees de authentieke ervaringen van kredietnemers in Vlaanderen en Brussel. Van energiezuinige renovaties tot lagere maandlasten door slimme krediethergroepering.
            </p>
          </div>

          {/* Carousel Control Bar */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalStories).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                title={isPlaying ? 'Pauzeer automatische carrousel' : 'Start carrousel'}
                aria-label={isPlaying ? 'Pauzeer carrousel' : 'Start carrousel'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-[#0F4C81] transition-colors shadow-2xs"
                title="Vorige klantervaring"
                aria-label="Vorige klantervaring"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-[#0F4C81] transition-colors shadow-2xs"
                title="Volgende klantervaring"
                aria-label="Volgende klantervaring"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPurpose('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPurpose === 'all'
                ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Alle verhalen ({CLIENT_STORIES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedPurpose('verbouwing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPurpose === 'verbouwing'
                ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Renovatie & Energie
          </button>
          <button
            type="button"
            onClick={() => setSelectedPurpose('auto')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPurpose === 'auto'
                ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Autolening & Mobiliteit
          </button>
          <button
            type="button"
            onClick={() => setSelectedPurpose('hergroepering')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPurpose === 'hergroepering'
                ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Krediethergroepering
          </button>
          <button
            type="button"
            onClick={() => setSelectedPurpose('persoonlijk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPurpose === 'persoonlijk'
                ? 'bg-[#0F4C81] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Persoonlijke lening
          </button>
        </div>

        {/* FEATURED STORY SPOTLIGHT CAROUSEL CARD */}
        {currentStory && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Top progress indicator bar for active carousel slide */}
            {isPlaying && (
              <div className="h-1 w-full bg-slate-100 overflow-hidden">
                <div
                  key={currentStory.id}
                  className="h-full bg-[#0F4C81] animate-[carouselProgress_7s_linear_infinite]"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Main Testimonial Narrative (Left / 7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Rating & Location Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(currentStory.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-2xs"
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1.5">5.0 / 5.0</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />
                      <span>{currentStory.location}</span>
                      <span>·</span>
                      <span>{currentStory.region}</span>
                    </div>
                  </div>

                  {/* Highlight Quote Headline */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display leading-snug">
                    "{currentStory.tagline}"
                  </h3>

                  {/* Direct Quote Block */}
                  <div className="relative pl-5 border-l-2 border-[#0F4C81]/30 py-1">
                    <Quote className="w-6 h-6 text-[#0F4C81]/20 absolute -top-2 -left-3 pointer-events-none" />
                    <p className="text-sm sm:text-base font-medium text-slate-800 italic leading-relaxed">
                      "{currentStory.quote}"
                    </p>
                  </div>

                  {/* Detailed story narrative */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentStory.story}
                  </p>
                </div>

                {/* Customer Credentials */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#185d99] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {currentStory.avatarInitials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{currentStory.name}</span>
                        {currentStory.verified && (
                          <span title="Geverifieerde consumentenkrediet klant in België">
                            <CheckCircle2 className="w-4 h-4 text-[#0F4C81]" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Klant sinds {currentStory.year} · {currentStory.purposeLabel}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    Geverifieerd Dossier
                  </span>
                </div>
              </div>

              {/* Financial Metrics & Loan Breakdown (Right / 5 cols) */}
              <div className="lg:col-span-5 bg-slate-50/70 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dossierkenmerken
                    </span>
                    <span className="text-xs font-bold text-[#0F4C81] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {currentStory.purposeLabel}
                    </span>
                  </div>

                  {/* Key Financial Impact Card */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Toegekend kredietbedrag:</span>
                      <strong className="text-lg font-extrabold text-slate-900 font-display">
                        {formatEuro(currentStory.amount)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Gekozen looptijd:</span>
                      <strong className="text-slate-800">{currentStory.durationMonths} maanden</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Vaste debetrentevoet:</span>
                      <strong className="text-[#0F4C81] font-bold">{currentStory.jkp}% JKP</strong>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Maandelijkse aflossing:</span>
                      <span className="text-base font-extrabold text-[#0F4C81] font-display">
                        {formatEuro(currentStory.monthlyPayment)}/mnd
                      </span>
                    </div>
                  </div>

                  {/* Concrete Result Callout */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-[#0F4C81] font-bold">
                      <Sparkles className="w-4 h-4 text-[#0F4C81] shrink-0" />
                      <span>{currentStory.keyMetricLabel}:</span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 pl-6">
                      {currentStory.keyMetric}
                    </div>
                    <div className="text-[11px] text-slate-600 pl-6 flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Doorlooptijd: {currentStory.approvedIn}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#0F4C81] shrink-0" />
                    <span>Conform FSMA 109482 A-B en Boek VII Wetboek van economisch recht.</span>
                  </div>
                </div>

                {/* Call to action for matching loan */}
                <div className="pt-4 border-t border-slate-200">
                  {onStartApplication && (
                    <button
                      type="button"
                      onClick={() => onStartApplication(currentStory.purpose)}
                      className="w-full py-3 px-4 rounded-xl bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0F4C81]/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Simuleer een gelijkaardige {currentStory.purposeLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL CAROUSEL RAIL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kies een verhaal uit onze Belgische dossiers:</span>
            <span className="font-semibold">{currentIndex + 1} van {totalStories} actief</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredStories.map((story, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => handleSelectStory(idx)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#0F4C81] ring-2 ring-[#0F4C81]/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-[#0F4C81] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {story.avatarInitials}
                    </div>
                    <div className="truncate text-xs font-bold text-slate-900">{story.name}</div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{story.location}</span>
                  </div>

                  <div className="mt-1 text-[11px] font-semibold text-[#0F4C81] truncate">
                    {formatEuro(story.amount)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
