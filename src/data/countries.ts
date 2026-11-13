export interface CountryOption {
  code: string; // ISO 3166-1 alpha-2
  name: string; // Dutch / international display name
  flag: string;
  dialCode: string;
  phonePlaceholder: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'BE', name: 'België / Belgique', flag: '🇧🇪', dialCode: '+32', phonePlaceholder: '470 12 34 56' },
  { code: 'NL', name: 'Nederland', flag: '🇳🇱', dialCode: '+31', phonePlaceholder: '6 12345678' },
  { code: 'FR', name: 'Frankrijk / France', flag: '🇫🇷', dialCode: '+33', phonePlaceholder: '6 12 34 56 78' },
  { code: 'LU', name: 'Luxemburg / Luxembourg', flag: '🇱🇺', dialCode: '+352', phonePlaceholder: '621 123 456' },
  { code: 'DE', name: 'Duitsland / Deutschland', flag: '🇩🇪', dialCode: '+49', phonePlaceholder: '151 23456789' },
  { code: 'CH', name: 'Zwitserland / Suisse', flag: '🇨🇭', dialCode: '+41', phonePlaceholder: '79 123 45 67' },
  { code: 'GB', name: 'Verenigd Koninkrijk', flag: '🇬🇧', dialCode: '+44', phonePlaceholder: '7700 900077' },
  { code: 'ES', name: 'Spanje / España', flag: '🇪🇸', dialCode: '+34', phonePlaceholder: '612 34 56 78' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', phonePlaceholder: '912 345 678' },
  { code: 'IT', name: 'Italië / Italia', flag: '🇮🇹', dialCode: '+39', phonePlaceholder: '312 345 6789' },
  { code: 'AT', name: 'Oostenrijk / Österreich', flag: '🇦🇹', dialCode: '+43', phonePlaceholder: '664 123456' },
  { code: 'PL', name: 'Polen / Polska', flag: '🇵🇱', dialCode: '+48', phonePlaceholder: '501 234 567' },
  { code: 'IE', name: 'Ierland / Ireland', flag: '🇮🇪', dialCode: '+353', phonePlaceholder: '85 123 4567' },
  { code: 'SE', name: 'Zweden / Sverige', flag: '🇸🇪', dialCode: '+46', phonePlaceholder: '70 123 45 67' },
  { code: 'DK', name: 'Denemarken / Danmark', flag: '🇩🇰', dialCode: '+45', phonePlaceholder: '20 12 34 56' },
  { code: 'NO', name: 'Noorwegen / Norge', flag: '🇳🇴', dialCode: '+47', phonePlaceholder: '412 34 567' },
  { code: 'MA', name: 'Marokko / Maroc', flag: '🇲🇦', dialCode: '+212', phonePlaceholder: '612 345678' },
  { code: 'DZ', name: 'Algerije / Algérie', flag: '🇩🇿', dialCode: '+213', phonePlaceholder: '551 23 45 67' },
  { code: 'TN', name: 'Tunesië / Tunisie', flag: '🇹🇳', dialCode: '+216', phonePlaceholder: '20 123 456' },
  { code: 'SN', name: 'Senegal / Sénégal', flag: '🇸🇳', dialCode: '+221', phonePlaceholder: '77 123 45 67' },
  { code: 'CI', name: 'Ivoorkust / Côte d’Ivoire', flag: '🇨🇮', dialCode: '+225', phonePlaceholder: '07 12 34 56 78' },
  { code: 'CM', name: 'Kameroen / Cameroun', flag: '🇨🇲', dialCode: '+237', phonePlaceholder: '671 23 45 67' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', dialCode: '+243', phonePlaceholder: '81 123 4567' },
  { code: 'US', name: 'Verenigde Staten', flag: '🇺🇸', dialCode: '+1', phonePlaceholder: '201 555 0123' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', phonePlaceholder: '514 555 0199' },
  { code: 'TR', name: 'Turkije / Türkiye', flag: '🇹🇷', dialCode: '+90', phonePlaceholder: '532 123 45 67' },
  { code: 'RO', name: 'Roemenië / România', flag: '🇷🇴', dialCode: '+40', phonePlaceholder: '712 345 678' },
  { code: 'GR', name: 'Griekenland / Greece', flag: '🇬🇷', dialCode: '+30', phonePlaceholder: '691 234 5678' },
  { code: 'OTHER', name: 'Andere land / International', flag: '🌍', dialCode: '+', phonePlaceholder: '+XX XXX XXX XXX' },
];

export function getCountryByCode(code?: string): CountryOption {
  if (!code) return COUNTRIES[0];
  const upper = code.toUpperCase();
  return COUNTRIES.find((c) => c.code === upper) || COUNTRIES[0];
}
