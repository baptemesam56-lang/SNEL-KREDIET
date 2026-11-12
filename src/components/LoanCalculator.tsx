import React, { useState, useMemo } from 'react';
import { CreditPurpose } from '../types';
import { CREDIT_PURPOSES, COMPANY_INFO } from '../data/content';
import {
  calculateLoan,
  formatEuro,
  generateAmortizationSchedule,
} from '../utils/calculator';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  BarChart3,
  TrendingDown,
  PieChart,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface LoanCalculatorProps {
  onStartApplication: (amount: number, duration: number, purpose: CreditPurpose) => void;
  initialPurpose?: CreditPurpose;
  initialAmount?: number;
  initialDuration?: number;
  compact?: boolean;
}

const CustomLoanChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const isStart = data.maand === 0;

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3.5 shadow-2xl text-white text-xs min-w-[240px] max-w-xs space-y-2.5 pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150">
      {/* Header with period */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-sky-300">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>{isStart ? 'Aanvang lening' : `Maand ${data.maand}`}</span>
          {data.jaar > 0 && (
            <span className="text-[10px] text-slate-400 font-normal">({data.jaar}e jaar)</span>
          )}
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded font-medium border border-slate-700/60">
          Vast tarief
        </span>
      </div>

      {/* Exact Monthly Breakdown */}
      {!isStart ? (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Exacte verdeling deze maand:
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] inline-block" />
              <span>Kapitaalaflossing:</span>
            </span>
            <strong className="text-sky-300 font-mono text-xs">{formatEuro(data.kapitaal)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Rentekosten (intrest):</span>
            </span>
            <strong className="text-amber-300 font-mono text-xs">{formatEuro(data.intrest)}</strong>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-slate-300 font-semibold">
            <span>Totale maandtermijn:</span>
            <span className="text-white font-mono">{formatEuro(data.kapitaal + data.intrest)}</span>
          </div>
        </div>
      ) : (
        <div className="text-slate-400 text-[11px] py-1">
          Startpunt van de lening. Nog geen maandelijkse aflossingen verricht.
        </div>
      )}

      {/* Cumulative Progress */}
      <div className="space-y-1 pt-1.5 border-t border-slate-800/80 text-[11px]">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Cumulatief tot deze datum:
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Reeds afgelost kapitaal:</span>
          <span className="font-semibold text-sky-200 font-mono">{formatEuro(data.cumulatiefKapitaal)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Reeds betaalde intrest:</span>
          <span className="font-semibold text-amber-200 font-mono">{formatEuro(data.cumulatiefIntrest)}</span>
        </div>
      </div>

      {/* Remaining Capital Balance */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
        <span className="text-[11px] text-slate-300 font-medium">Openstaand saldo:</span>
        <span className="text-xs font-bold font-mono text-emerald-400">
          {formatEuro(data.resterendSaldo)}
        </span>
      </div>
    </div>
  );
};

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  onStartApplication,
  initialPurpose = 'persoonlijk',
  initialAmount = 10000,
  initialDuration = 48,
  compact = false,
}) => {
  const [purpose, setPurpose] = useState<CreditPurpose>(initialPurpose);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [duration, setDuration] = useState<number>(initialDuration);
  const [activeTab, setActiveTab] = useState<'grafiek' | 'vergelijking' | 'aflossingstabel'>('grafiek');
  const [chartViewType, setChartViewType] = useState<'cumulatief' | 'maandelijks' | 'saldo'>('cumulatief');
  const [showFullTable, setShowFullTable] = useState<boolean>(false);

  const currentPurposeConfig = useMemo(() => {
    return CREDIT_PURPOSES.find((p) => p.id === purpose) || CREDIT_PURPOSES[0];
  }, [purpose]);

  // Adjust bounds if purpose changes
  const handlePurposeChange = (newPurpose: CreditPurpose) => {
    setPurpose(newPurpose);
    const targetConfig = CREDIT_PURPOSES.find((p) => p.id === newPurpose) || CREDIT_PURPOSES[0];
    if (amount < targetConfig.minAmount) setAmount(targetConfig.minAmount);
    if (amount > targetConfig.maxAmount) setAmount(targetConfig.maxAmount);
    if (duration < targetConfig.minMonths) setDuration(targetConfig.minMonths);
    if (duration > targetConfig.maxMonths) setDuration(targetConfig.maxMonths);
  };

  const calculation = useMemo(() => {
    return calculateLoan(amount, duration, purpose);
  }, [amount, duration, purpose]);

  // Schedule data for visualization
  const amortizationData = useMemo(() => {
    return generateAmortizationSchedule(amount, duration, purpose);
  }, [amount, duration, purpose]);

  // Recharts formatted dataset for principal vs interest over time
  const rechartsTimelineData = useMemo(() => {
    const pts = amortizationData.points;
    if (!pts || pts.length === 0) return [];

    // Sample points evenly so chart looks clean across all screen sizes
    const targetSteps = Math.min(16, duration);
    const step = Math.max(1, Math.floor(duration / targetSteps));

    const result: Array<{
      period: string;
      maand: number;
      jaar: number;
      kapitaal: number;
      intrest: number;
      cumulatiefKapitaal: number;
      cumulatiefIntrest: number;
      resterendSaldo: number;
      totaleAflossing: number;
    }> = [];

    // Start baseline
    result.push({
      period: 'Start',
      maand: 0,
      jaar: 0,
      kapitaal: 0,
      intrest: 0,
      cumulatiefKapitaal: 0,
      cumulatiefIntrest: 0,
      resterendSaldo: amount,
      totaleAflossing: 0,
    });

    for (let i = step - 1; i < pts.length; i += step) {
      const p = pts[i];
      result.push({
        period: `M${p.month}`,
        maand: p.month,
        jaar: p.year,
        kapitaal: Math.round(p.principalPayment),
        intrest: Math.round(p.interestPayment),
        cumulatiefKapitaal: Math.round(p.cumulativePrincipal),
        cumulatiefIntrest: Math.round(p.cumulativeInterest),
        resterendSaldo: Math.round(p.remainingBalance),
        totaleAflossing: Math.round(p.cumulativePrincipal + p.cumulativeInterest),
      });
    }

    const last = pts[pts.length - 1];
    if (result[result.length - 1].maand !== last.month) {
      result.push({
        period: `M${last.month}`,
        maand: last.month,
        jaar: last.year,
        kapitaal: Math.round(last.principalPayment),
        intrest: Math.round(last.interestPayment),
        cumulatiefKapitaal: Math.round(last.cumulativePrincipal),
        cumulatiefIntrest: Math.round(last.cumulativeInterest),
        resterendSaldo: 0,
        totaleAflossing: Math.round(last.cumulativePrincipal + last.cumulativeInterest),
      });
    }

    return result;
  }, [amortizationData, amount, duration]);

  // Comparison data for Recharts BarChart in Tab 2
  const comparisonDurations = [24, 36, 48, 60, 84].filter(
    (d) => d >= currentPurposeConfig.minMonths && d <= currentPurposeConfig.maxMonths
  );

  const rechartsComparisonData = useMemo(() => {
    return comparisonDurations.map((d) => {
      const altCalc = calculateLoan(amount, d, purpose);
      return {
        looptijd: `${d} mnd`,
        months: d,
        maandlast: Math.round(altCalc.monthlyPayment),
        kapitaal: amount,
        intrest: Math.round(altCalc.totalInterest),
        totaal: Math.round(altCalc.totalRepayment),
        isCurrent: d === duration,
      };
    });
  }, [comparisonDurations, amount, duration, purpose]);

  const amountPresets = [2500, 5000, 10000, 15000, 25000, 40000];
  const durationPresets = [24, 36, 48, 60, 84];

  // Capital vs Interest calculation
  const principalRatio = Math.round((amount / calculation.totalRepayment) * 100);
  const interestRatio = Math.max(0, 100 - principalRatio);

  return (
    <div
      id="kredietsimulator"
      className={`bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C81]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
              Interactieve Kredietsimulator België
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-1">
            Visualiseer uw lening en aflossingen over tijd
          </h3>
        </div>
        <div className="text-xs text-slate-500 bg-blue-50/80 text-[#0F4C81] px-3 py-1.5 rounded-lg border border-blue-200/80 flex items-center gap-1.5 self-start sm:self-auto font-medium">
          <Info className="w-3.5 h-3.5 text-[#0F4C81]" />
          <span>Vaste debetrentevoet gedurende de volledige looptijd</span>
        </div>
      </div>

      {/* Credit Purpose Tabs */}
      <div className="pt-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          1. Kies het type financiering
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CREDIT_PURPOSES.map((p) => {
            const isSelected = purpose === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePurposeChange(p.id)}
                className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-[#0F4C81] bg-blue-50/80 text-[#0F4C81] font-semibold ring-2 ring-[#0F4C81]/20 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="truncate">{p.title}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 block truncate font-normal">
                  Vanaf {p.indicativeJKP}% JKP
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls & Live Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left column: Sliders & presets */}
        <div className="lg:col-span-7 space-y-6">
          {/* Amount Slider */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="loan-amount-slider" className="text-sm font-semibold text-slate-900">
                2. Hoeveel wenst u te lenen?
              </label>
              <span className="text-2xl font-extrabold text-[#0F4C81] font-display tabular-nums">
                {formatEuro(amount)}
              </span>
            </div>

            <input
              id="loan-amount-slider"
              type="range"
              min={currentPurposeConfig.minAmount}
              max={currentPurposeConfig.maxAmount}
              step={250}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
            />

            <div className="flex justify-between text-xs text-slate-500 mt-1.5 tabular-nums">
              <span>Min. {formatEuro(currentPurposeConfig.minAmount)}</span>
              <span>Max. {formatEuro(currentPurposeConfig.maxAmount)}</span>
            </div>

            {/* Quick Amount Presets */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {amountPresets
                .filter(
                  (val) =>
                    val >= currentPurposeConfig.minAmount && val <= currentPurposeConfig.maxAmount
                )
                .map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors tabular-nums ${
                      amount === preset
                        ? 'bg-[#0F4C81] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatEuro(preset)}
                  </button>
                ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="pt-2">
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="loan-duration-slider" className="text-sm font-semibold text-slate-900">
                3. Gewenste terugbetalingstermijn
              </label>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#0F4C81] font-display tabular-nums">
                  {duration}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">maanden</span>
                <span className="text-xs text-slate-500 block">
                  ({(duration / 12).toFixed(duration % 12 === 0 ? 0 : 1)} jaar)
                </span>
              </div>
            </div>

            <input
              id="loan-duration-slider"
              type="range"
              min={currentPurposeConfig.minMonths}
              max={currentPurposeConfig.maxMonths}
              step={6}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
            />

            <div className="flex justify-between text-xs text-slate-500 mt-1.5 tabular-nums">
              <span>Min. {currentPurposeConfig.minMonths} maanden</span>
              <span>Max. {currentPurposeConfig.maxMonths} maanden</span>
            </div>

            {/* Quick Duration Presets */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {durationPresets
                .filter(
                  (val) =>
                    val >= currentPurposeConfig.minMonths && val <= currentPurposeConfig.maxMonths
                )
                .map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDuration(preset)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors tabular-nums ${
                      duration === preset
                        ? 'bg-[#0F4C81] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset} mnd ({preset / 12} j.)
                  </button>
                ))}
            </div>
          </div>

          {/* Capital vs Interest Interactive Breakdown Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#0F4C81]" />
                <span>Verhouding Kapitaal vs Interest:</span>
              </span>
              <span className="text-slate-500">
                Totaal terug: <strong className="text-slate-900">{formatEuro(calculation.totalRepayment)}</strong>
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${principalRatio}%` }}
                className="bg-[#0F4C81] h-full transition-all duration-300"
                title={`Geleend kapitaal: ${formatEuro(amount)} (${principalRatio}%)`}
              />
              <div
                style={{ width: `${interestRatio}%` }}
                className="bg-amber-400 h-full transition-all duration-300"
                title={`Totale rentekosten: ${formatEuro(calculation.totalInterest)} (${interestRatio}%)`}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0F4C81] inline-block" />
                <span>Kapitaal: <strong>{formatEuro(amount)}</strong> ({principalRatio}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>Rentekosten: <strong>{formatEuro(calculation.totalInterest)}</strong> ({interestRatio}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Result Box & Summary */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-[#0B2548] via-[#0F3666] to-[#164E87] text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 pb-3 border-b border-blue-400/20">
              <span className="font-semibold text-sky-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Vaste maandelijkse termijn
              </span>
              <span className="bg-blue-950/70 px-2.5 py-0.5 rounded text-[11px] text-blue-200 border border-blue-400/30">
                Belgisch tarief
              </span>
            </div>

            {/* Big Monthly Payment Display */}
            <div className="py-4">
              <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">
                U betaalt maandelijks:
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tabular-nums tracking-tight">
                {formatEuro(calculation.monthlyPayment)}
                <span className="text-sm font-normal text-blue-200 ml-1">/maand</span>
              </div>
            </div>

            {/* Financial Details Table */}
            <div className="space-y-2.5 text-xs text-slate-200 border-t border-blue-400/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Geleend kapitaal:</span>
                <span className="font-semibold text-white tabular-nums">{formatEuro(amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Looptijd:</span>
                <span className="font-semibold text-white tabular-nums">
                  {duration} maanden ({(duration / 12).toFixed(1)} jaar)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Indicatief JKP / Debetrente:</span>
                <span className="font-bold text-sky-300 tabular-nums">
                  {calculation.jkp}% (vast)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Totale interestkosten:</span>
                <span className="font-semibold text-white tabular-nums">
                  {formatEuro(calculation.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-400/20 font-semibold">
                <span className="text-blue-100">Totaal terug te betalen:</span>
                <span className="text-white text-base tabular-nums">
                  {formatEuro(calculation.totalRepayment)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-6 mt-4">
            <button
              type="button"
              onClick={() => onStartApplication(amount, duration, purpose)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg text-sm sm:text-base font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] border border-white/25 shadow-md shadow-blue-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span>Vrijblijvende Aanvraag Starten</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-[11px] text-slate-300 text-center mt-2 flex items-center justify-center gap-1.5">
              <span>Transparant JKP</span>
              <span>·</span>
              <span>100% Vrijblijvend</span>
              <span>·</span>
              <span>Antwoord binnen 24u</span>
            </div>
          </div>
        </div>
      </div>

      {/* VISUALIZATION SUITE: Recharts dynamic charts for Principal vs Interest over time */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0F4C81]" />
            <h4 className="text-lg font-bold text-slate-900 font-display">
              Dynamische Recharts Aflossingsanalyse
            </h4>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('grafiek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'grafiek'
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Verloop over de tijd</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vergelijking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'vergelijking'
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vergelijk Looptijden</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('aflossingstabel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'aflossingstabel'
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Aflossingstabel</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DYNAMIC RECHARTS AREA CHART - PRINCIPAL VS INTEREST OVER TIME */}
        {activeTab === 'grafiek' && (
          <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-3">
              <div>
                <span className="font-semibold text-slate-900 block sm:inline">
                  Verloop van kapitaalaflossing en intrest over {duration} maanden:
                </span>{' '}
                <span className="text-slate-500">
                  Beweeg over de grafiek om de exacte verdeling per maand te zien.
                </span>
              </div>

              {/* View Type Toggle */}
              <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs self-start sm:self-auto text-[11px]">
                <button
                  type="button"
                  onClick={() => setChartViewType('cumulatief')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    chartViewType === 'cumulatief'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cumulatief (€)
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewType('maandelijks')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    chartViewType === 'maandelijks'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Per maand (€)
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewType('saldo')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    chartViewType === 'saldo'
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resterend saldo
                </button>
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={rechartsTimelineData}
                  margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorPrincipalDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#0F4C81" stopOpacity={0.15} />
                    </linearGradient>
                    <linearGradient id="colorInterestDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.15} />
                    </linearGradient>
                    <linearGradient id="colorBalanceDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickFormatter={(val) => `€${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomLoanChartTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs text-slate-700 font-medium">
                        {value === 'cumulatiefKapitaal' || value === 'kapitaal'
                          ? `Geleend Kapitaal (${formatEuro(amount)})`
                          : value === 'cumulatiefIntrest' || value === 'intrest'
                          ? `Totale Rentekosten (${formatEuro(calculation.totalInterest)})`
                          : 'Openstaand Kapitaalsaldo'}
                      </span>
                    )}
                  />

                  {chartViewType === 'cumulatief' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="cumulatiefKapitaal"
                        name="cumulatiefKapitaal"
                        stackId="1"
                        stroke="#0F4C81"
                        strokeWidth={2.5}
                        activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#0F4C81' }}
                        fill="url(#colorPrincipalDetail)"
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulatiefIntrest"
                        name="cumulatiefIntrest"
                        stackId="1"
                        stroke="#D97706"
                        strokeWidth={2.5}
                        activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#D97706' }}
                        fill="url(#colorInterestDetail)"
                      />
                    </>
                  )}

                  {chartViewType === 'maandelijks' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="kapitaal"
                        name="kapitaal"
                        stroke="#0F4C81"
                        strokeWidth={2.5}
                        activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#0F4C81' }}
                        fill="url(#colorPrincipalDetail)"
                      />
                      <Area
                        type="monotone"
                        dataKey="intrest"
                        name="intrest"
                        stroke="#D97706"
                        strokeWidth={2.5}
                        activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#D97706' }}
                        fill="url(#colorInterestDetail)"
                      />
                    </>
                  )}

                  {chartViewType === 'saldo' && (
                    <Area
                      type="monotone"
                      dataKey="resterendSaldo"
                      name="resterendSaldo"
                      stroke="#0F4C81"
                      strokeWidth={3}
                      activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#0F4C81' }}
                      fill="url(#colorBalanceDetail)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C81]" />
                <span>
                  Kapitaalaflossing: <strong>{formatEuro(amount)}</strong> ({principalRatio}%)
                </span>
                <span className="text-slate-300">·</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>
                  Totale intrest: <strong>{formatEuro(calculation.totalInterest)}</strong> ({interestRatio}%)
                </span>
              </span>
              <span>Totale terugbetaling: <strong className="text-slate-900">{formatEuro(calculation.totalRepayment)}</strong></span>
            </div>
          </div>
        )}

        {/* TAB 2: RECHARTS STACKED BAR CHART - DURATION COMPARISON */}
        {activeTab === 'vergelijking' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
              <p>
                Vergelijk verschillende looptijden voor uw leenbedrag van <strong>{formatEuro(amount)}</strong>:
              </p>
              <span className="text-slate-500">
                Klik op een kaart om de simulator direct op die looptijd in te stellen.
              </span>
            </div>

            {/* Recharts BarChart comparing total payment & interest */}
            <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/90">
              <div className="text-xs font-bold text-slate-800 mb-2">
                Grafische vergelijking: Kapitaal vs Intrest per looptijd
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rechartsComparisonData}
                    margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="looptijd"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickFormatter={(val) => `€${Math.round(val / 1000)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        formatEuro(Number(val) || 0),
                        name === 'kapitaal' ? 'Geleend Kapitaal' : 'Totale Intrest',
                      ]}
                      labelFormatter={(label) => `Looptijd: ${label}`}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        fontSize: '12px',
                        color: '#F8FAFC',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      formatter={(val) => (
                        <span className="text-xs text-slate-700 font-medium">
                          {val === 'kapitaal' ? 'Kapitaal (Vast)' : 'Totale Intrestkosten'}
                        </span>
                      )}
                    />
                    <Bar
                      dataKey="kapitaal"
                      name="kapitaal"
                      stackId="a"
                      fill="#0F4C81"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="intrest"
                      name="intrest"
                      stackId="a"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clickable Duration Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {comparisonDurations.map((d) => {
                const altCalc = calculateLoan(amount, d, purpose);
                const isCurrent = duration === d;
                const monthlyDiff = altCalc.monthlyPayment - calculation.monthlyPayment;

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#0F4C81] bg-blue-50/70 ring-2 ring-[#0F4C81]/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{d} maanden</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#0F4C81] bg-blue-100 px-1.5 py-0.5 rounded">
                            Gekozen
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 font-display tabular-nums">
                        {formatEuro(altCalc.monthlyPayment)}
                        <span className="text-[11px] font-normal text-slate-500">/mnd</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] space-y-0.5 text-slate-500">
                      <div>Intrest: <strong className="text-slate-700">{formatEuro(altCalc.totalInterest)}</strong></div>
                      <div>Totaal: <strong className="text-slate-700">{formatEuro(altCalc.totalRepayment)}</strong></div>
                      {!isCurrent && (
                        <div className={`text-[10px] font-medium pt-1 ${monthlyDiff > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {monthlyDiff > 0 ? `+${formatEuro(monthlyDiff)}/mnd` : `${formatEuro(monthlyDiff)}/mnd`}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AMORTIZATION SCHEDULE TABLE (JAAR & MAAND) */}
        {activeTab === 'aflossingstabel' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Wettelijk amortisatieschema voor <strong>{formatEuro(amount)}</strong> over <strong>{duration} maanden</strong>:
              </span>
              <button
                type="button"
                onClick={() => setShowFullTable(!showFullTable)}
                className="text-xs font-semibold text-[#0F4C81] hover:underline flex items-center gap-1"
              >
                <span>{showFullTable ? 'Toon per jaar' : 'Toon alle maanden'}</span>
                {showFullTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/80 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{showFullTable ? 'Maand' : 'Jaar'}</th>
                    <th className="p-3 text-right">Maandlast / Totaal</th>
                    <th className="p-3 text-right">Kapitaalaflossing</th>
                    <th className="p-3 text-right">Rentekosten</th>
                    <th className="p-3 text-right">Resterend saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!showFullTable
                    ? amortizationData.yearly.map((y) => (
                        <tr key={y.year} className="hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-900">Jaar {y.year}</td>
                          <td className="p-3 text-right font-medium">{formatEuro(y.totalPaid)}</td>
                          <td className="p-3 text-right text-emerald-700 font-medium">{formatEuro(y.principalPaid)}</td>
                          <td className="p-3 text-right text-amber-700 font-medium">{formatEuro(y.interestPaid)}</td>
                          <td className="p-3 text-right font-bold text-slate-900">{formatEuro(y.endBalance)}</td>
                        </tr>
                      ))
                    : amortizationData.points.map((pt) => (
                        <tr key={pt.month} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-medium text-slate-800">Maand {pt.month}</td>
                          <td className="p-2.5 text-right font-medium">{formatEuro(pt.monthlyPayment)}</td>
                          <td className="p-2.5 text-right text-emerald-700 font-medium">{formatEuro(pt.principalPayment)}</td>
                          <td className="p-2.5 text-right text-amber-700 font-medium">{formatEuro(pt.interestPayment)}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">{formatEuro(pt.remainingBalance)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Belgian Legal Disclaimer Box */}
      <div className="mt-8 p-3.5 rounded-xl bg-amber-500/10 border border-amber-600/20 text-[11px] sm:text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950 block uppercase tracking-wide">
            {COMPANY_INFO.legalDisclaimer}
          </strong>
          <span className="text-slate-600">
            Kredietvorm: Lening op afbetaling. Onder voorbehoud van aanvaarding van uw dossier door de kredietgever en wederzijds akkoord. De simulatie is louter indicatief en vormt geen bindend kredietaanbod conform het Belgisch Wetboek van economisch recht (Boek VII).
          </span>
        </div>
      </div>
    </div>
  );
};
