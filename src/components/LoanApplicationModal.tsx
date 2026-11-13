import React, { useState, useEffect } from 'react';
import { CreditPurpose } from '../types';
import { CREDIT_PURPOSES, COMPANY_INFO } from '../data/content';
import { COUNTRIES, getCountryByCode } from '../data/countries';
import {
  formatInternationalPhone,
  getApiUrl,
  safeParseJsonResponse,
} from '../utils/countryDetection';
import { calculateLoan, formatEuro } from '../utils/calculator';
import {
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Loader2,
  Sparkles,
  Check,
  Calculator,
  User,
  FileCheck,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';

const FORM_STEPS = [
  {
    number: 1,
    id: 'krediet',
    title: 'Krediet & Looptijd',
    shortTitle: 'Krediet',
    subtitle: 'Bedrag & maandlast',
    icon: Calculator,
  },
  {
    number: 2,
    id: 'gegevens',
    title: 'Gegevens & Financiën',
    shortTitle: 'Financiën',
    subtitle: 'Land, contact & inkomen',
    icon: User,
  },
  {
    number: 3,
    id: 'controle',
    title: 'Overzicht & Bevestiging',
    shortTitle: 'Controle',
    subtitle: 'Vrijblijvend indienen',
    icon: FileCheck,
  },
];

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialDuration?: number;
  initialPurpose?: CreditPurpose;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 10000,
  initialDuration = 48,
  initialPurpose = 'persoonlijk',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [duration, setDuration] = useState<number>(initialDuration);
  const [purpose, setPurpose] = useState<CreditPurpose>(initialPurpose);

  // Country & international phone states (default: België / +32)
  const [countryCode, setCountryCode] = useState<string>('BE');
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>('BE');
  const [dialOverridden, setDialOverridden] = useState<boolean>(false);

  // Applicant info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employmentType, setEmploymentType] = useState('bediende');
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>(2400);
  const [housingStatus, setHousingStatus] = useState('huurder');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedCountry = getCountryByCode(countryCode);
  const selectedPhoneCountry = getCountryByCode(phoneCountryCode);
  const fullInternationalPhone = formatInternationalPhone(selectedPhoneCountry.dialCode, phone);

  // Sync loan calculator initial parameters when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
      setDuration(initialDuration);
      setPurpose(initialPurpose);
      setErrorMessage('');
    }
  }, [isOpen, initialAmount, initialDuration, initialPurpose]);

  // Lock body scroll and listen for Escape key when open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculation = calculateLoan(amount, duration, purpose);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (!dialOverridden) {
      setPhoneCountryCode(newCode);
    }
  };

  const handlePhoneCountryChange = (newCode: string) => {
    setPhoneCountryCode(newCode);
    setDialOverridden(true);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        setErrorMessage('Gelieve uw volledige naam in te vullen.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Gelieve een geldig e-mailadres op te geven.');
        return;
      }
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone.trim() || digitsOnly.length < 6) {
        setErrorMessage('Gelieve een geldig telefoonnummer op te geven (inclusief netnummer).');
        return;
      }
      if (!monthlyIncome || Number(monthlyIncome) <= 0) {
        setErrorMessage('Gelieve een geldig netto maandelijks inkomen in te vullen.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      return; // Anti-spam caught bot
    }
    if (!acceptedPrivacy) {
      setErrorMessage('U dient akkoord te gaan met het privacybeleid om uw aanvraag in te dienen.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(getApiUrl('/api/loan-application'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          duration,
          purpose,
          monthlyPayment: calculation.monthlyPayment,
          jkp: calculation.jkp,
          totalRepayment: calculation.totalRepayment,
          totalInterest: calculation.totalInterest,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: fullInternationalPhone || phone.trim(),
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          monthlyIncome,
          housingStatus,
          employmentType,
        }),
      });

      const parsed = await safeParseJsonResponse(response);

      if (!parsed.isJson) {
        throw new Error(
          `De server voor aanvragen gaf een onverwacht antwoord (HTTP ${response.status}). Neem gerust rechtstreeks contact op via contact@snelkrediet.eu of bel ${COMPANY_INFO.phone}.`
        );
      }

      if (!response.ok || !parsed.data?.success) {
        throw new Error(
          parsed.data?.error || 'Er is een fout opgetreden bij het indienen van uw aanvraag.'
        );
      }

      setReferenceCode(
        parsed.data.reference ||
          `SK-${selectedCountry.code}-${Math.floor(100000 + Math.random() * 900000)}`
      );
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Loan application submission error:', err);
      const rawMsg = typeof err?.message === 'string' ? err.message : '';
      const isParseError =
        rawMsg.includes('Unexpected token') ||
        rawMsg.includes('expected pattern') ||
        rawMsg.includes('JSON');

      setErrorMessage(
        isParseError
          ? `Verbinding met het aanvraagplatform is tijdelijk onderbroken. Stuur uw aanvraag rechtstreeks naar contact@snelkrediet.eu of bel ${COMPANY_INFO.phone}.`
          : rawMsg ||
              'Verzending mislukt. Gelieve later opnieuw te proberen of direct contact op te nemen via contact@snelkrediet.eu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillTest = () => {
    setFullName('Sophie Van den Bossche');
    setEmail('aceromatin173@gmail.com');
    setPhone(selectedPhoneCountry.phonePlaceholder);
    setMonthlyIncome(3150);
    setHousingStatus('eigenaar');
    setEmploymentType('bediende');
    setAcceptedPrivacy(true);
    setErrorMessage('');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setAcceptedPrivacy(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[85dvh] sm:max-h-[88vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar (Always Visible & Pinned) */}
        <div className="shrink-0 bg-gradient-to-r from-[#0F4C81] via-[#125896] to-[#0A355A] text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-300" />
            </div>
            <div className="min-w-0">
              <h2 id="loan-modal-title" className="text-base sm:text-lg font-bold font-display leading-tight truncate">
                Vrijblijvende Kredietaanvraag
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-100 truncate">
                Internationaal & België · Vaste rente · Binnen 24u reactie
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="shrink-0 inline-flex items-center gap-1.5 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            aria-label="Sluiten en terug naar de website"
          >
            <span className="hidden sm:inline">Sluiten</span>
            <X className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Visual Progress Step Indicator (Pinned below Header) */}
        {!isSubmitted && (
          <div className="shrink-0 bg-slate-50/95 border-b border-slate-200">
            {/* Top slim continuous progress track */}
            <div
              className="h-1 w-full bg-slate-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={step === 1 ? 33 : step === 2 ? 66 : 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Voortgang van de aanvraag: stap ${step} van 3`}
            >
              <div
                className="h-full bg-[#0F4C81] transition-all duration-300 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Stepper nodes container */}
            <nav aria-label="Voortgang van de kredietaanvraag" className="px-3 sm:px-6 py-2.5 sm:py-3">
              <ol className="flex items-center justify-between relative">
                {/* Connecting Line 1 (Step 1 to Step 2) */}
                <div
                  className={`absolute top-4 -translate-y-1/2 left-[16.6%] right-[50%] h-0.5 transition-colors duration-300 z-0 ${
                    step >= 2 ? 'bg-[#0F4C81]' : 'bg-slate-200'
                  }`}
                />
                {/* Connecting Line 2 (Step 2 to Step 3) */}
                <div
                  className={`absolute top-4 -translate-y-1/2 left-[50%] right-[16.6%] h-0.5 transition-colors duration-300 z-0 ${
                    step >= 3 ? 'bg-[#0F4C81]' : 'bg-slate-200'
                  }`}
                />

                {FORM_STEPS.map((s) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;
                  const isUpcoming = step < s.number;
                  const StepIcon = s.icon;

                  return (
                    <li
                      key={s.number}
                      className="relative z-10 flex flex-col items-center flex-1 text-center"
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <button
                        type="button"
                        disabled={isUpcoming}
                        onClick={() => {
                          if (isCompleted) {
                            setStep(s.number as 1 | 2 | 3);
                          }
                        }}
                        className={`group flex flex-col items-center focus:outline-none transition-all ${
                          isCompleted
                            ? 'cursor-pointer hover:opacity-90'
                            : isUpcoming
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-default'
                        }`}
                        title={
                          isCompleted
                            ? `Ga terug naar stap ${s.number}: ${s.title}`
                            : isActive
                            ? `Huidige stap: ${s.title}`
                            : `Stap ${s.number}: ${s.title}`
                        }
                      >
                        {/* Step Circle Node */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            isCompleted
                              ? 'bg-[#0F4C81] text-white shadow-sm ring-2 ring-[#0F4C81]/25 hover:bg-[#0c3e6b]'
                              : isActive
                              ? 'bg-[#0F4C81] text-white ring-4 ring-[#0F4C81]/20 shadow-md scale-105'
                              : 'bg-white text-slate-400 border-2 border-slate-200'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <StepIcon className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Step Labels */}
                        <div className="mt-1 space-y-0.5 max-w-[100px] sm:max-w-none">
                          <span
                            className={`block text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              isActive
                                ? 'text-[#0F4C81]'
                                : isCompleted
                                ? 'text-slate-600'
                                : 'text-slate-400'
                            }`}
                          >
                            Stap {s.number}
                          </span>
                          <span
                            className={`block text-xs font-bold leading-tight transition-colors ${
                              isActive
                                ? 'text-slate-900 font-extrabold'
                                : isCompleted
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            <span className="hidden sm:inline">{s.title}</span>
                            <span className="sm:hidden">{s.shortTitle}</span>
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
              <div className="font-semibold">{errorMessage}</div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-rose-700 pt-0.5">
                <a href={`mailto:${COMPANY_INFO.email}`} className="inline-flex items-center gap-1 underline font-medium">
                  <Mail className="w-3 h-3" /> {COMPANY_INFO.email}
                </a>
                <a href={`tel:${COMPANY_INFO.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-1 underline font-medium">
                  <Phone className="w-3 h-3" /> {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-[#0F4C81] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Aanvraag succesvol ontvangen!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Hartelijk dank voor uw vertrouwen. Uw dossier ({selectedCountry.flag} {selectedCountry.name}) is geregistreerd onder referentienummer:
              </p>
              <div className="inline-block bg-slate-100 border border-slate-300 px-4 py-2 rounded-lg font-mono font-bold text-slate-900 text-lg">
                {referenceCode}
              </div>

              <div className="text-xs text-blue-900 bg-blue-50/90 border border-blue-200/90 rounded-lg p-3 max-w-md mx-auto">
                ✉️ Er is zojuist een automatische ontvangstbevestiging verstuurd naar <strong>{email}</strong>.
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto mt-4">
                <div className="font-semibold text-slate-800">Volgende stappen:</div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#0F4C81] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Een erkende kredietadviseur van Snel Krediet bekijkt uw dossier.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#0F4C81] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>U ontvangt binnen 24 werkuren een vrijblijvend voorstel per e-mail of telefoon ({fullInternationalPhone}).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#0F4C81] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Geen verplichtingen tot u zelf beslist de kredietovereenkomst te ondertekenen.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] transition-colors shadow-sm"
                >
                  Sluiten en terug naar de website
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: LOAN PARAMETERS */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">Stap 1: Krediet & Looptijd</h3>
                      <p className="text-xs text-slate-500">Kies uw gewenste kredietdoel, leenbedrag en looptijd.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0F4C81] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shrink-0">
                      Stap 1 van 3
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Kies het kredietdoel
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CREDIT_PURPOSES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPurpose(p.id)}
                          className={`p-2.5 sm:p-3 rounded-lg border text-left text-xs transition-colors ${
                            purpose === p.id
                              ? 'border-[#0F4C81] bg-blue-50/70 font-bold text-[#0F4C81] ring-1 ring-[#0F4C81]/30'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-semibold text-slate-900">{p.title}</div>
                          <span className="text-[11px] text-slate-500">{p.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="modal-amount-input" className="block text-xs font-semibold text-slate-700 mb-1">
                        Gewenst bedrag (€)
                      </label>
                      <input
                        id="modal-amount-input"
                        type="number"
                        min={1250}
                        max={75000}
                        step={250}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-duration-select" className="block text-xs font-semibold text-slate-700 mb-1">
                        Looptijd (maanden)
                      </label>
                      <select
                        id="modal-duration-select"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm font-semibold bg-white"
                      >
                        <option value={12}>12 maanden (1 jaar)</option>
                        <option value={24}>24 maanden (2 jaar)</option>
                        <option value={36}>36 maanden (3 jaar)</option>
                        <option value={48}>48 maanden (4 jaar)</option>
                        <option value={60}>60 maanden (5 jaar)</option>
                        <option value={84}>84 maanden (7 jaar)</option>
                        <option value={120}>120 maanden (10 jaar)</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Indicatieve maandlast:</span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#0F4C81] font-display">
                        {formatEuro(calculation.monthlyPayment)}/mnd
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Vast JKP:</span>
                      <span className="font-bold text-[#0F4C81] text-sm">{calculation.jkp}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/20 transition-colors"
                    >
                      <span>Volgende stap</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PERSONAL & FINANCIAL DETAILS + COUNTRY & DIAL CODE */}
              {step === 2 && (
                <form onSubmit={handleNextStep} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">Stap 2: Gegevens & Financiën</h3>
                      <p className="text-xs text-slate-500">Land van verblijf, internationaal contact en inkomen.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleAutofillTest}
                        className="text-xs text-[#0F4C81] hover:text-[#0c3e6b] font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                        title="Klik hier om de velden automatisch in te vullen met testgegevens"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
                        <span className="hidden sm:inline">Testgegevens</span>
                      </button>
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label htmlFor="applicant-country" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0F4C81]" />
                      <span>Land van verblijf *</span>
                    </label>
                    <select
                      id="applicant-country"
                      value={countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm bg-white font-medium"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="applicant-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Voor- en achternaam *
                      </label>
                      <input
                        id="applicant-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="bijv. Jan Van den Berghe"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="applicant-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mailadres *
                      </label>
                      <input
                        id="applicant-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="uw.naam@domein.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* International Phone Selector + Income */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="applicant-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        Telefoonnummer (internationaal) *
                      </label>
                      <div className="flex rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-[#0F4C81] focus-within:border-[#0F4C81] overflow-hidden bg-white">
                        <select
                          aria-label="Landnummer"
                          value={phoneCountryCode}
                          onChange={(e) => handlePhoneCountryChange(e.target.value)}
                          className="bg-slate-50 border-r border-slate-300 px-2 py-2 text-xs font-semibold text-slate-800 focus:outline-none max-w-[105px] shrink-0"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={`dial-${c.code}`} value={c.code}>
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                        <input
                          id="applicant-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={selectedPhoneCountry.phonePlaceholder}
                          className="w-full px-3 py-2 text-sm focus:outline-none min-w-0"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="applicant-income" className="block text-xs font-semibold text-slate-700 mb-1">
                        Netto maandinkomen (€) *
                      </label>
                      <input
                        id="applicant-income"
                        type="number"
                        min={500}
                        max={50000}
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="bijv. 2400"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="applicant-employment" className="block text-xs font-semibold text-slate-700 mb-1">
                        Beroepssituatie
                      </label>
                      <select
                        id="applicant-employment"
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm bg-white"
                      >
                        <option value="bediende">Bediende (Vast contract)</option>
                        <option value="arbeider">Arbeider (Vast contract)</option>
                        <option value="ambtenaar">Ambtenaar</option>
                        <option value="zelfstandige">Zelfstandige / Vrij beroep</option>
                        <option value="gepensioneerd">Gepensioneerd</option>
                        <option value="andere">Andere situatie</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="applicant-housing" className="block text-xs font-semibold text-slate-700 mb-1">
                        Woonsituatie
                      </label>
                      <select
                        id="applicant-housing"
                        value={housingStatus}
                        onChange={(e) => setHousingStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] text-sm bg-white"
                      >
                        <option value="eigenaar">Eigenaar (met of zonder hypotheek)</option>
                        <option value="huurder">Huurder</option>
                        <option value="inwonend">Inwonend bij familie / ouders</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Terug</span>
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/20 transition-colors"
                    >
                      <span>Volgende: Overzicht</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: FINAL REVIEW & PRIVACY ACCEPTANCE */}
              {step === 3 && (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">Stap 3: Overzicht & Bevestiging</h3>
                      <p className="text-xs text-slate-500">Controleer uw dossier en dien uw aanvraag veilig in.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0F4C81] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shrink-0">
                      Stap 3 van 3
                    </span>
                  </div>

                  {/* Honeypot field for anti-spam */}
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Summary Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex justify-between">
                      <span>Overzicht van uw kredietaanvraag:</span>
                      <span className="text-[#0F4C81] font-semibold">{calculation.jkp}% JKP</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 pt-1 text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Bedrag:</span>
                        <strong className="text-slate-900 text-sm">{formatEuro(amount)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Looptijd:</span>
                        <strong className="text-slate-900 text-sm">{duration} maanden</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Geschatte maandlast:</span>
                        <strong className="text-[#0F4C81] text-sm">{formatEuro(calculation.monthlyPayment)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Aanvrager:</span>
                        <strong className="text-slate-900 text-sm">{fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Land van verblijf:</span>
                        <strong className="text-slate-900 text-xs sm:text-sm">
                          {selectedCountry.flag} {selectedCountry.name}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Telefoonnummer:</span>
                        <strong className="text-slate-900 text-xs sm:text-sm">{fullInternationalPhone}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Privacy checkbox */}
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                        required
                      />
                      <span>
                        Ik bevestig dat de verstrekte gegevens correct zijn en ga akkoord met de verwerking van mijn persoonsgegevens conform het{' '}
                        <strong className="text-slate-900">Privacybeleid</strong> van Snel Krediet BV voor de beoordeling van mijn kredietaanvraag.
                      </span>
                    </label>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>256-bit SSL gecodeerde verbinding. Uw gegevens worden strikt vertrouwelijk behandeld.</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Terug</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-lg shadow-[#0F4C81]/30 disabled:opacity-70 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Aanvraag wordt verzonden...</span>
                        </>
                      ) : (
                        <>
                          <span>Definitief Verzenden</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
