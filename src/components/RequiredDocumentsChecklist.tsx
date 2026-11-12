import React, { useState, useMemo } from 'react';
import { CreditPurpose } from '../types';
import { CREDIT_PURPOSES } from '../data/content';
import {
  FileText,
  CheckCircle2,
  Circle,
  Download,
  Printer,
  ShieldCheck,
  Sparkles,
  Info,
  Car,
  Home,
  Layers,
  User,
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  badge: string;
  category: 'identiteit' | 'inkomen' | 'doel' | 'financieel';
  categoryLabel: string;
  description: string;
  whyNeeded: string;
  tips: string;
  acceptedFormats: string;
  appliesTo: ('all' | CreditPurpose)[];
  isMandatory: boolean;
  isSpecialNotice?: boolean;
}

const ALL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'eid',
    title: 'Geldige identiteitskaart (eID) of verblijfstitel',
    badge: 'Wettelijk verplicht',
    category: 'identiteit',
    categoryLabel: 'Identiteit & Wettelijke identificatie',
    description:
      'Kleurkopie of duidelijke scan van zowel de voor- als achterzijde van uw geldige Belgische elektronische identiteitskaart (eID) of geldige verblijfsvergunning.',
    whyNeeded:
      'Wettelijke verplichting onder de Belgische wetgeving ter verificatie van uw officiële woonplaats in België/Luxemburg en ter voorkoming van identiteitsfraude.',
    tips: 'Controleer of de 4 hoeken van de kaart zichtbaar zijn, de gegevens scherp leesbaar zijn en er geen flitsreflectie over de chip valt.',
    acceptedFormats: 'PDF, JPG, PNG (max. 10MB)',
    appliesTo: ['all'],
    isMandatory: true,
  },
  {
    id: 'inkomen_loon',
    title: '3 meest recente loonfiches / inkomstenbewijzen',
    badge: 'Wettelijk verplicht',
    category: 'inkomen',
    categoryLabel: 'Inkomsten & Beroepssituatie',
    description:
      'De 3 laatste opeenvolgende loonbrieven (werknemers), recentste pensioenfiches (gepensioneerden) of het meest recente aanslagbiljet van de personenbelasting (zelfstandigen/vrije beroepen).',
    whyNeeded:
      'Wettelijke zorgplicht conform Boek VII Wetboek van economisch recht (WER) om uw solvabiliteit te toetsen en verantwoorde kredietverlening te garanderen.',
    tips: 'Download de originele PDF rechtstreeks via uw online sociaal secretariaat of MyMinfin voor de snelste verwerking zonder kwaliteitsverlies.',
    acceptedFormats: 'Originele PDF of duidelijke scan',
    appliesTo: ['all'],
    isMandatory: true,
  },
  {
    id: 'bankafschrift',
    title: 'Recent bankafschrift van uw zichtrekening',
    badge: 'Wettelijk verplicht',
    category: 'inkomen',
    categoryLabel: 'Bank- en solvabiliteitsverificatie',
    description:
      'Een officieel maandelijks bankuittreksel van de voorbije maand van de zichtrekening waarop uw inkomsten gestort worden en waarop vaste woonlasten zichtbaar zijn.',
    whyNeeded:
      'Bevestigt de effectieve ontvangst van de inkomsten op uw bankrekening en uw maandelijkse financiële draagkracht.',
    tips: 'Download het officiële maandelijkse bankuittreksel in PDF via PC banking (geen beknopte app-screenshot).',
    acceptedFormats: 'Officieel bankuittreksel (PDF)',
    appliesTo: ['all'],
    isMandatory: true,
  },
  {
    id: 'auto_bestelbon',
    title: 'Bestelbon, factuur of verkoopovereenkomst voertuig',
    badge: 'Specifiek voor Autolening',
    category: 'doel',
    categoryLabel: 'Voertuigspecificatie',
    description:
      'Officiële bestelbon of pro-forma aankoopfactuur van de erkende garage (nieuwe wagen/moto) of getekende verkoopovereenkomst met kopie van het kentekenbewijs (tweedehands wagen).',
    whyNeeded:
      'Bepaalt de exacte aankoopwaarde van het voertuig, het bouwjaar en het recht op het voordelige autolening-tarief (vanaf 4,89% JKP).',
    tips: 'Zorg dat het chassisnummer (VIN), merk, model, kilometerstand en totaalbedrag inclusief BTW duidelijk vermeld staan.',
    acceptedFormats: 'PDF of scan van de bestelbon',
    appliesTo: ['auto'],
    isMandatory: true,
  },
  {
    id: 'verbouwing_offertes',
    title: 'Offertes of facturen van renovatiewerken / materialen',
    badge: 'Specifiek voor Renovatielening',
    category: 'doel',
    categoryLabel: 'Verbouwingsbewijzen',
    description:
      'Ondertekende offertes van aannemers of aankoopfacturen van bouwmaterialen (sanitair, keuken, isolatie, ramen, dak, vloeren).',
    whyNeeded:
      'Geeft recht op het voordelige renovatietarief (5,25% JKP) in plaats van een standaard lening.',
    tips: 'Bij doe-het-zelf verbouwingen volstaan offertes of ramingen van de benodigde bouwmaterialen bij uw doe-het-zelfzaak.',
    acceptedFormats: 'PDF of duidelijke scan',
    appliesTo: ['verbouwing'],
    isMandatory: true,
  },
  {
    id: 'energie_attest',
    title: 'Offerte energiebesparende investering (Zonnepanelen / Warmtepomp / Isolatie)',
    badge: 'Aanbevolen voor Groen Tarief',
    category: 'doel',
    categoryLabel: 'Ecologische investering',
    description:
      'Gedetailleerde offerte voor duurzame energiewerken: zonnepanelen, thuisbatterij, warmtepomp, hoogrendementsglas of dakisolatie.',
    whyNeeded:
      'Laat u genieten van onze scherpste rentevoet voor groene en energiebesparende investeringen in uw woning.',
    tips: 'Vraag de installateur om het verwachte energierendement en de technische specificaties te vermelden.',
    acceptedFormats: 'PDF of offerte document',
    appliesTo: ['verbouwing'],
    isMandatory: false,
  },
  {
    id: 'hergroepering_afrekeningen',
    title: 'Aflossingstabellen en afrekeningen van lopende leningen',
    badge: 'Specifiek voor Krediethergroepering',
    category: 'financieel',
    categoryLabel: 'Consolidatieoverzicht',
    description:
      'Meest recente kredietafschriften van alle lopende leningen op afbetaling, autofinancieringen of persoonlijke leningen die u wenst samen te voegen.',
    whyNeeded:
      'Noodzakelijk om het exacte resterende saldo, de lopende rentelast en de wettelijke wederbeleggingsvergoeding (max 1% volgens art. VII.92 WER) te berekenen.',
    tips: 'Download het meest recente jaarafschnitt of aflossingstabel via de online bankomgeving van uw huidige kredietverstrekkers.',
    acceptedFormats: 'PDF of scan van de aflossingstabel',
    appliesTo: ['hergroepering'],
    isMandatory: true,
  },
  {
    id: 'hergroepering_kredietkaarten',
    title: 'Recent afschrift van lopende kredietkaarten / geldreserves',
    badge: 'Aanbevolen voor Krediethergroepering',
    category: 'financieel',
    categoryLabel: 'Revolving Kredieten',
    description:
      'Recentste maandelijks afschrift van lopende kredietkaarten (Visa, Mastercard) of geldreserves die u mee wilt consolideren.',
    whyNeeded:
      'Kredietkaarten en geldreserves dragen vaak hoge rentetarieven (tot 12-14% JKP). Door ze samen te voegen in één lening met vaste rente verlaagt u direct uw maandlast.',
    tips: 'Consolideer ook kredietkaarten die u weinig gebruikt om uw algemene leencapaciteit te versterken.',
    acceptedFormats: 'PDF van de afrekening',
    appliesTo: ['hergroepering'],
    isMandatory: false,
  },
  {
    id: 'persoonlijk_vrijheid',
    title: '100% Vrij te besteden — Geen aankoopbewijzen of facturen vereist',
    badge: 'Geen bewijs vereist',
    category: 'doel',
    categoryLabel: 'Vrijheid & Discretie',
    description:
      'Voor een persoonlijke lening hoeft u geen enkele aankoopfactuur, offerte of verantwoording van uw uitgaven voor te leggen. U besteedt het kapitaal in alle vrijheid.',
    whyNeeded:
      'Volledige privacy voor uw persoonlijke projecten (trouwfeest, medische uitgaven, inrichting, vakantie, onvoorziene kosten).',
    tips: 'Met enkel uw identiteitskaart, 3 loonfiches en bankafschrift is uw dossier al 100% compleet en klaar voor verwerking!',
    acceptedFormats: 'Geen document vereist',
    appliesTo: ['persoonlijk'],
    isMandatory: false,
    isSpecialNotice: true,
  },
];

