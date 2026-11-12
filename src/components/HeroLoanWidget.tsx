import React, { useState, useMemo } from 'react';
import { CreditPurpose } from '../types';
import { CREDIT_PURPOSES } from '../data/content';
import { calculateLoan, formatEuro, generateAmortizationSchedule } from '../utils/calculator';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BarChart2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface HeroLoanWidgetProps {
  onStartApplication: (amount: number, duration: number, purpose: CreditPurpose) => void;
  onExploreDetails?: () => void;
}

const CustomHeroChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const isStart = data.maand === 0;

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3 shadow-2xl text-white text-[11px] min-w-[210px] space-y-2 pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-bold text-sky-300">
          {isStart ? 'Aanvang lening' : `Maand ${data.maand}`}
        </span>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
          Vast tarief
        </span>
      </div>

      {!isStart ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              <span>Kapitaal (deze maand):</span>
            </span>
            <strong className="text-white font-mono">{formatEuro(data.kapitaal)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Intrest (deze maand):</span>
            </span>
            <strong className="text-amber-300 font-mono">{formatEuro(data.intrest)}</strong>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80 text-[10px]">
            <span>Reeds afgelost kapitaal:</span>
            <span className="font-semibold text-slate-200 font-mono">{formatEuro(data.cumulatiefKapitaal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Reeds betaalde intrest:</span>
            <span className="font-semibold text-amber-200 font-mono">{formatEuro(data.cumulatiefIntrest)}</span>
          </div>
        </div>
      ) : (
        <div className="text-slate-400 text-[10px]">Startpunt van de lening.</div>
      )}

      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg">
        <span className="text-[10px] text-slate-300">Resterend openstaand saldo:</span>
        <span className="text-xs font-bold font-mono text-emerald-400">
          {formatEuro(data.resterendSaldo)}
        </span>
      </div>
    </div>
  );
};

