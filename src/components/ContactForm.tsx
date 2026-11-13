import React, { useState, useEffect, useCallback } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Globe,
  LocateFixed,
  Mail,
  Phone,
} from 'lucide-react';
import { ContactFormData } from '../types';
import { COMPANY_INFO } from '../data/content';
import { COUNTRIES, getCountryByCode } from '../data/countries';
import {
  detectVisitorCountry,
  formatInternationalPhone,
  getApiUrl,
  safeParseJsonResponse,
} from '../utils/countryDetection';

interface ContactFormProps {
  onSuccess?: () => void;
  defaultSubject?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  defaultSubject = 'Algemene vraag over kredietmogelijkheden',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    country: COUNTRIES[0].name,
    countryCode: COUNTRIES[0].code,
    subject: defaultSubject,
    message: '',
    acceptedPrivacy: false,
    honeypot: '',
  });

  const [countryCode, setCountryCode] = useState<string>('BE');
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>('BE');
  const [dialOverridden, setDialOverridden] = useState<boolean>(false);
  const [autoDetectCountry, setAutoDetectCountry] = useState<boolean>(true);
  const [isDetectingCountry, setIsDetectingCountry] = useState<boolean>(false);
  const [detectionMessage, setDetectionMessage] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedCountry = getCountryByCode(countryCode);
  const selectedPhoneCountry = getCountryByCode(phoneCountryCode);
  const fullInternationalPhone = formData.phone.trim()
    ? formatInternationalPhone(selectedPhoneCountry.dialCode, formData.phone)
    : '';

  const runCountryDetection = useCallback(
    async (forceUpdateDial = false) => {
      setIsDetectingCountry(true);
      try {
        const result = await detectVisitorCountry();
        setCountryCode(result.country.code);
        if (forceUpdateDial || !dialOverridden) {
          setPhoneCountryCode(result.country.code);
        }
        setFormData((prev) => ({
          ...prev,
          country: result.country.name,
          countryCode: result.country.code,
        }));
        const sourceLabel =
          result.method === 'default'
            ? `Standaard geselecteerd: ${result.country.flag} ${result.country.name}`
            : `Automatisch gedetecteerd: ${result.country.flag} ${result.country.name} (${result.country.dialCode})`;
        setDetectionMessage(sourceLabel);
      } catch {
        setDetectionMessage('Selecteer uw land handmatig in de lijst.');
      } finally {
        setIsDetectingCountry(false);
      }
    },
    [dialOverridden]
  );

  useEffect(() => {
    if (autoDetectCountry) {
      runCountryDetection(false);
    }
  }, [autoDetectCountry, runCountryDetection]);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (!dialOverridden) {
      setPhoneCountryCode(newCode);
    }
    const c = getCountryByCode(newCode);
    setFormData((prev) => ({
      ...prev,
      country: c.name,
      countryCode: c.code,
    }));
    setDetectionMessage(`Geselecteerd land: ${c.flag} ${c.name} (${c.dialCode})`);
  };

  const subjectOptions = [
    'Algemene vraag over kredietmogelijkheden',
    'Informatie over persoonlijke lening',
    'Vraag over autolening of financiering',
    'Renovatielening & energiekrediet',
    'Kredietsamenvoeging / hergroepering',
    'Vraag over een lopende aanvraag',
    'Andere vraag',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot trap
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage('Gelieve uw voor- en achternaam in te vullen.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Gelieve een geldig e-mailadres in te vullen.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Gelieve een duidelijk bericht van minimaal 10 tekens in te vullen.');
      return;
    }

    if (!formData.acceptedPrivacy) {
      setErrorMessage('U dient akkoord te gaan met het privacybeleid om uw bericht te kunnen verzenden.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: fullInternationalPhone,
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const parsed = await safeParseJsonResponse(response);

      if (!parsed.isJson) {
        throw new Error(
          `De contactserver gaf een onverwacht antwoord (HTTP ${response.status}). U kunt rechtstreeks mailen naar contact@snelkrediet.eu of bellen via ${COMPANY_INFO.phone}.`
        );
      }

      if (!response.ok || !parsed.data?.success) {
        throw new Error(parsed.data?.error || 'Er is een fout opgetreden bij het verzenden.');
      }

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Contact submission error:', err);
      const rawMsg = typeof err?.message === 'string' ? err.message : '';
      const isParseError =
        rawMsg.includes('Unexpected token') ||
        rawMsg.includes('expected pattern') ||
        rawMsg.includes('JSON');

      setErrorMessage(
        isParseError
          ? `Verbinding met de e-mailserver is tijdelijk onderbroken. Stuur uw vraag rechtstreeks naar contact@snelkrediet.eu of bel ${COMPANY_INFO.phone}.`
          : rawMsg ||
              'Verzending mislukt. Gelieve later opnieuw te proberen of direct contact op te nemen via contact@snelkrediet.eu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillTest = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: 'Marc Vandermeersch',
      email: 'aceromatin173@gmail.com',
      phone: selectedPhoneCountry.phonePlaceholder,
      subject: 'Informatie over persoonlijke lening',
      message:
        'Goedendag, ik wil graag advies inwinnen over een persoonlijke lening voor verbouwingswerken en de aankoop van een wagen. Kunt u mij contacteren met een vrijblijvende offerte?',
      acceptedPrivacy: true,
      honeypot: '',
    }));
    setErrorMessage('');
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      subject: defaultSubject,
      message: '',
      acceptedPrivacy: false,
      honeypot: '',
    });
    setIsSubmitted(false);
    setErrorMessage('');
  };

  if (isSubmitted) {
    return (
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-14 h-14 bg-blue-100 text-[#0F4C81] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 font-display">
          Bericht succesvol verzonden!
        </h4>
        <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
          Hartelijk dank voor uw bericht, <span className="font-semibold">{formData.fullName}</span> ({selectedCountry.flag} {selectedCountry.name}). Uw vraag is verzonden naar onze adviseurs. U heeft tevens een ontvangstbevestiging per e-mail ontvangen op <span className="font-semibold text-slate-900">{formData.email}</span>.
        </p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Ons team in Brussel neemt uiterlijk de eerstvolgende werkdag (binnen 24u) contact met u op.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#0F4C81] bg-white border border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
          >
            Nog een bericht versturen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Autofill Demo Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
        <span className="text-[11px] text-slate-500">Velden met een sterretje (*) zijn verplicht</span>
        <button
          type="button"
          onClick={handleAutofillTest}
          className="text-xs text-[#0F4C81] hover:text-[#0c3e6b] font-semibold flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors shadow-2xs"
          title="Klik hier om het formulier automatisch in te vullen met testgegevens"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
          <span>Testgegevens automatisch invullen</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pl-6 text-[11px] text-rose-800">
            <a href={`mailto:${COMPANY_INFO.email}`} className="inline-flex items-center gap-1 underline font-medium">
              <Mail className="w-3 h-3" /> {COMPANY_INFO.email}
            </a>
            <a href={`tel:${COMPANY_INFO.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-1 underline font-medium">
              <Phone className="w-3 h-3" /> {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      )}

      {/* Anti-spam honeypot (invisible to real human users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-url-check">Website</label>
        <input
          id="website-url-check"
          type="text"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Country Selection + Auto-detection */}
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="contact-country" className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Land van verblijf <span className="text-rose-500">*</span></span>
          </label>
          <div className="flex items-center gap-2.5">
            <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDetectCountry}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAutoDetectCountry(checked);
                  if (checked) {
                    setDialOverridden(false);
                    runCountryDetection(true);
                  }
                }}
                className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
              />
              <span>Automatisch land detecteren</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setDialOverridden(false);
                runCountryDetection(true);
              }}
              disabled={isDetectingCountry}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4C81] hover:text-[#0c3e6b] bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs disabled:opacity-60"
            >
              {isDetectingCountry ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <LocateFixed className="w-3 h-3" />
              )}
              <span>Detecteer nu</span>
            </button>
          </div>
        </div>

        <select
          id="contact-country"
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm bg-white text-slate-900 font-medium"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.dialCode})
            </option>
          ))}
        </select>

        {detectionMessage && (
          <p className="text-[11px] text-[#0F4C81] font-medium">{detectionMessage}</p>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="contact-fullname" className="block text-xs font-semibold text-slate-700 mb-1">
          Voor- en achternaam <span className="text-rose-500">*</span>
        </label>
        <input
          id="contact-fullname"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="bijv. Sophie Martens"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm transition-colors bg-white text-slate-900"
          required
        />
      </div>

      {/* Grid: Email & International Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
            E-mailadres <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="uw.email@domein.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm transition-colors bg-white text-slate-900"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1">
            Telefoonnummer <span className="text-slate-400 font-normal">(facultatief)</span>
          </label>
          <div className="flex rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-[#0F4C81] focus-within:border-[#0F4C81] overflow-hidden bg-white">
            <select
              aria-label="Landnummer telefoon"
              value={phoneCountryCode}
              onChange={(e) => {
                setPhoneCountryCode(e.target.value);
                setDialOverridden(true);
              }}
              className="bg-slate-50 border-r border-slate-300 px-2 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none max-w-[105px] shrink-0"
            >
              {COUNTRIES.map((c) => (
                <option key={`contact-dial-${c.code}`} value={c.code}>
                  {c.flag} {c.dialCode}
                </option>
              ))}
            </select>
            <input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={selectedPhoneCountry.phonePlaceholder}
              className="w-full px-3 py-2.5 text-sm focus:outline-none bg-white text-slate-900 min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
          Onderwerp van het bericht <span className="text-rose-500">*</span>
        </label>
        <select
          id="contact-subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm transition-colors bg-white text-slate-900"
          required
        >
          {subjectOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
          Uw bericht <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Stel hier uw vraag over leenbedragen, looptijden of uw specifieke financiële situatie..."
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm transition-colors bg-white text-slate-900"
          required
        />
      </div>

      {/* Privacy Checkbox (Mandatory RGPD) */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={formData.acceptedPrivacy}
            onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
            required
          />
          <span>
            Ik ga akkoord dat mijn gegevens worden verwerkt conform het{' '}
            <span className="font-semibold text-slate-900">Privacybeleid</span> van Snel Krediet voor het beantwoorden van mijn vraag. Mijn gegevens worden veilig bewaard en niet gedeeld met derden voor commerciële doeleinden.
          </span>
        </label>
      </div>

      {/* SSL & Submit Button */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#0F4C81]" />
          <span>Beveiligd met SSL-encryptie & SPAM-filter</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 disabled:opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verzenden...</span>
            </>
          ) : (
            <>
              <span>Bericht Versturen</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
