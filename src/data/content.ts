import { CreditPurposeOption } from '../types';

export const COMPANY_INFO = {
  name: 'SNEL KREDIET',
  legalName: 'Snel Krediet BV',
  slogan: 'Verantwoorde & transparante leningen voor particulieren in België',
  address: 'Wetstraat 145, 1000 Brussel, België',
  phone: '+31 97010280754',
  email: 'contact@snelkrediet.eu',
  openingHours: 'Ma. - Vr. 08:30 – 18:30 | Za. 09:00 – 13:00',
  kbo: 'BE 0842.193.518',
  fsma: '109482 A-B (Kredietmakelaar en agent in nevenfunctie)',
  supervisoryAuthority: 'FOD Economie, K.M.O., Middenstand en Energie & FSMA',
  legalDisclaimer: 'Let op, geld lenen kost ook geld.',
  representativeExample:
    'Representatief voorbeeld: Voor een lening op afbetaling van € 10.000 met een looptijd van 48 maanden bedraagt het Jaarlijks Kostenpercentage (JKP) 6,49% (vaste debetrentevoet: 6,49%). Maandelijkse aflossing: € 236,18. Totaal terug te betalen bedrag: € 11.336,64.',
};

export const CREDIT_PURPOSES: CreditPurposeOption[] = [
  {
    id: 'persoonlijk',
    title: 'Persoonlijke Lening',
    shortDesc: 'Vrij te besteden krediet voor onverwachte uitgaven, reizen, huwelijk of persoonlijke projecten.',
    minAmount: 1250,
    maxAmount: 50000,
    minMonths: 12,
    maxMonths: 84,
    indicativeJKP: 6.49,
    badge: 'Meest gekozen',
  },
  {
    id: 'auto',
    title: 'Autolening & Mobiliteit',
    shortDesc: 'Financiering voor nieuwe of tweedehands wagens, elektrische auto’s, moto’s of bakfietsen.',
    minAmount: 2500,
    maxAmount: 75000,
    minMonths: 12,
    maxMonths: 84,
    indicativeJKP: 4.89,
    badge: 'Voordelig tarief',
  },
  {
    id: 'verbouwing',
    title: 'Renovatielening & Energie',
    shortDesc: 'Voor verbouwingen, isolatie, zonnepanelen, warmtepompen of interieurvernieuwing.',
    minAmount: 2500,
    maxAmount: 60000,
    minMonths: 18,
    maxMonths: 120,
    indicativeJKP: 5.25,
    badge: 'Groen tarief',
  },
  {
    id: 'hergroepering',
    title: 'Hergroepering van Kredieten',
    shortDesc: 'Voeg meerdere lopende leningen en kredietlijnen samen tot één enkele, lagere maandlast.',
    minAmount: 5000,
    maxAmount: 75000,
    minMonths: 24,
    maxMonths: 120,
    indicativeJKP: 7.15,
    badge: 'Overzicht & rust',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Simuleer & vraag online aan',
    desc: 'Kies het gewenste leenbedrag en de looptijd in onze kredietsimulator. Vul ons beveiligde formulier in binnen 2 minuten.',
    timing: '2 minuten',
  },
  {
    step: '02',
    title: 'Persoonlijke dossieranalyse',
    desc: 'Een erkende Belgische kredietadviseur analyseert uw situatie, controleert de haalbaarheid en respecteert uw terugbetalingscapaciteit.',
    timing: 'Binnen 24 uur',
  },
  {
    step: '03',
    title: 'Duidelijk voorstel op maat',
    desc: 'U ontvangt een transparant, vrijblijvend kredietvoorstel met vaste rentevoet, duidelijke maandtermijnen en zonder verborgen kosten.',
    timing: '100% vrijblijvend',
  },
  {
    step: '04',
    title: 'Ondertekening & uitbetaling',
    desc: 'Na goedkeuring en ondertekening van de kredietovereenkomst worden de fondsen rechtstreeks op uw Belgische bankrekening gestort.',
    timing: 'Snelle overschrijving',
  },
];

export const TRUST_PILLARS = [
  {
    title: '100% Belgisch Kredietkader',
    desc: 'Conform de strikte Belgische wetgeving op het consumentenkrediet (Boek VII WER) en onder toezicht van FSMA & FOD Economie.',
  },
  {
    title: 'Snelle & Discrete Verwerking',
    desc: 'Binnen 24 werkuren ontvangt u een gefundeerd antwoord en persoonlijk advies van onze specialisten in Brussel.',
  },
  {
    title: 'Flexibele Aflossingsformules',
    desc: 'Kies zelf de looptijd en het maandbedrag dat perfect aansluit bij uw persoonlijk budget en financiële draagkracht.',
  },
  {
    title: 'Verantwoord Lenen',
    desc: 'Wij toetsen zorgvuldig uw draagkracht om overkreditering te voorkomen. Uw financiële rust is onze topprioriteit.',
  },
];