interface RequiredDocumentsChecklistProps {
  initialPurpose?: CreditPurpose;
  onStartApplication?: (purpose: CreditPurpose) => void;
  className?: string;
  showCta?: boolean;
}

export const RequiredDocumentsChecklist: React.FC<RequiredDocumentsChecklistProps> = ({
  initialPurpose = 'persoonlijk',
  onStartApplication,
  className = '',
  showCta = true,
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<CreditPurpose>(initialPurpose);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showTips, setShowTips] = useState(false);

  // Filter documents applicable to the selected loan purpose
  const relevantDocuments = useMemo(() => {
    return ALL_DOCUMENTS.filter(
      (doc) => doc.appliesTo.includes('all') || doc.appliesTo.includes(selectedPurpose)
    );
  }, [selectedPurpose]);

  // Documents requiring user gathering (excludes the informational special notice)
  const actionableDocs = useMemo(() => {
    return relevantDocuments.filter((doc) => !doc.isSpecialNotice);
  }, [relevantDocuments]);

  // Mandatory docs
  const mandatoryDocs = useMemo(() => {
    return actionableDocs.filter((doc) => doc.isMandatory);
  }, [actionableDocs]);

  // Calculate progress
  const totalCount = actionableDocs.length;
  const checkedCount = actionableDocs.filter((doc) => checkedItems[doc.id]).length;
  const mandatoryCheckedCount = mandatoryDocs.filter((doc) => checkedItems[doc.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const isMandatoryComplete = mandatoryDocs.length > 0 && mandatoryCheckedCount === mandatoryDocs.length;
  const isFullyComplete = totalCount > 0 && checkedCount === totalCount;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const updated: Record<string, boolean> = { ...checkedItems };
    actionableDocs.forEach((doc) => {
      updated[doc.id] = true;
    });
    setCheckedItems(updated);
  };

  const handleResetChecklist = () => {
    const updated: Record<string, boolean> = { ...checkedItems };
    actionableDocs.forEach((doc) => {
      delete updated[doc.id];
    });
    setCheckedItems(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPurposeIcon = (purposeId: CreditPurpose) => {
    switch (purposeId) {
      case 'persoonlijk':
        return <User className="w-4 h-4" />;
      case 'auto':
        return <Car className="w-4 h-4" />;
      case 'verbouwing':
        return <Home className="w-4 h-4" />;
      case 'hergroepering':
        return <Layers className="w-4 h-4" />;
    }
  };

  const activePurposeObj = CREDIT_PURPOSES.find((p) => p.id === selectedPurpose);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800 ${className}`}
    >
      {/* Component Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] via-[#125896] to-[#0A355A] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Dossier Voorbereiding · Belgisch Kredietkader</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Checklist Benodigde Documenten
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
              Selecteer uw type lening om direct te zien welke stukken u nodig heeft. Vink de documenten af die u al bij de hand heeft voor een soepele en snelle afhandeling.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors print:hidden"
              title="Print deze checklist af"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Afdrukken</span>
            </button>
          </div>
        </div>

        {/* Loan Purpose Selection Tabs */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-2.5">
            Kies uw type lening:
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {CREDIT_PURPOSES.map((purpose) => {
              const isSelected = selectedPurpose === purpose.id;
              return (
                <button
                  key={purpose.id}
                  type="button"
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-white text-[#0F4C81] font-bold shadow-md shadow-black/10 ring-2 ring-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 font-medium'
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-blue-50 text-[#0F4C81]' : 'bg-white/15 text-white'
                    }`}
                  >
                    {getPurposeIcon(purpose.id)}
                  </span>
                  <div className="truncate">
                    <div className="truncate">{purpose.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-slate-500 font-normal' : 'text-blue-200 font-normal'
                      }`}
                    >
                      {purpose.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress & Quick Actions Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span>Uw voorbereiding:</span>
                <strong className="text-[#0F4C81]">
                  {checkedCount} van {totalCount} documenten gereed
                </strong>
              </span>
              <span className="text-slate-500 font-mono font-bold text-xs">
                {progressPercent}%
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div
              className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Voortgang checklist documenten"
            >
              <div
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  isFullyComplete
                    ? 'bg-emerald-500'
                    : isMandatoryComplete
                    ? 'bg-[#0F4C81]'
                    : 'bg-[#0F4C81]/80'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {checkedCount < totalCount ? (
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
              >
                Alles afvinken
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetChecklist}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
              >
                Selectie wissen
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="px-3 py-1.5 rounded-lg text-[#0F4C81] hover:bg-blue-50 font-medium transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showTips ? 'Verberg tips' : 'Tips voor snelle goedkeuring'}</span>
            </button>
          </div>
        </div>

        {/* Completion status banner */}
        {isFullyComplete && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <div>
                <strong className="font-bold">Uitstekend! Uw dossier is 100% voorbereid.</strong>
                <p className="text-[11px] text-emerald-800">
                  U beschikt over alle documenten voor een onmiddellijke dossieranalyse door onze kredietadviseurs.
                </p>
              </div>
            </div>
            {showCta && onStartApplication && (
              <button
                type="button"
                onClick={() => onStartApplication(selectedPurpose)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Nu aanvragen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Expandable Tips Panel */}
        {showTips && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-[#0F4C81]">
              <Sparkles className="w-4 h-4 text-[#0F4C81]" />
              <span>3 Gouden tips van onze kredietadviseurs in Brussel:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 pl-5 list-disc">
              <li>
                <strong>Geen afgesneden hoeken:</strong> Zorg dat alle 4 de hoeken van uw identiteitskaart en facturen volledig in beeld zijn.
              </li>
              <li>
                <strong>Officiële documenten:</strong> Kies steeds voor de originele digitale PDF van uw bank en werkgever (geen foto’s van een computerscherm).
              </li>
              <li>
                <strong>Beide partners bij gehuwden/wettelijk samenwonenden:</strong> Indien u gehuwd bent onder het wettelijk stelsel of samen aanvraagt, heeft u de identiteitskaart en loonfiches van beide aanvragers nodig.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Checklist Items List */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="space-y-3">
          {relevantDocuments.map((doc, index) => {
            const isChecked = !!checkedItems[doc.id];

            if (doc.isSpecialNotice) {
              return (
                <div
                  key={doc.id}
                  className="bg-blue-50/60 rounded-xl p-5 border border-blue-200 flex items-start gap-3.5 text-slate-800"
                >
                  <span className="p-2 rounded-lg bg-[#0F4C81] text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-sky-200" />
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0F4C81]">
                        {doc.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>
                    <div className="pt-1 text-[11px] text-[#0F4C81] font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{doc.tips}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={doc.id}
                onClick={() => toggleCheck(doc.id)}
                className={`group cursor-pointer rounded-xl p-4 sm:p-5 border transition-all ${
                  isChecked
                    ? 'bg-blue-50/40 border-[#0F4C81] shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Custom Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#0F4C81] text-white ring-2 ring-[#0F4C81]/20'
                          : 'border-2 border-slate-300 group-hover:border-[#0F4C81] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Document details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          0{index + 1}.
                        </span>
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isChecked ? 'text-[#0F4C81] line-through decoration-[#0F4C81]/50' : 'text-slate-900'
                          }`}
                        >
                          {doc.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            doc.isMandatory
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : 'bg-blue-50 text-[#0F4C81] border border-blue-100'
                          }`}
                        >
                          {doc.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>

                    {/* Metadata & tips */}
                    <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-[#0F4C81]" />
                        <span>Formaat: {doc.acceptedFormats}</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 italic">Tip: {doc.tips}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Conform FSMA & Boek VII WER: Documenten worden strikt vertrouwelijk en via 256-bit SSL-encryptie verwerkt.
            </span>
          </div>

          {showCta && onStartApplication && (
            <button
              type="button"
              onClick={() => onStartApplication(selectedPurpose)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0c3e6b] shadow-md shadow-[#0F4C81]/25 transition-colors shrink-0"
            >
              <span>Vrijblijvend krediet aanvragen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
