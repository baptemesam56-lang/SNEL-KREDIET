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

/**
 * Posts JSON to the primary Node.js / Express endpoint (e.g. /api/loan-application)
 * and automatically falls back to the PHP endpoint (e.g. /api/loan-application.php)
 * when hosted on shared web hosting (such as Hostinger hPanel) without Node routing.
 */
export async function submitApiPost(
  endpoint: string,
  payload: unknown
): Promise<{ response: Response; isJson: boolean; data: any }> {
  const primaryUrl = getApiUrl(endpoint);
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(primaryUrl, requestInit);
  let parsed = await safeParseJsonResponse(response);

  // If primary endpoint returned 404/405 or HTML (e.g. Hostinger static/PHP without rewrite), try .php handler
  if (!parsed.isJson || response.status === 404 || response.status === 405) {
    const phpEndpoint = endpoint.endsWith('.php') ? endpoint : `${endpoint}.php`;
    const phpUrl = getApiUrl(phpEndpoint);
    try {
      const phpResponse = await fetch(phpUrl, requestInit);
      const phpParsed = await safeParseJsonResponse(phpResponse);
      if (phpParsed.isJson) {
        return {
          response: phpResponse,
          isJson: true,
          data: phpParsed.data,
        };
      }
    } catch {
      // Fall through to return primary response details
    }
  }

  return {
    response,
    isJson: parsed.isJson,
    data: parsed.data,
  };
}