export const HeroLoanWidget: React.FC<HeroLoanWidgetProps> = ({
  onStartApplication,
  onExploreDetails,
}) => {
  const [purpose, setPurpose] = useState<CreditPurpose>('persoonlijk');
  const [amount, setAmount] = useState<number>(10000);
  const [duration, setDuration] = useState<number>(48);
  const [showChart, setShowChart] = useState<boolean>(true);
  const [chartMode, setChartMode] = useState<'cumulatief' | 'maandelijks'>('cumulatief');

  const currentPurposeConfig = useMemo(() => {
    return CREDIT_PURPOSES.find((p) => p.id === purpose) || CREDIT_PURPOSES[0];
  }, [purpose]);

  const calculation = useMemo(() => {
    return calculateLoan(amount, duration, purpose);
  }, [amount, duration, purpose]);

  // Handle purpose change and clamp bounds
  const handlePurposeChange = (newPurpose: CreditPurpose) => {
    setPurpose(newPurpose);
    const targetConfig = CREDIT_PURPOSES.find((p) => p.id === newPurpose) || CREDIT_PURPOSES[0];
    if (amount < targetConfig.minAmount) setAmount(targetConfig.minAmount);
    if (amount > targetConfig.maxAmount) setAmount(targetConfig.maxAmount);
    if (duration < targetConfig.minMonths) setDuration(targetConfig.minMonths);
    if (duration > targetConfig.maxMonths) setDuration(targetConfig.maxMonths);
  };

  const principalRatio = Math.round((amount / calculation.totalRepayment) * 100);
  const interestRatio = 100 - principalRatio;

  const quickAmounts = [5000, 10000, 20000, 35000];

  // Dynamic Recharts data generation for Principal vs Interest over time
  const timelineData = useMemo(() => {
    const { points } = generateAmortizationSchedule(amount, duration, purpose);
    if (!points || points.length === 0) return [];

    // Sample roughly 10-14 data points evenly for a clean, legible mobile & desktop chart
    const targetSampleCount = Math.min(12, duration);
    const step = Math.max(1, Math.floor(duration / targetSampleCount));
    const sampledPoints: Array<{
      monthLabel: string;
      maand: number;
      kapitaal: number;
      intrest: number;
      cumulatiefKapitaal: number;
      cumulatiefIntrest: number;
      resterendSaldo: number;
    }> = [];

    // Always include month 0 / start
    sampledPoints.push({
      monthLabel: 'Start',
      maand: 0,
      kapitaal: 0,
      intrest: 0,
      cumulatiefKapitaal: 0,
      cumulatiefIntrest: 0,
      resterendSaldo: amount,
    });

    for (let i = step - 1; i < points.length; i += step) {
      const pt = points[i];
      sampledPoints.push({
        monthLabel: `M${pt.month}`,
        maand: pt.month,
        kapitaal: Math.round(pt.principalPayment),
        intrest: Math.round(pt.interestPayment),
        cumulatiefKapitaal: Math.round(pt.cumulativePrincipal),
        cumulatiefIntrest: Math.round(pt.cumulativeInterest),
        resterendSaldo: Math.round(pt.remainingBalance),
      });
    }

    // Ensure the final month is strictly present
    const lastPoint = points[points.length - 1];
    if (sampledPoints[sampledPoints.length - 1].maand !== lastPoint.month) {
      sampledPoints.push({
        monthLabel: `M${lastPoint.month}`,
        maand: lastPoint.month,
        kapitaal: Math.round(lastPoint.principalPayment),
        intrest: Math.round(lastPoint.interestPayment),
        cumulatiefKapitaal: Math.round(lastPoint.cumulativePrincipal),
        cumulatiefIntrest: Math.round(lastPoint.cumulativeInterest),
        resterendSaldo: 0,
      });
    }

    return sampledPoints;
  }, [amount, duration, purpose]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 transition-all hover:shadow-3xl">
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-[#0F4C81] via-[#165a96] to-[#0A355A] text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-sky-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
              Direct Online Berekenen
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display leading-tight">
              Kredietsimulator België
            </h3>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] bg-white/10 px-2.5 py-1 rounded-full border border-white/20 text-blue-100 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
          <span>Vaste Rente</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Purpose pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            1. Kies type krediet
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {CREDIT_PURPOSES.map((p) => {
              const isSelected = purpose === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePurposeChange(p.id)}
                  className={`px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'border-[#0F4C81] bg-blue-50/80 text-[#0F4C81] ring-1 ring-[#0F4C81]/30 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="truncate">{p.title}</div>
                  <div className="text-[10px] font-normal text-slate-500 truncate">
                    Vanaf {p.indicativeJKP}% JKP
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loan Amount Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Leenbedrag:</span>
            <span className="text-xl font-extrabold text-[#0F4C81] font-display tabular-nums">
              {formatEuro(amount)}
            </span>
          </div>

          <input
            type="range"
            min={currentPurposeConfig.minAmount}
            max={currentPurposeConfig.maxAmount}
            step={250}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
            aria-label="Leenbedrag aanpassen"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {quickAmounts
              .filter((q) => q >= currentPurposeConfig.minAmount && q <= currentPurposeConfig.maxAmount)
              .map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors tabular-nums ${
                    amount === q
                      ? 'bg-[#0F4C81] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {formatEuro(q)}
                </button>
              ))}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Looptijd:</span>
            <span className="text-base font-bold text-slate-900 font-display tabular-nums">
              {duration} maanden <span className="text-xs font-normal text-slate-500">({(duration / 12).toFixed(1)} j.)</span>
            </span>
          </div>

          <input
            type="range"
            min={currentPurposeConfig.minMonths}
            max={currentPurposeConfig.maxMonths}
            step={6}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
            aria-label="Looptijd aanpassen"
          />

          <div className="flex justify-between text-[10px] text-slate-500 tabular-nums">
            <span>{currentPurposeConfig.minMonths} mnd</span>
            <span>{currentPurposeConfig.maxMonths} mnd</span>
          </div>
        </div>

        {/* Visual Monthly Payment Showcase */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0B2548] via-[#0F3666] to-[#164E87] text-white space-y-3 shadow-md">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-sky-200 block">
                Geschatte maandlast
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums tracking-tight">
                {formatEuro(calculation.monthlyPayment)}
                <span className="text-xs font-normal text-sky-200 ml-1">/maand</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-blue-200 block">Vast JKP:</span>
              <span className="text-sm font-bold text-sky-300 tabular-nums">{calculation.jkp}%</span>
            </div>
          </div>

          {/* Interactive Visual Breakdown Bar */}
          <div className="pt-2 border-t border-blue-400/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-blue-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
                <span>Kapitaal: <strong>{principalRatio}%</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Intrest: <strong>{interestRatio}%</strong></span>
              </span>
            </div>
            <div className="w-full h-2 bg-blue-950/80 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${principalRatio}%` }}
                className="bg-sky-400 h-full transition-all duration-300"
                title={`Geleend kapitaal: ${formatEuro(amount)}`}
              />
              <div
                style={{ width: `${interestRatio}%` }}
                className="bg-amber-400 h-full transition-all duration-300"
                title={`Totale interest: ${formatEuro(calculation.totalInterest)}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-blue-200 pt-0.5">
              <span>Totaal terug: <strong>{formatEuro(calculation.totalRepayment)}</strong></span>
              <span>Intrest: <strong>{formatEuro(calculation.totalInterest)}</strong></span>
            </div>
          </div>
        </div>

        {/* DYNAMIC RECHARTS VISUALIZATION: Breakdown of Principal vs Interest over time */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#0F4C81]" />
              <span className="text-xs font-bold text-slate-900">
                Verloop Kapitaal vs Intrest over tijd
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setChartMode(chartMode === 'cumulatief' ? 'maandelijks' : 'cumulatief')}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[#0F4C81] border border-slate-200 font-medium transition-colors shadow-2xs"
                title="Wissel grafiekweergave"
              >
                {chartMode === 'cumulatief' ? 'Cumulatief' : 'Per maand'}
              </button>
              <button
                type="button"
                onClick={() => setShowChart(!showChart)}
                className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors"
                aria-label={showChart ? 'Grafiek inklappen' : 'Grafiek uitklappen'}
              >
                {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showChart && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-300">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineData}
                    margin={{ top: 8, right: 10, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="widgetColorPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0.15} />
                      </linearGradient>
                      <linearGradient id="widgetColorInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="monthLabel"
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      tickFormatter={(val) => `€${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomHeroChartTooltip />} />
                    {chartMode === 'cumulatief' ? (
                      <>
                        <Area
                          type="monotone"
                          dataKey="cumulatiefKapitaal"
                          name="cumulatiefKapitaal"
                          stackId="1"
                          stroke="#0F4C81"
                          strokeWidth={2}
                          activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2, fill: '#0F4C81' }}
                          fill="url(#widgetColorPrincipal)"
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulatiefIntrest"
                          name="cumulatiefIntrest"
                          stackId="1"
                          stroke="#D97706"
                          strokeWidth={2}
                          activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2, fill: '#D97706' }}
                          fill="url(#widgetColorInterest)"
                        />
                      </>
                    ) : (
                      <>
                        <Area
                          type="monotone"
                          dataKey="kapitaal"
                          name="kapitaal"
                          stroke="#0F4C81"
                          strokeWidth={2}
                          activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2, fill: '#0F4C81' }}
                          fill="url(#widgetColorPrincipal)"
                        />
                        <Area
                          type="monotone"
                          dataKey="intrest"
                          name="intrest"
                          stroke="#D97706"
                          strokeWidth={2}
                          activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2, fill: '#D97706' }}
                          fill="url(#widgetColorInterest)"
                        />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Insight Caption */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C81] inline-block" />
                    <span>Kapitaal ({formatEuro(amount)})</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Intrest ({formatEuro(calculation.totalInterest)})</span>
                  </span>
                </div>
                <span className="text-slate-400">
                  {chartMode === 'cumulatief' ? 'Cumulatief verloop' : 'Per maand verloop'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onStartApplication(amount, duration, purpose)}
            className="w-full py-3 px-4 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] border border-white/30 shadow-md shadow-blue-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Aanvraag Starten met deze Simulatie</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Micro Guarantee footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>100% Vrijblijvend</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Antwoord binnen 24u</span>
          </span>
          {onExploreDetails && (
            <button
              type="button"
              onClick={onExploreDetails}
              className="text-[#0F4C81] hover:underline font-semibold"
            >
              Uitgebreide analyse ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
