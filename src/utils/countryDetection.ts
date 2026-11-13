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
