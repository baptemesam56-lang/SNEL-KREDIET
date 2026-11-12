import { CreditPurpose, LoanCalculation } from '../types';
import { CREDIT_PURPOSES } from '../data/content';

export function calculateLoan(
  amount: number,
  durationMonths: number,
  purpose: CreditPurpose
): LoanCalculation {
  const purposeConfig = CREDIT_PURPOSES.find((p) => p.id === purpose) || CREDIT_PURPOSES[0];
  
  // Rate adjustment slightly based on duration and amount for realistic market accuracy
  let jkp = purposeConfig.indicativeJKP;
  if (amount >= 25000) {
    jkp = Math.max(3.99, jkp - 0.5);
  } else if (amount < 3000) {
    jkp = jkp + 1.2;
  }

  // Monthly interest rate
  const monthlyRate = jkp / 100 / 12;
  
  // Monthly annuity formula: P * (r / (1 - (1+r)^(-n)))
  const monthlyPayment =
    monthlyRate > 0
      ? (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -durationMonths))
      : amount / durationMonths;

  const totalRepayment = monthlyPayment * durationMonths;
  const totalInterest = Math.max(0, totalRepayment - amount);

  return {
    amount,
    durationMonths,
    purpose,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    jkp: Math.round(jkp * 100) / 100,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-BE').format(value);
}

export interface AmortizationPoint {
  month: number;
  year: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface YearlyAmortizationSummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endBalance: number;
}

export function generateAmortizationSchedule(
  amount: number,
  durationMonths: number,
  purpose: CreditPurpose
): {
  points: AmortizationPoint[];
  yearly: YearlyAmortizationSummary[];
} {
  const calc = calculateLoan(amount, durationMonths, purpose);
  const monthlyRate = calc.jkp / 100 / 12;
  const monthlyPayment = calc.monthlyPayment;

  const points: AmortizationPoint[] = [];
  const yearlyMap = new Map<number, { principal: number; interest: number; endBalance: number }>();

  let currentBalance = amount;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let m = 1; m <= durationMonths; m++) {
    const interestPayment = currentBalance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;

    // Last month adjustment for rounding
    if (m === durationMonths || principalPayment > currentBalance) {
      principalPayment = currentBalance;
    }

    currentBalance = Math.max(0, currentBalance - principalPayment);
    cumulativePrincipal += principalPayment;
    cumulativeInterest += interestPayment;

    const currentYear = Math.ceil(m / 12);

    points.push({
      month: m,
      year: currentYear,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      principalPayment: Math.round(principalPayment * 100) / 100,
      interestPayment: Math.round(interestPayment * 100) / 100,
      remainingBalance: Math.round(currentBalance * 100) / 100,
      cumulativePrincipal: Math.round(cumulativePrincipal * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
    });

    const existingYear = yearlyMap.get(currentYear) || { principal: 0, interest: 0, endBalance: currentBalance };
    existingYear.principal += principalPayment;
    existingYear.interest += interestPayment;
    existingYear.endBalance = currentBalance;
    yearlyMap.set(currentYear, existingYear);
  }

  const yearly: YearlyAmortizationSummary[] = Array.from(yearlyMap.entries()).map(([year, data]) => ({
    year,
    principalPaid: Math.round(data.principal * 100) / 100,
    interestPaid: Math.round(data.interest * 100) / 100,
    totalPaid: Math.round((data.principal + data.interest) * 100) / 100,
    endBalance: Math.round(data.endBalance * 100) / 100,
  }));

  return { points, yearly };
}

