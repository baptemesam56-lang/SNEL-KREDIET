<?php
error_reporting(0);
ini_set('display_errors', '0');

require_once __DIR__ . '/_mailer.php';
sk_handle_preflight();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = sk_read_json_input();
$amount = (float)($input['amount'] ?? 0);
$duration = (int)($input['duration'] ?? 0);
$purpose = trim((string)($input['purpose'] ?? 'persoonlijk'));
$monthlyPayment = (float)($input['monthlyPayment'] ?? 0);
$jkp = (float)($input['jkp'] ?? 6.49);
$totalRepayment = (float)($input['totalRepayment'] ?? 0);
$totalInterest = (float)($input['totalInterest'] ?? 0);

$fullName = trim((string)($input['fullName'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$phone = trim((string)($input['phone'] ?? ''));
$country = trim((string)($input['country'] ?? 'België / Belgique'));
$rawCode = strtoupper(trim((string)($input['countryCode'] ?? 'BE')));
$cleanCountryCode = preg_match('/^[A-Z]{2}$/', $rawCode) ? $rawCode : 'BE';
$monthlyIncome = $input['monthlyIncome'] ?? '';
$housingStatus = trim((string)($input['housingStatus'] ?? 'Niet gespecificeerd'));
$employmentType = trim((string)($input['employmentType'] ?? 'Niet gespecificeerd'));
$additionalNotes = trim((string)($input['additionalNotes'] ?? ''));

if ($fullName === '' || $email === '' || $phone === '' || $amount <= 0 || $duration <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Gelieve alle verplichte velden van uw aanvraag correct in te vullen.',
    ]);
    exit;
}

date_default_timezone_set('Europe/Brussels');
$referenceCode = "SK-{$cleanCountryCode}-" . random_int(100000, 999999);
$submissionDate = date('d/m/Y H:i');

$purposeLabels = [
    'persoonlijk' => 'Persoonlijke Lening',
    'auto' => 'Autolening & Mobiliteit',
    'verbouwing' => 'Renovatielening & Energie',
    'hergroepering' => 'Kredietsamenvoeging / Hergroepering',
];
$purposeTitle = $purposeLabels[$purpose] ?? 'Consumentenkrediet';

$safeName = sk_escape($fullName);
$safeEmail = sk_escape($email);
$safePhone = sk_escape($phone);
$safeCountry = sk_escape("{$country} ({$cleanCountryCode})");
$safeHousing = sk_escape($housingStatus);
$safeEmployment = sk_escape($employmentType);
$safeNotes = $additionalNotes !== '' ? nl2br(sk_escape($additionalNotes)) : '';

$amountEuro = sk_format_euro($amount);
$monthlyEuro = sk_format_euro($monthlyPayment);
$totalRepaymentEuro = sk_format_euro($totalRepayment);
$totalInterestEuro = sk_format_euro($totalInterest);
$incomeEuro = is_numeric($monthlyIncome) ? sk_format_euro($monthlyIncome) : 'Niet opgegeven';
$yearsLabel = number_format($duration / 12, 1, ',', '');

$config = sk_load_env_config();
$notificationDest = $config['NOTIFICATION_EMAIL'];

$notesRow = $safeNotes !== ''
    ? "<tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Toelichting:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9;\">{$safeNotes}</td></tr>"
    : '';

$adminHtml = "
<div style=\"font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; line-height: 1.6;\">
  <div style=\"background-color: #0F4C81; padding: 22px; border-radius: 8px 8px 0 0; text-align: center; color: white;\">
    <span style=\"background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;\">DOSSIERNUMMER {$referenceCode}</span>
    <h2 style=\"margin: 8px 0 0; font-size: 22px;\">Nieuwe Online Kredietaanvraag</h2>
    <p style=\"margin: 4px 0 0; font-size: 13px; color: #93c5fd;\">Ontvangen op {$submissionDate} (Brussel)</p>
  </div>
  <div style=\"padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;\">
    <div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;\">
      <h3 style=\"margin: 0 0 10px; color: #166534; font-size: 16px;\">Financiële Parameters</h3>
      <table style=\"width: 100%; font-size: 13px;\">
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Gevraagd Leenbedrag:</td><td style=\"padding: 4px 0; font-weight: bold; font-size: 16px; color: #0F4C81;\">{$amountEuro}</td></tr>
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Looptijd:</td><td style=\"padding: 4px 0; font-weight: bold;\">{$duration} maanden ({$yearsLabel} jaar)</td></tr>
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Type Krediet:</td><td style=\"padding: 4px 0; font-weight: 600;\">{$purposeTitle}</td></tr>
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Indicatief JKP:</td><td style=\"padding: 4px 0; font-weight: bold; color: #0284c7;\">{$jkp}%</td></tr>
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Geschatte Maandlast:</td><td style=\"padding: 4px 0; font-weight: bold; color: #0F4C81;\">{$monthlyEuro}/maand</td></tr>
        <tr><td style=\"padding: 4px 0; color: #64748b;\">Totale Terugbetaling:</td><td style=\"padding: 4px 0;\">{$totalRepaymentEuro} (waarvan intrest: {$totalInterestEuro})</td></tr>
      </table>
    </div>
    <h3 style=\"margin: 18px 0 10px; color: #0F4C81; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;\">Kredietnemer Gegevens</h3>
    <table style=\"width: 100%; font-size: 13px; border-collapse: collapse;\">
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 160px;\"><strong>Volledige Naam:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;\">{$safeName}</td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Land van verblijf:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0F4C81;\">{$safeCountry}</td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>E-mailadres:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9;\"><a href=\"mailto:{$safeEmail}\" style=\"color: #0F4C81;\">{$safeEmail}</a></td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Telefoonnummer:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;\">{$safePhone}</td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Netto Maandinkomen:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #166534;\">{$incomeEuro}</td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Woonsituatie:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9;\">{$safeHousing}</td></tr>
      <tr><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Beroepssituatie:</strong></td><td style=\"padding: 6px 0; border-bottom: 1px solid #f1f5f9;\">{$safeEmployment}</td></tr>
      {$notesRow}
    </table>
  </div>
</div>
";

$applicantHtml = "
<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px;\">
  <div style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;\">
    <div style=\"background-color: #0F4C81; padding: 26px; text-align: center; color: white;\">
      <h1 style=\"margin: 0; font-size: 24px; font-weight: 800;\">SNEL KREDIET</h1>
      <p style=\"margin: 6px 0 0; font-size: 13px; color: #bfdbfe;\">Erkend Kredietbemiddelaar in België · FSMA 109482 A-B</p>
      <div style=\"margin-top: 12px; display: inline-block; background-color: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: bold;\">
        Referentienummer: {$referenceCode}
      </div>
    </div>
    <div style=\"padding: 24px 28px;\">
      <h2 style=\"color: #0F4C81; font-size: 18px; margin-top: 0;\">Beste {$safeName},</h2>
      <p style=\"font-size: 14px; color: #334155;\">
        Hartelijk dank voor uw aanvraag bij <strong>Snel Krediet</strong>. Wij bevestigen de goede ontvangst van uw vrijblijvende kredietaanvraag.
      </p>
      <div style=\"background-color: #f0f7ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 18px; margin: 20px 0;\">
        <h3 style=\"margin: 0 0 10px; font-size: 15px; color: #0F4C81;\">Overzicht van uw kredietaanvraag</h3>
        <table style=\"width: 100%; font-size: 13px; border-collapse: collapse;\">
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Leenbedrag:</td><td style=\"padding: 4px 0; font-weight: bold; color: #0F4C81; text-align: right;\">{$amountEuro}</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Looptijd:</td><td style=\"padding: 4px 0; font-weight: bold; text-align: right;\">{$duration} maanden</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Type krediet:</td><td style=\"padding: 4px 0; font-weight: 600; text-align: right;\">{$purposeTitle}</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Geschatte maandlast:</td><td style=\"padding: 4px 0; font-weight: bold; color: #0F4C81; text-align: right;\">{$monthlyEuro} / maand</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Vast JKP:</td><td style=\"padding: 4px 0; font-weight: bold; color: #0284c7; text-align: right;\">{$jkp}%</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Land van verblijf:</td><td style=\"padding: 4px 0; font-weight: 600; text-align: right;\">{$safeCountry}</td></tr>
          <tr><td style=\"padding: 4px 0; color: #64748b;\">Telefoonnummer:</td><td style=\"padding: 4px 0; font-weight: 600; text-align: right;\">{$safePhone}</td></tr>
        </table>
      </div>
      <h4 style=\"color: #0F4C81; font-size: 14px; margin: 22px 0 10px;\">Wat gebeurt er nu?</h4>
      <ol style=\"padding-left: 20px; font-size: 13px; color: #334155; margin: 0 0 20px;\">
        <li style=\"margin-bottom: 8px;\"><strong>Dossieranalyse:</strong> Een erkende kredietadviseur analyseert uw aanvraag vertrouwelijk.</li>
        <li style=\"margin-bottom: 8px;\"><strong>Reactie binnen 24 uur:</strong> Wij nemen binnen 24 werkuren contact op ({$safePhone} of e-mail) met een voorstel.</li>
        <li style=\"margin-bottom: 8px;\"><strong>100% Vrijblijvend:</strong> Pas na ondertekening van een bindend aanbod wordt uw krediet definitief.</li>
      </ol>
      <div style=\"background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 14px; margin-top: 20px; font-size: 12px;\">
        <strong style=\"color: #0F4C81; display: block; margin-bottom: 4px;\">Vragen over uw dossier?</strong>
        Vermeld steeds referentie <strong>{$referenceCode}</strong>.<br>
        📞 <strong>+31 97010280754</strong> &nbsp;|&nbsp; ✉️ <strong>contact@snelkrediet.eu</strong>
      </div>
      <div style=\"background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 24px; text-align: center;\">
        <strong style=\"color: #92400e; font-size: 12px; display: block;\">LET OP, GELD LENEN KOST OOK GELD.</strong>
        <span style=\"font-size: 11px; color: #78350f;\">Kredietvorm: Lening op afbetaling conform Boek VII van het Wetboek van economisch recht.</span>
      </div>
    </div>
    <div style=\"background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;\">
      Snel Krediet BV · Wetstraat 145, 1000 Brussel, België · FSMA 109482 A-B
    </div>
  </div>
</div>
";

$adminSubject = "🚨 [Nieuwe Kredietaanvraag {$referenceCode}] {$amountEuro} - {$fullName}";
$adminSent = sk_send_mail($notificationDest, $adminSubject, $adminHtml, $email);

if (!$adminSent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'De e-mailserver op de hosting kon uw aanvraag niet verzenden. Stuur uw aanvraag rechtstreeks naar contact@snelkrediet.eu of bel +31 97010280754.',
    ]);
    exit;
}

$applicantSent = sk_send_mail(
    $email,
    "Bevestiging van uw kredietaanvraag ({$referenceCode}) – Snel Krediet",
    $applicantHtml,
    $notificationDest
);

echo json_encode([
    'success' => true,
    'reference' => $referenceCode,
    'applicantConfirmationSent' => $applicantSent,
    'message' => 'Uw kredietaanvraag is succesvol ontvangen. U ontvangt een bevestiging per e-mail.',
]);
