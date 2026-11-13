import { COUNTRIES, CountryOption, getCountryByCode } from '../data/countries';

export interface GeoDetectionResult {
  country: CountryOption;
  method: 'server-geo' | 'ip-api' | 'browser-timezone' | 'default';
}

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Europe/Brussels': 'BE',
  'Europe/Amsterdam': 'NL',
  'Europe/Paris': 'FR',
  'Europe/Luxembourg': 'LU',
  'Europe/Berlin': 'DE',
  'Europe/Busingen': 'DE',
  'Europe/Zurich': 'CH',
  'Europe/London': 'GB',
  'Europe/Madrid': 'ES',
  'Atlantic/Canary': 'ES',
  'Europe/Lisbon': 'PT',
  'Europe/Rome': 'IT',
  'Europe/Vienna': 'AT',
  'Europe/Warsaw': 'PL',
  'Europe/Dublin': 'IE',
  'Europe/Stockholm': 'SE',
  'Europe/Copenhagen': 'DK',
  'Europe/Oslo': 'NO',
  'Europe/Bucharest': 'RO',
  'Europe/Athens': 'GR',
  'Europe/Istanbul': 'TR',
  'Africa/Casablanca': 'MA',
  'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  'Africa/Dakar': 'SN',
  'Africa/Abidjan': 'CI',
  'Africa/Douala': 'CM',
  'Africa/Kinshasa': 'CD',
  'Africa/Lubumbashi': 'CD',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Montreal': 'CA',
};

function detectFromBrowserLocale(): CountryOption | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_COUNTRY[tz]) {
      return getCountryByCode(TIMEZONE_TO_COUNTRY[tz]);
    }

    const lang = navigator.language || '';
    const parts = lang.split('-');
    if (parts.length === 2) {
      const regionCode = parts[1].toUpperCase();
      const matched = COUNTRIES.find((c) => c.code === regionCode);
      if (matched) return matched;
    }
  } catch {
    // Ignore browser locale detection failures
  }
  return null;
}

export function getApiUrl(path: string): string {
  const base = ((import.meta as any).env?.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export function formatInternationalPhone(dialCode: string, localNumber: string): string {
  const trimmed = localNumber.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+') || trimmed.startsWith('00')) {
    return trimmed;
  }
  const cleanDial = dialCode === '+' ? '+' : dialCode;
  if (cleanDial === '+') {
    return trimmed;
  }
  // Remove a single leading zero when combining with international dial code (e.g., 0470... -> +32 470...)
  const normalizedLocal = trimmed.startsWith('0') ? trimmed.slice(1).trim() : trimmed;
  return `${cleanDial} ${normalizedLocal}`;
}

export async function detectVisitorCountry(): Promise<GeoDetectionResult> {
  // 1. Try backend /api/geo endpoint (inspects Cloud Run / proxy headers + IP)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(getApiUrl('/api/geo'), { signal: controller.signal });
    clearTimeout(timeoutId);

    const parsed = await safeParseJsonResponse(res);
    if (res.ok && parsed.isJson && parsed.data?.countryCode && parsed.data.countryCode !== 'XX' && parsed.data.source !== 'default') {
      const matched = COUNTRIES.find((c) => c.code === String(parsed.data.countryCode).toUpperCase());
      if (matched) {
        return { country: matched, method: 'server-geo' };
      }
    }
  } catch {
    // Fallback to client IP lookup
  }

  // 2. Try client-side public IP lookup (works even when site is behind static/CDN or local)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const parsed = await safeParseJsonResponse(res);
      if (parsed.isJson && parsed.data?.success && parsed.data?.country_code) {
        const matched = COUNTRIES.find((c) => c.code === String(parsed.data.country_code).toUpperCase());
        if (matched) {
          return { country: matched, method: 'ip-api' };
        }
      }
    }
  } catch {
    // Fallback to browser timezone / language
  }

  // 3. Browser timezone & locale heuristic
  const browserMatched = detectFromBrowserLocale();
  if (browserMatched) {
    return { country: browserMatched, method: 'browser-timezone' };
  }

  // 4. Default Belgium
  return { country: COUNTRIES[0], method: 'default' };
}

export async function safeParseJsonResponse(response: Response): Promise<{
  isJson: boolean;
  data: any;
  rawText: string;
}> {
  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';
  if (!rawText) {
    return { isJson: false, data: null, rawText: '' };
  }
  if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(rawText);
      return { isJson: true, data: parsed, rawText };
    } catch {
      return { isJson: false, data: null, rawText };
    }
  }
  return { isJson: false, data: null, rawText };
}
