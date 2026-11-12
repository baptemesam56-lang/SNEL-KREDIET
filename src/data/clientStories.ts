import { CreditPurpose } from '../types';

export interface ClientStory {
  id: string;
  name: string;
  location: string;
  region: string;
  purpose: CreditPurpose;
  purposeLabel: string;
  amount: number;
  durationMonths: number;
  monthlyPayment: number;
  jkp: number;
  tagline: string;
  quote: string;
  story: string;
  keyMetric: string;
  keyMetricLabel: string;
  approvedIn: string;
  rating: number;
  avatarInitials: string;
  year: string;
  verified: boolean;
}

export const CLIENT_STORIES: ClientStory[] = [
  {
    id: 'story-gent',
    name: 'Peter & Els Van Damme',
    location: 'Gent',
    region: 'Oost-Vlaanderen',
    purpose: 'verbouwing',
    purposeLabel: 'Renovatielening & Energie',
    amount: 24500,
    durationMonths: 60,
    monthlyPayment: 464.12,
    jkp: 5.25,
    tagline: 'Energiebesparing van € 140/maand dankzij ons groen renovatiekrediet',
    quote:
      'Binnen 24 uur kregen we al een transparant voorstel met een vaste debetrentevoet. Geen verborgen kosten en een deskundige adviseur die echt met ons meedacht.',
    story:
      'Toen we onze gezinswoning in Gent kochten, moesten het dak en de verwarmingsinstallatie dringend verduurzaamd worden. Onze huisbank liet weken op zich wachten. Snel Krediet vergeleek direct de beste tarieven en loodste ons moeiteloos door de vereiste documenten. Met de zonnepanelen en isolatie besparen we nu maandelijks fors op onze energiefactuur.',
    keyMetric: '€ 140/mnd',
    keyMetricLabel: 'Besparing op energiefactuur',
    approvedIn: 'Binnen 24 uur',
    rating: 5,
    avatarInitials: 'PV',
    year: '2026',
    verified: true,
  },
  {
    id: 'story-antwerpen',
    name: 'Dimitri Mertens',
    location: 'Antwerpen',
    region: 'Antwerpen',
    purpose: 'auto',
    purposeLabel: 'Autolening Tweedehands Hybride',
    amount: 16500,
    durationMonths: 48,
    monthlyPayment: 378.45,
    jkp: 4.89,
    tagline: 'Vaste maandlast van € 378/mnd, 100% digitaal geregeld via smartphone',
    quote:
      'Vlotte en uiterst discrete communicatie. Geen overbodig papierwerk, alles kon ik digitaal aanleveren via mijn telefoon.',
    story:
      'Ik had dringend een betrouwbare tweedehands break nodig voor mijn werk en gezin. Mijn traditionele bank eiste een fysiek kantoorbezoek tijdens mijn werkuren. Bij Snel Krediet stuurde ik de bestelbon van de garage en mijn 3 loonfiches digitaal door. De volgende ochtend was het dossier gefinaliseerd en kon ik de wagen ophalen.',
    keyMetric: '48 uur',
    keyMetricLabel: 'Van simulatie tot uitbetaling',
    approvedIn: 'Volgende ochtend akkoord',
    rating: 5,
    avatarInitials: 'DM',
    year: '2026',
    verified: true,
  },
  {
    id: 'story-leuven',
    name: 'Anouck & Thomas Dubois',
    location: 'Leuven',
    region: 'Vlaams-Brabant',
    purpose: 'hergroepering',
    purposeLabel: 'Hergroepering van 3 Kredieten',
    amount: 32000,
    durationMonths: 84,
    monthlyPayment: 483.90,
    jkp: 7.15,
    tagline: 'Maandelijkse besparing van € 215 en nog maar één overzichtelijke lening',
    quote:
      'We hadden een autolening en twee dure kredietkaarten lopen. Dankzij Snel Krediet betalen we nu nog één vaste maandlast en besparen we ruim € 200 per maand.',
    story:
      'Door een opeenstapeling van uitgaven betaalden we elke maand verschillende leningen af tegen variabele rentes tot 12%. Het team van Snel Krediet analyseerde onze situatie volgens de regels van Boek VII WER en bracht alle schulden samen in één lening met vaste rentevoet. Een enorme financiële ademruimte voor ons gezin.',
    keyMetric: '+€ 215/mnd',
    keyMetricLabel: 'Direct extra budgetruimte',
    approvedIn: 'Binnen 2 werkdagen',
    rating: 5,
    avatarInitials: 'AD',
    year: '2026',
    verified: true,
  },
  {
    id: 'story-brugge',
    name: 'Klaas Brouwers',
    location: 'Brugge',
    region: 'West-Vlaanderen',
    purpose: 'persoonlijk',
    purposeLabel: 'Persoonlijke Lening Project',
    amount: 10000,
    durationMonths: 36,
    monthlyPayment: 305.28,
    jkp: 6.49,
    tagline: '100% Vrij te besteden kapitaal zonder aankoopfacturen voor te leggen',
    quote:
      'Geen opdringerige verkooppraatjes, maar een eerlijk en professioneel advies met respect voor mijn terugbetalingscapaciteit.',
    story:
      'Voor de inrichting van onze nieuwe woonst wilden we onze spaarreserve onaangeroerd laten. Een persoonlijke lening bij Snel Krediet bood de ideale formule: we kregen direct duidelijkheid over het exacte JKP en het totale terug te betalen bedrag. Geen onaangename verrassingen en volledige vrijheid in uitgaven.',
    keyMetric: 'Vast 6,49%',
    keyMetricLabel: 'Onveranderlijke debetrente',
    approvedIn: 'Binnen 24 uur',
    rating: 5,
    avatarInitials: 'KB',
    year: '2026',
    verified: true,
  },
  {
    id: 'story-brussel',
    name: 'Nadia & Karim Benali',
    location: 'Brussel (Schaarbeek)',
    region: 'Brussels Hoofdstedelijk Gewest',
    purpose: 'verbouwing',
    purposeLabel: 'Renovatielening Keuken',
    amount: 18500,
    durationMonths: 48,
    monthlyPayment: 427.35,
    jkp: 5.25,
    tagline: 'Persoonlijk advies op kantoor in Brussel met respect voor zelfstandigen',
    quote:
      'Als zelfstandigen is krediet krijgen vaak een bureaucratisch doolhof. Snel Krediet keek op basis van ons meest recente aanslagbiljet en vond meteen de juiste oplossing.',
    story:
      'Voor de volledige renovatie van onze keuken en elektriciteit hadden we nood aan snelle financiering om de aannemer te kunnen inplannen. De adviseur van Snel Krediet bekeek onze balans en stelde een perfect afgestemd afbetalingsplan voor. Binnen twee dagen kregen we de officiële goedkeuring.',
    keyMetric: '2 dagen',
    keyMetricLabel: 'Snelle dossieranalyse',
    approvedIn: 'Binnen 48 uur',
    rating: 5,
    avatarInitials: 'NB',
    year: '2026',
    verified: true,
  },
  {
    id: 'story-hasselt',
    name: 'Johan & Martine Vandevelde',
    location: 'Hasselt',
    region: 'Limburg',
    purpose: 'verbouwing',
    purposeLabel: 'Groene Energielening Warmtepomp',
    amount: 15000,
    durationMonths: 60,
    monthlyPayment: 284.15,
    jkp: 5.25,
    tagline: 'Vaste rentevoet en handig advies over de Vlaamse renovatiepremies',
    quote:
      'De kredietsimulator gaf vooraf al een exact beeld van de maandlast. Heel geruststellend dat ze erkend zijn door de FSMA.',
    story:
      'Toen we onze stookolieketel wilden vervangen door een warmtepomp, konden we genieten van het verlaagde groene tarief. De kredietmakelaar legde nauwkeurig uit welke documenten we nodig hadden en berekende vooraf de totale rentekost. Een betrouwbare partner in consumentenkrediet.',
    keyMetric: 'Vast JKP',
    keyMetricLabel: 'Geen rentestijgingen',
    approvedIn: 'Binnen 24 uur',
    rating: 5,
    avatarInitials: 'JV',
    year: '2026',
    verified: true,
  },
];
