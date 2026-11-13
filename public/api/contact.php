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
$fullName = trim((string)($input['fullName'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$phone = trim((string)($input['phone'] ?? ''));
$country = trim((string)($input['country'] ?? 'België / Belgique'));
$countryCode = strtoupper(trim((string)($input['countryCode'] ?? 'BE')));
$subject = trim((string)($input['subject'] ?? 'Algemene vraag'));
$message = trim((string)($input['message'] ?? ''));

if ($fullName === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Gelieve uw naam, een geldig e-mailadres en een bericht in te vullen.',
    ]);
    exit;
}

date_default_timezone_set('Europe/Brussels');
$contactDate = date('d/m/Y H:i');
$year = date('Y');

$safeName = sk_escape($fullName);
$safeEmail = sk_escape($email);
$safePhone = sk_escape($phone !== '' ? $phone : 'Niet opgegeven');
$safeCountry = sk_escape($country . ($countryCode !== '' ? " ({$countryCode})" : ''));
$safeSubject = sk_escape($subject !== '' ? $subject : 'Algemene vraag');
$safeMessage = nl2br(sk_escape($message));

$config = sk_load_env_config();
$notificationDest = $config['NOTIFICATION_EMAIL'];

$adminHtml = "
<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;\">
  <div style=\"background-color: #0F4C81; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: white;\">
    <h2 style=\"margin: 0; font-size: 22px;\">Nieuw Contactformulier Bericht</h2>
    <p style=\"margin: 5px 0 0; font-size: 13px; color: #93c5fd;\">Ontvangen via www.snelkrediet.eu</p>
  </div>
  <div style=\"padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;\">
    <p style=\"font-size: 14px; margin-top: 0;\"><strong>Tijdstip:</strong> {$contactDate} (Brussel)</p>
    <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">
      <tr>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;\"><strong>Naam:</strong></td>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0F4C81;\">{$safeName}</td>
      </tr>
      <tr>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Land:</strong></td>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;\">{$safeCountry}</td>
      </tr>
      <tr>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>E-mailadres:</strong></td>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9;\"><a href=\"mailto:{$safeEmail}\" style=\"color: #0F4C81; text-decoration: none;\">{$safeEmail}</a></td>
      </tr>
      <tr>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Telefoon:</strong></td>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9;\">{$safePhone}</td>
      </tr>
      <tr>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;\"><strong>Onderwerp:</strong></td>
        <td style=\"padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;\">{$safeSubject}</td>
      </tr>
    </table>
    <div style=\"background-color: #f8fafc; border-left: 4px solid #0F4C81; padding: 15px; border-radius: 4px; margin: 20px 0;\">
      <h4 style=\"margin: 0 0 8px; color: #0F4C81; font-size: 14px;\">Bericht van bezoeker:</h4>
      <p style=\"margin: 0; font-size: 14px; color: #334155;\">{$safeMessage}</p>
    </div>
  </div>
</div>
";

$phoneSummaryRow = $phone !== '' ? "<p style=\"margin: 0 0 4px; color: #64748b;\"><strong>Telefoon:</strong> {$safePhone}</p>" : '';

$customerHtml = "
<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px;\">
  <div style=\"background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;\">
    <div style=\"background-color: #0F4C81; padding: 24px; text-align: center; color: white;\">
      <h1 style=\"margin: 0; font-size: 24px; font-weight: 800;\">SNEL KREDIET</h1>
      <p style=\"margin: 6px 0 0; font-size: 13px; color: #bfdbfe;\">Erkend Kredietbemiddelaar in België · FSMA 109482 A-B</p>
    </div>
    <div style=\"padding: 24px 28px;\">
      <h2 style=\"color: #0F4C81; font-size: 18px; margin-top: 0;\">Beste {$safeName},</h2>
      <p style=\"font-size: 14px; color: #334155;\">
        Wij hebben uw bericht met betrekking tot <strong>\"{$safeSubject}\"</strong> goed ontvangen via onze website.
      </p>
      <p style=\"font-size: 14px; color: #334155;\">
        Onze kredietdeskundigen in Brussel bekijken uw vraag zo snel mogelijk. U ontvangt uiterlijk binnen <strong>24 werkuren</strong> een persoonlijk antwoord per e-mail of telefoon.
      </p>
      <div style=\"background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;\">
        <p style=\"margin: 0 0 6px; font-weight: bold; color: #0F4C81;\">Overzicht van uw ingezonden vraag:</p>
        <p style=\"margin: 0 0 4px; color: #64748b;\"><strong>Land:</strong> {$safeCountry}</p>
        {$phoneSummaryRow}
        <p style=\"margin: 0 0 4px; color: #64748b;\"><strong>Onderwerp:</strong> {$safeSubject}</p>
        <p style=\"margin: 6px 0 0; color: #334155;\">\"{$safeMessage}\"</p>
      </div>
      <div style=\"border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 20px; font-size: 13px; color: #475569;\">
        📞 <strong>+31 97010280754</strong> &nbsp;|&nbsp; ✉️ <strong>contact@snelkrediet.eu</strong> &nbsp;|&nbsp; 📍 Wetstraat 145, 1000 Brussel
      </div>
      <div style=\"background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 24px; text-align: center;\">
        <strong style=\"color: #92400e; font-size: 12px; display: block;\">LET OP, GELD LENEN KOST OOK GELD.</strong>
        <span style=\"font-size: 11px; color: #78350f;\">Kredietvorm: Lening op afbetaling onderworpen aan Boek VII van het Belgisch Wetboek van economisch recht.</span>
      </div>
    </div>
    <div style=\"background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;\">
      © {$year} Snel Krediet BV · Wetstraat 145, 1000 Brussel · KBO BE 0842.193.518 · FSMA 109482 A-B
    </div>
  </div>
</div>
";

$adminSubject = "[Nieuw Contactbericht] " . ($subject !== '' ? $subject : 'Algemene vraag') . " - {$fullName}";
$adminSent = sk_send_mail($notificationDest, $adminSubject, $adminHtml, $email);

if (!$adminSent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'De e-mailserver op de hosting kon uw bericht niet verzenden. Neem gerust rechtstreeks contact op via contact@snelkrediet.eu.',
    ]);
    exit;
}

$customerSent = sk_send_mail(
    $email,
    'Ontvangstbevestiging: Uw vraag aan Snel Krediet',
    $customerHtml,
    $notificationDest
);

echo json_encode([
    'success' => true,
    'customerConfirmationSent' => $customerSent,
    'message' => 'Uw bericht is succesvol verzonden. U ontvangt een bevestiging per e-mail.',
]);
