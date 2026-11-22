export const FORMBOLD_ENDPOINT =
  ((import.meta as any).env?.VITE_FORMBOLD_ENDPOINT || '').trim() ||
  'https://formbold.com/s/3AblB';

const EMAIL_FORMAT_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email address strictly (disallows spaces, consecutive dots,
 * missing domain/TLD, or single-character TLDs) and returns a localized nl-BE
 * error message when invalid, or null when valid.
 */
export function getEmailValidationError(rawEmail: string): string | null {
  const trimmed = rawEmail.trim();
  if (!trimmed) {
    return 'Gelieve een e-mailadres in te vullen.';
  }
  if (/\s/.test(trimmed)) {
    return 'Een e-mailadres mag geen spaties bevatten.';
  }
  if (trimmed.length > 254) {
    return 'Het opgegeven e-mailadres is te lang.';
  }
  if (trimmed.includes('..')) {
    return 'Het e-mailadres bevat opeenvolgende punten en is ongeldig.';
  }
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) {
    return 'Gelieve een geldig e-mailadres op te geven (bijv. naam@domein.be).';
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.length > 64) {
    return 'Gelieve een geldig e-mailadres op te geven (bijv. naam@domein.be).';
  }

  if (!EMAIL_FORMAT_REGEX.test(trimmed)) {
    return 'Gelieve een geldig e-mailadres op te geven (bijv. naam@domein.be).';
  }

  const tld = domainPart.split('.').pop() || '';
  if (tld.length < 2 || /^\d+$/.test(tld)) {
    return 'Gelieve een geldige domeinextensie op te geven (bijv. .be, .nl, .com).';
  }

  return null;
}

export function isValidEmail(rawEmail: string): boolean {
  return getEmailValidationError(rawEmail) === null;
}

export interface FormBoldSubmission {
  Email: string;
  message: string;
  _subject?: string;
  formType: 'contact' | 'loan_application';
  reference?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  countryCode?: string;
  subject?: string;
  amount?: string;
  duration?: string;
  purpose?: string;
  monthlyPayment?: string;
  jkp?: string;
  totalRepayment?: string;
  monthlyIncome?: string;
  housingStatus?: string;
  employmentType?: string;
  submittedAt?: string;
}

/**
 * Sends a redundant backup submission to FormBold (https://formbold.com/s/3AblB)
 * using the `Email` and `message` fields alongside structured dossier metadata.
 * Enforces email format validation before dispatching and never throws so
 * primary/secondary failover remains resilient.
 */
export async function submitToFormBold(
  payload: FormBoldSubmission
): Promise<{ ok: boolean; status?: number }> {
  const cleanEmail = (payload.Email || '').trim();
  if (!isValidEmail(cleanEmail)) {
    return { ok: false };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(FORMBOLD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        Email: cleanEmail,
        submittedAt: payload.submittedAt || new Date().toISOString(),
        source: 'snelkrediet.eu',
      }),
      signal: controller.signal,
    });

    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