export const FAQ_LIST = [
  {
    category: 'Voorwaarden & Aanvraag',
    question: 'Aan welke voorwaarden moet ik voldoen om in België een lening aan te vragen?',
    answer:
      'Om in aanmerking te komen voor een krediet in België moet u: (1) minstens 18 jaar oud zijn, (2) officieel gedomicilieerd zijn in België of het Groothertogdom Luxemburg, (3) beschikken over een regelmatig en aantoonbaar inkomen (loondienst, zelfstandig, pensioen of vervangingsinkomen), en (4) niet geregistreerd staan met een actieve wanbetaling bij de Centrale voor Kredieten aan Particulieren (CKP) van de Nationale Bank van België.',
  },
  {
    category: 'Voorwaarden & Aanvraag',
    question: 'Welke documenten moet ik bezorgen voor de beoordeling van mijn kredietaanvraag?',
    answer:
      'Voor een vlotte beoordeling hebben we meestal nodig: een kopie van de voor- en achterzijde van uw geldige Belgische identiteitskaart (of geldige verblijfsvergunning), uw 3 meest recente loonfiches (of pensioenoverzichten / recent aanslagbiljet voor zelfstandigen), en een recent bankafschrift waarop uw inkomsten en eventuele huidige vaste lasten zichtbaar zijn.',
  },
  {
    category: 'Rente & Kosten',
    question: 'Wat betekent het JKP (Jaarlijks Kostenpercentage)?',
    answer:
      'Het Jaarlijks Kostenpercentage (JKP) is de totale wettelijke kostprijs van het krediet voor de consument, uitgedrukt als een jaarlijks percentage van het kredietbedrag. Het omvat zowel de rentevoet als alle eventuele verplichte bijkomende kosten. Bij Snel Krediet is de rentevoet vast gedurende de gehele looptijd, waardoor uw maandbedrag nooit onverwacht stijgt.',
  },
  {
    category: 'Rente & Kosten',
    question: 'Hoe wordt het rentepercentage (JKP) berekend?',
    answer:
      'Het Jaarlijks Kostenpercentage (JKP) wordt bepaald op basis van het gekozen kredietbedrag, de gewenste looptijd en het type financiering. Bij Snel Krediet is de rentevoet vast gedurende de gehele contractduur, waardoor uw maandlast altijd exact gelijk blijft en u vooraf volledige duidelijkheid heeft.',
  },
  {
    category: 'Terugbetaling & Beheer',
    question: 'Kan ik mijn lening vervroegd terugbetalen in België?',
    answer:
      'Ja, op grond van artikel VII.92 van het Belgische Wetboek van economisch recht heeft u te allen tijde het recht om uw krediet geheel of gedeeltelijk vervroegd af te lossen. De wettelijke wederbeleggingsvergoeding is wettelijk begrensd tot maximaal 1% van het terugbetaalde kapitaal (of 0,5% als de resterende looptijd minder dan een jaar bedraagt).',
  },
  {
    category: 'Terugbetaling & Beheer',
    question: 'Wat is het verschil tussen een persoonlijke lening en een hergroepering van kredieten?',
    answer:
      'Een persoonlijke lening verstrekt nieuw kapitaal voor een specifiek of vrij te bepalen project. Een hergroepering (of consolidatie) voegt bestaande lopende leningen, kredietkaarten en kredietopeningen samen tot één enkele nieuwe lening met één vaste rentevoet en één overzichtelijke maandlast, wat vaak leidt tot meer ademruimte in uw maandbudget.',
  },
  {
    category: 'Veiligheid & Privacy',
    question: 'Hoe worden mijn persoonsgegevens beschermd?',
    answer:
      'Snel Krediet behandelt uw gegevens in strikte overeenstemming met de Europese Algemene Verordening Gegevensbescherming (AVG / GDPR) en de Belgische privacywetgeving. Uw gegevens worden uitsluitend gebruikt voor de beoordeling van uw kredietaanvraag via beveiligde SSL-verbindingen en worden nooit verkocht aan derden.',
  },
];

export const ADVISORY_TEAM = [
  {
    name: 'Laurent Vandermeersch',
    role: 'Senior Kredietadviseur & Oprichter',
    experience: '18 jaar ervaring in de Belgische bank- en kredietsector',
    specialty: 'Persoonlijke financieringen & complexe hergroeperingen',
  },
  {
    name: 'Sophie De Clercq',
    role: 'Kredietspecialist Consumentenkrediet',
    experience: '12 jaar ervaring als erkend bemiddelaar (FSMA-gecertificeerd)',
    specialty: 'Mobiliteitskredieten & energieleningen',
  },
  {
    name: 'Marc Wouters',
    role: 'Compliance & Risico-analist',
    experience: '15 jaar toezicht op kredietdossiers en consumentenbescherming',
    specialty: 'Juridische conformiteit Boek VII WER & dossieranalyse',
  },
];
