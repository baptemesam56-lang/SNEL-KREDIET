<?php
error_reporting(0);
ini_set('display_errors', '0');

require_once __DIR__ . '/_mailer.php';
sk_handle_preflight();

$config = sk_load_env_config();

echo json_encode([
    'status' => 'ok',
    'runtime' => 'php',
    'emailConfigured' => true,
    'smtpConfigured' => ($config['SMTP_PASS'] !== ''),
    'notificationEmail' => $config['NOTIFICATION_EMAIL'],
]);
