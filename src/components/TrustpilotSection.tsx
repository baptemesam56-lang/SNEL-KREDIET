import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { CreditPurpose } from '../types';

export interface TrustpilotReview {
  id: string;
  author: string;
  initials: string;
  city: string;
  rating: 4 | 5;
  title: string;
  body: string;
  dateLabel: string;
  loanType: string;
  purpose: CreditPurpose;
}

const TRUSTPILOT_REVIEWS: TrustpilotReview[] = [
  {
    id: 'tp-1',
    author: 'Pieter Vermeulen',
    initials: 'PV',
    city: 'Antwerpen',
    rating: 5,
    title: 'Zeer vlotte en transparante afhandeling',
    body: 'Binnen 24 uur kreeg ik duidelijkheid over mijn aanvraag voor een renovatielening. Alle voorwaarden en het vaste JKP werden vooraf helder uitgelegd zonder verborgen kosten.',
    dateLabel: '2 dagen geleden',
    loanType: 'Renovatielening',
    purpose: 'verbouwing',
  },
  {
    id: 'tp-2',
    author: 'Sofie De Smet',
    initials: 'SD',
    city: 'Gent',
    rating: 5,
    title: 'Eindelijk één duidelijk maandbedrag',
    body: 'Via Snel Krediet kon ik drie lopende kredieten samenvoegen. Dat geeft enorm veel rust in mijn maandbudget. De adviseur in Brussel nam echt de tijd om alles rustig toe te lichten.',
    dateLabel: '5 dagen geleden',
    loanType: 'Hergroepering',
    purpose: 'hergroepering',
  },
  {
    id: 'tp-3',
    author: 'Thomas Peeters',
    initials: 'TP',
    city: 'Brussel',
    rating: 5,
    title: 'Gunstige autolening en snelle uitbetaling',
    body: 'Voor de aankoop van mijn hybride wagen kreeg ik een scherp vast tarief dat lager lag dan bij mijn eigen huisbank. Alles verliep 100% digitaal en veilig.',
    dateLabel: '1 week geleden',
    loanType: 'Autolening',
    purpose: 'auto',
  },
  {
    id: 'tp-4',
    author: 'Annelies Janssens',
    initials: 'AJ',
    city: 'Leuven',
    rating: 5,
    title: 'Discreet, professioneel en geen loze beloftes',
    body: 'Ik waardeerde vooral de eerlijkheid tijdens de financiële analyse. Geen druk om meteen te tekenen en een heel helder overzicht van alle vereiste documenten.',
    dateLabel: '2 weken geleden',
    loanType: 'Persoonlijke lening',
    purpose: 'persoonlijk',
  },
  {
    id: 'tp-5',
    author: 'Marc Van Der Linden',
    initials: 'MV',
    city: 'Hasselt',
    rating: 4,
    title: 'Goed persoonlijk advies bij zonnepanelen',
    body: 'Het verzamelen van de energieofferte duurde bij mij iets langer, maar het team van Snel Krediet bleef geduldig meedenken. Daarna werd het dossier vlot goedgekeurd.',
    dateLabel: '2 weken geleden',
    loanType: 'Energiekrediet',
    purpose: 'verbouwing',
  },
  {
    id: 'tp-6',
    author: 'Nadia El Amrani',
    initials: 'NE',
    city: 'Brugge',
    rating: 5,
    title: 'Snelle reactie en vriendelijke adviseurs',
    body: 'Na het invullen van de online simulatie werd ik dezelfde namiddag nog opgebeld met een concreet voorstel op maat. Zeer betrouwbare bemiddelaar.',
    dateLabel: '3 weken geleden',
    loanType: 'Persoonlijke lening',
    purpose: 'persoonlijk',
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, label: 'Uitstekend', percent: 89 },
  { stars: 4, label: 'Goed', percent: 8 },
  { stars: 3, label: 'Gemiddeld', percent: 2 },
  { stars: 2, label: 'Matig', percent: 1 },
  { stars: 1, label: 'Slecht', percent: 0 },
];

// Crisp Trustpilot Star Emblem SVG
const TrustpilotStarLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#00B67A"
      d="M12 1.5l3.09 6.63 7.28.94-5.34 5.05 1.36 7.21L12 17.81l-6.39 3.52 1.36-7.21L1.63 9.07l7.28-.94L12 1.5z"
    />
    <path fill="#005128" d="M12 17.81l3.31-1.82.78 4.13L12 17.81z" />
  </svg>
);

