import { CreditPurpose } from '../types';

export interface RotatingHeroTopic {
  id: string;
  target: string;
  desc: string;
  badge: string;
  indicativeRate: string;
  purpose: CreditPurpose;
  defaultAmount: number;
  defaultDuration: number;
}

export const ROTATING_HERO_TOPICS: RotatingHeroTopic[] = [
  {
    id: 'persoonlijk',
    target: 'persoonlijke projecten',
    desc: 'Wilt u persoonlijke plannen realiseren, een reis of trouwfeest bekostigen zonder aankoopfacturen? SNEL KREDIET informeert en begeleidt u discreet volgens het Belgisch consumentenkrediet.',
    badge: '100% Vrij te besteden',
    indicativeRate: 'Vanaf 6,49% JKP',
    purpose: 'persoonlijk',
    defaultAmount: 10000,
    defaultDuration: 48,
  },
  {
    id: 'auto',
    target: 'nieuwe wagen of mobiliteit',
    desc: 'Financiering voor nieuwe of tweedehands wagens, hybride/elektrische voertuigen en motorfietsen. Profiteer van onze scherpste rentevoet met vaste maandelijkse termijnen.',
    badge: 'Voordelig mobiliteitstarief',
    indicativeRate: 'Vanaf 4,89% JKP',
    purpose: 'auto',
    defaultAmount: 20000,
    defaultDuration: 60,
  },
  {
    id: 'verbouwing',
    target: 'energiezuinige woningrenovatie',
    desc: 'Verbouwingswerken, isolatie, zonnepanelen of warmtepomp? Geniet van ons verlaagd groen renovatietarief en verlaag uw maandelijkse energiekosten op lange termijn.',
    badge: 'Groen voordeeltarief',
    indicativeRate: 'Vanaf 5,25% JKP',
    purpose: 'verbouwing',
    defaultAmount: 18000,
    defaultDuration: 60,
  },
  {
    id: 'hergroepering',
    target: 'rustgevende krediethergroepering',
    desc: 'Voeg meerdere lopende leningen, autofinancieringen en kredietkaarten samen tot één enkele duidelijke maandlast tegen een vaste rente en herwin financiële ademruimte.',
    badge: 'Eén vaste maandlast',
    indicativeRate: 'Vanaf 7,15% JKP',
    purpose: 'hergroepering',
    defaultAmount: 25000,
    defaultDuration: 84,
  },
];

export type EmploymentCategory =
  | 'bediende'
  | 'arbeider'
  | 'ambtenaar'
  | 'zelfstandige'
  | 'gepensioneerd';

export interface AdvisoryProfileOption {
  id: EmploymentCategory;
  label: string;
  badge: string;
}

export const ADVISORY_PROFILES: AdvisoryProfileOption[] = [
  { id: 'bediende', label: 'Bediende (CDI)', badge: 'Vast loon' },
  { id: 'arbeider', label: 'Arbeider (CDI)', badge: 'Vast contract' },
  { id: 'ambtenaar', label: 'Ambtenaar', badge: 'Vastbenoemd' },
  { id: 'zelfstandige', label: 'Zelfstandige', badge: 'Vrij beroep / KMO' },
  { id: 'gepensioneerd', label: 'Gepensioneerd', badge: 'Vast pensioen' },
];

export interface TailoredAdviceResult {
  headline: string;
  analysisParagraph: string;
  legalGuidance: string;
  requiredDocuments: string[];
  recommendedAmount: number;
  recommendedDuration: number;
  indicativeJKP: number;
  statutoryThresholdNotice: string;
}

