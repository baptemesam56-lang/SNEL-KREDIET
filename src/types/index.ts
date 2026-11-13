export type PageId =
  | 'home'
  | 'over-ons'
  | 'diensten'
  | 'kredietmogelijkheden'
  | 'hoe-werkt-het'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'voorwaarden'
  | 'wettelijk';

export type ColorTheme = 'royal-navy' | 'luminous-blue' | 'emerald-gold';

export type CreditPurpose =
  | 'persoonlijk'
  | 'auto'
  | 'verbouwing'
  | 'hergroepering';

export interface CreditPurposeOption {
  id: CreditPurpose;
  title: string;
  shortDesc: string;
  minAmount: number;
  maxAmount: number;
  minMonths: number;
  maxMonths: number;
  indicativeJKP: number; // e.g. 5.99%
  badge: string;
}

export interface LoanCalculation {
  amount: number;
  durationMonths: number;
  purpose: CreditPurpose;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  jkp: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  countryCode?: string;
  subject: string;
  message: string;
  acceptedPrivacy: boolean;
  honeypot?: string;
}

export interface LoanApplicationData {
  amount: number;
  durationMonths: number;
  purpose: CreditPurpose;
  monthlyPayment: number;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  countryCode?: string;
  employmentType: 'bediende' | 'arbeider' | 'ambtenaar' | 'zelfstandige' | 'gepensioneerd' | 'andere';
  monthlyIncome: number;
  housingStatus: 'eigenaar' | 'huurder' | 'inwonend';
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  purpose: CreditPurpose;
  purposeLabel: string;
  amount: number;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
  avatarInitials: string;
  highlight: string;
}
