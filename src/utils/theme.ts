import { ColorTheme } from '../types';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  badge: string;
  primaryColor: string;
  navbarBg: string;
  navbarText: string;
  navbarBorder: string;
  heroBg: string;
  heroText: string;
  heroSubtitle: string;
  heroBadgeBg: string;
  heroBadgeText: string;
  heroBadgeBorder: string;
  ctaButton: string;
  ctaButtonText: string;
  accentText: string;
  calculatorHeaderBg: string;
  footerBg: string;
  logoVariant: 'light' | 'dark';
}

export const THEMES: Record<ColorTheme, ThemeConfig> = {
  'luminous-blue': {
    id: 'luminous-blue',
    name: 'Helder Wit & Saffierblauw',
    badge: 'TrustLoans Stijl',
    primaryColor: '#0F4C81',
    navbarBg: 'bg-white/95 backdrop-blur-md',
    navbarText: 'text-slate-900',
    navbarBorder: 'border-slate-200/80 shadow-xs',
    heroBg: 'bg-white text-slate-900 border-b border-slate-200/80',
    heroText: 'text-[#0F4C81]',
    heroSubtitle: 'text-slate-600',
    heroBadgeBg: 'bg-blue-50/80',
    heroBadgeText: 'text-[#0F4C81] font-semibold',
    heroBadgeBorder: 'border-blue-200/80',
    ctaButton: 'bg-[#0F4C81] hover:bg-[#0c3e6b] text-white shadow-md shadow-[#0F4C81]/25',
    ctaButtonText: 'text-white',
    accentText: 'text-[#0F4C81]',
    calculatorHeaderBg: 'from-[#0F4C81] to-[#0A355A]',
    footerBg: 'bg-[#0A355A]',
    logoVariant: 'dark',
  },
  'royal-navy': {
    id: 'royal-navy',
    name: 'Koninklijk Blauw & Smaragd',
    badge: 'Krediet Service Stijl',
    primaryColor: '#0F2B5C',
    navbarBg: 'bg-[#0B1E38]/95 backdrop-blur-md',
    navbarText: 'text-white',
    navbarBorder: 'border-slate-800',
    heroBg: 'bg-gradient-to-b from-[#08172C] via-[#0E2342] to-[#0A1A30] text-white border-b border-slate-800',
    heroText: 'text-white',
    heroSubtitle: 'text-slate-300',
    heroBadgeBg: 'bg-slate-800/90',
    heroBadgeText: 'text-emerald-400',
    heroBadgeBorder: 'border-slate-700',
    ctaButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/40',
    ctaButtonText: 'text-white',
    accentText: 'text-emerald-400',
    calculatorHeaderBg: 'from-[#08182D] to-[#0D264A]',
    footerBg: 'bg-[#071324]',
    logoVariant: 'light',
  },
  'emerald-gold': {
    id: 'emerald-gold',
    name: 'Privaat Bankieren Bosgroen & Goud',
    badge: 'Financial Services Stijl',
    primaryColor: '#064E3B',
    navbarBg: 'bg-[#063328]/95 backdrop-blur-md',
    navbarText: 'text-white',
    navbarBorder: 'border-emerald-900/80',
    heroBg: 'bg-gradient-to-b from-[#04241C] via-[#07362B] to-[#052B22] text-white border-b border-emerald-950',
    heroText: 'text-white',
    heroSubtitle: 'text-emerald-100/90',
    heroBadgeBg: 'bg-emerald-950/90',
    heroBadgeText: 'text-amber-400',
    heroBadgeBorder: 'border-emerald-700/60',
    ctaButton: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-950/40',
    ctaButtonText: 'text-slate-950',
    accentText: 'text-amber-400',
    calculatorHeaderBg: 'from-[#063328] to-[#0A4738]',
    footerBg: 'bg-[#04211A]',
    logoVariant: 'light',
  },
};