export function getTailoredAdvice(
  profile: EmploymentCategory,
  purpose: CreditPurpose
): TailoredAdviceResult {
  const profileLabelMap: Record<EmploymentCategory, string> = {
    bediende: 'bedienden met een vast contract (CDI)',
    arbeider: 'arbeiders met een vast contract (CDI)',
    ambtenaar: 'statutair of contractueel ambtenaren',
    zelfstandige: 'zelfstandigen en vrije beroepen in België',
    gepensioneerd: 'gepensioneerden met een vast maandelijks pensioen',
  };

  const profileDocMap: Record<EmploymentCategory, string[]> = {
    bediende: [
      'Kopie voor- en achterkant geldige Belgische eID',
      '3 meest recente loonfiches van uw werkgever',
      'Recent bankuittreksel zichtrekening van de laatste maand',
    ],
    arbeider: [
      'Kopie voor- en achterkant geldige Belgische eID',
      '3 meest recente loonbrieven (inclusief eventuele ploegen- of premievergoedingen)',
      'Recent bankafschrift waarop uw nettoloon gestort wordt',
    ],
    ambtenaar: [
      'Kopie voor- en achterkant geldige Belgische eID',
      '3 meest recente weddefiches van de overheid / federale of regionale instelling',
      'Recent bankuittreksel van uw zichtrekening',
    ],
    zelfstandige: [
      'Kopie voor- en achterkant geldige Belgische eID',
      'Recentste officiële aanslagbiljet van de personenbelasting (FOD Financiën)',
      'Laatste 3 maandelijkse bankafschriften van uw professionele zichtrekening',
    ],
    gepensioneerd: [
      'Kopie voor- en achterkant geldige Belgische eID',
      'Recentste pensioenfiche (Federale Pensioendienst of MyPension.be)',
      'Recent bankuittreksel met storting van het wettelijk rust- of overlevingspensioen',
    ],
  };

  const baseDocs = profileDocMap[profile];

  switch (purpose) {
    case 'auto':
      return {
        headline: `Mobiliteitsadvies op maat voor ${profileLabelMap[profile]}`,
        analysisParagraph: `Als ${profile} profiteert u bij Snel Krediet van een scherpe, vaste rentevoet vanaf 4,89% JKP voor de aankoop van een nieuwe of tweedehands wagen, hybride of motorfiets. Omdat uw inkomsten stabiel zijn, kan het dossier binnen 24 uur goedgekeurd worden op basis van de officiële bestelbon van de garage. Wij financieren tot 100% van de factuurwaarde inclusief btw.`,
        legalGuidance:
          'Conform Boek VII van het Wetboek van economisch recht (WER) blijft uw debetrentevoet gedurende de gehele looptijd vast. U weet vooraf op de cent nauwkeurig wat u maandelijks betaalt.',
        requiredDocuments: [
          ...baseDocs,
          'Officiële bestelbon/factuur van de garage (nieuw) of verkoopovereenkomst + inschrijvingsbewijs (tweedehands)',
        ],
        recommendedAmount: 18500,
        recommendedDuration: 48,
        indicativeJKP: 4.89,
        statutoryThresholdNotice:
          'In België mag uw maandelijkse leenlast bij voorkeur maximaal 33% tot 40% van uw netto gezinsinkomen bedragen.',
      };

    case 'verbouwing':
      return {
        headline: `Renovatie- & Energieadvies op maat voor ${profileLabelMap[profile]}`,
        analysisParagraph: `Plant u renovatiewerken, zonnepanelen, isolatie of een warmtepomp? Voor ${profileLabelMap[profile]} biedt onze renovatielening een verlaagd groen tarief vanaf 5,25% JKP. U legt eenvoudig offertes of aankoopfacturen van de materialen voor. Onze adviseurs in Brussel controleren kosteloos of de voorgestelde looptijd perfect aansluit bij uw maandbudget.`,
        legalGuidance:
          'Wettelijke bescherming: Geen hypothecaire aktekosten noch notariskosten verschuldigd. Dit is een lening op afbetaling met vaste maandelijkse aflossingen.',
        requiredDocuments: [
          ...baseDocs,
          'Getekende offertes van aannemers of aankoopfacturen van bouwmaterialen/zonnepanelen',
        ],
        recommendedAmount: 22000,
        recommendedDuration: 60,
        indicativeJKP: 5.25,
        statutoryThresholdNotice:
          'Bij energiebesparende investeringen houdt onze solvabiliteitsanalyse ook rekening met de verwachte daling van uw energiefactuur.',
      };

    case 'hergroepering':
      return {
        headline: `Consolidatie- & Budgetadvies voor ${profileLabelMap[profile]}`,
        analysisParagraph: `Heeft u meerdere lopende leningen, autofinancieringen of dure kredietkaarten lopen? Voor ${profileLabelMap[profile]} brengt onze krediethergroepering alle maandlasten samen in één overzichtelijke domiciliëring met één vaste vervaldag. Veel van onze klanten besparen hierdoor maandelijks direct tussen de € 150 en € 300, met volledige rust in hun gezinsbudget.`,
        legalGuidance:
          'Artikel VII.92 WER waarborgt uw recht op vervroegde terugbetaling van oude kredieten. De wettelijke wederbeleggingsvergoeding is strikt gemaximeerd op 1% (of 0,5% indien < 1 jaar looptijd).',
        requiredDocuments: [
          ...baseDocs,
          'Recente kredietafschriften en aflossingstabellen van alle lopende leningen die u wilt samenvoegen',
          'Recentste afschrift van eventuele kredietkaarten of geldreserves',
        ],
        recommendedAmount: 28000,
        recommendedDuration: 84,
        indicativeJKP: 7.15,
        statutoryThresholdNotice:
          'Doel van hergroepering is het verlagen van de maandlast en het voorkomen van overmatige schuldenlast volgens de Belgische kredietwetgeving.',
      };

    case 'persoonlijk':
    default:
      return {
        headline: `Vrij besteedbaar kredietadvies voor ${profileLabelMap[profile]}`,
        analysisParagraph: `Met een persoonlijke lening bij Snel Krediet beschikt u over 100% vrijheid: u hoeft geen enkele aankoopfactuur, offerte of bestelbon voor te leggen. Voor ${profileLabelMap[profile]} beoordelen onze FSMA-erkende kredietmakelaars uw aanvraag discreet en met respect voor uw privacy. Binnen 24 werkuren ontvangt u een helder, bindend en vrijblijvend voorstel.`,
        legalGuidance:
          'Strikte naleving van de AVG (GDPR) en Boek VII WER: uw persoonsgegevens worden enkel gebruikt ter verificatie van de terugbetalingscapaciteit en worden nooit doorverkocht.',
        requiredDocuments: [
          ...baseDocs,
          'Geen aankoopbewijzen noch facturen vereist (100% vrije besteding)',
        ],
        recommendedAmount: 10000,
        recommendedDuration: 48,
        indicativeJKP: 6.49,
        statutoryThresholdNotice:
          'Erkende kredietmakelaars zijn wettelijk verplicht om overkreditering tegen te gaan. Wij toetsen steeds uw dossier bij de Nationale Bank van België (CKP).',
      };
  }
}