// 5-Square Trustpilot Star Bar
const TrustpilotStarsRow: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'sm',
}) => {
  const boxSize = size === 'md' ? 'w-6 h-6' : 'w-4.5 h-4.5';
  const starSize = size === 'md' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  return (
    <div className="inline-flex items-center gap-1" aria-label={`${rating} van de 5 sterren op Trustpilot`}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = rating >= index;
        const isPartial = !isFull && rating > index - 1;
        return (
          <div
            key={index}
            className={`${boxSize} relative flex items-center justify-center rounded-[2px] overflow-hidden ${
              isFull ? 'bg-[#00B67A]' : 'bg-[#DCDCE6]'
            }`}
          >
            {isPartial && (
              <div
                className="absolute inset-y-0 left-0 bg-[#00B67A]"
                style={{ width: `${Math.round((rating - (index - 1)) * 100)}%` }}
              />
            )}
            <svg viewBox="0 0 24 24" className={`${starSize} relative z-10 fill-white`} aria-hidden="true">
              <path d="M12 2l2.92 6.26 6.88.88-5.05 4.77 1.29 6.82L12 17.4l-6.04 3.33 1.29-6.82L2.2 9.14l6.88-.88L12 2z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

interface TrustpilotSectionProps {
  onStartApplication?: (purpose?: CreditPurpose) => void;
}

export const TrustpilotSection: React.FC<TrustpilotSectionProps> = ({ onStartApplication }) => {
  const [starFilter, setStarFilter] = useState<'all' | 5 | 4>('all');
  const [page, setPage] = useState<number>(0);

  const filteredReviews = useMemo(() => {
    if (starFilter === 'all') return TRUSTPILOT_REVIEWS;
    return TRUSTPILOT_REVIEWS.filter((r) => r.rating === starFilter);
  }, [starFilter]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const currentReviews = filteredReviews.slice(page * pageSize, (page + 1) * pageSize);

  const handleFilterChange = (val: 'all' | 5 | 4) => {
    setStarFilter(val);
    setPage(0);
  };

  return (
    <section id="trustpilot-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Banner Header */}
        <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 sm:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <TrustpilotStarLogo className="w-6 h-6 shrink-0" />
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display">
                Trustpilot
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#007A52] border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Uitstekend · 4,8 / 5
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Beoordelingen van geverifieerde kredietklanten
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Transparante feedback over onze dienstverlening, snelheid van dossieranalyse en persoonlijke begeleiding.
            </p>
          </div>

          {/* Right Summary Score Pill */}
          <div className="flex flex-wrap items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">Uitstekend</span>
                <TrustpilotStarsRow rating={4.8} size="md" />
              </div>
              <div className="text-xs text-slate-500">
                TrustScore <strong className="text-slate-900">4,8</strong> op 5 ·{' '}
                <strong className="text-slate-900">1.428</strong> beoordelingen
              </div>
            </div>
          </div>
        </div>

        {/* Main Body: Rating Breakdown + Review Cards */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Breakdown & Controls Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100">
            {/* 5-Star Distribution Bars */}
            <div className="lg:col-span-5 space-y-2 bg-slate-50/90 border border-slate-200/80 rounded-xl p-4">
              {RATING_BREAKDOWN.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-semibold text-slate-700 shrink-0">
                    {row.stars} {row.stars === 1 ? 'ster' : 'sterren'}
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00B67A] rounded-full transition-all duration-500"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-9 text-right font-semibold text-slate-600 tabular-nums">
                    {row.percent}%
                  </span>
                </div>
              ))}
            </div>

            {/* Filter & Trust Context */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C81]">
                  <ShieldCheck className="w-4 h-4 text-[#00B67A]" />
                  <span>Geverifieerde klantervaringen · FSMA Erkend Kredietbemiddelaar</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bezoekers waarderen vooral onze duidelijke uitleg over het vaste JKP, de snelle reactietijd binnen 24 werkuren en het vrijblijvende karakter van elke kredietsimulatie.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFilterChange('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      starFilter === 'all'
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Alle reviews ({TRUSTPILOT_REVIEWS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFilterChange(5)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      starFilter === 5
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    5 sterren
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFilterChange(4)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      starFilter === 4
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    4 sterren
                  </button>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 tabular-nums">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => (p > 0 ? p - 1 : totalPages - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                      aria-label="Vorige Trustpilot beoordelingen"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : 0))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                      aria-label="Volgende Trustpilot beoordelingen"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentReviews.map((review) => (
              <article
                key={review.id}
                className="bg-slate-50/70 hover:bg-white rounded-xl p-5 border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Stars & Verified row */}
                  <div className="flex items-center justify-between gap-2">
                    <TrustpilotStarsRow rating={review.rating} size="sm" />
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#007A52]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B67A]" />
                      <span>Geverifieerd</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {review.title}
                  </h3>

                  {/* Body */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{review.body}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                      {review.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate capitalize">{review.author}</div>
                      <div className="text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{review.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-semibold text-[#0F4C81]">{review.loanType}</span>
                    <span className="text-slate-400">{review.dateLabel}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Trustpilot Reassurance Strip */}
          {onStartApplication && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#0F4C81]/5 via-blue-50/70 to-emerald-50/50 border border-blue-200/70 rounded-xl p-4 sm:px-6">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <TrustpilotStarLogo className="w-7 h-7 shrink-0 hidden sm:block" />
                <div className="text-xs sm:text-sm text-slate-700">
                  <strong className="text-slate-900">4,8/5 klanttevredenheid:</strong> Ervaar zelf onze persoonlijke en vrijblijvende kredietbegeleiding.
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStartApplication()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-sm transition-colors shrink-0"
              >
                <span>Vrijblijvend aanvragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
