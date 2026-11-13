<?php
if (basename((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === '_mailer.php') {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Forbidden']);
    exit;
}

function sk_set_json_cors_headers(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

function sk_handle_preflight(): void {
    sk_set_json_cors_headers();
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function sk_read_json_input(): array {
    $raw = file_get_contents('php://input');
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return is_array($_POST) ? $_POST : [];
}

function sk_escape($value): string {
    return htmlspecialchars((string)($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sk_format_euro($amount): string {
    $num = (float)$amount;
    $hasDecimals = abs($num - round($num)) > 0.001;
    return '€ ' . number_format($num, $hasDecimals ? 2 : 0, ',', '.');
}

function sk_html_to_text(string $html): string {
    $text = preg_replace('/<style\b[^>]*>.*?<\/style>/is', '', $html);
    $text = preg_replace('/<br\s*\/?>/i', "\n", (string)$text);
    $text = preg_replace('/<\/(p|div|h1|h2|h3|h4|li|tr)>/i', "\n", (string)$text);
    $text = preg_replace('/<\/td>/i', ' | ', (string)$text);
    $text = strip_tags((string)$text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace("/[ \t]+/", ' ', $text);
    $text = preg_replace("/\n\s+\n/", "\n\n", (string)$text);
    $text = preg_replace("/\n{3,}/", "\n\n", (string)$text);
    return trim((string)$text);
}

function sk_env_value(string $key, string $default = ''): string {
    $val = getenv($key);
    if ($val !== false && trim((string)$val) !== '') {
        return trim((string)$val);
    }
    if (!empty($_ENV[$key])) {
        return trim((string)$_ENV[$key]);
    }
    if (!empty($_SERVER[$key])) {
        return trim((string)$_SERVER[$key]);
    }
    return $default;
}

function sk_load_env_config(): array {
    $config = [
        'SMTP_HOST' => sk_env_value('SMTP_HOST', 'smtp.hostinger.com'),
        'SMTP_PORT' => (int)sk_env_value('SMTP_PORT', '465'),
        'SMTP_USER' => sk_env_value('SMTP_USER', 'contact@snelkrediet.eu'),
        'SMTP_PASS' => sk_env_value('SMTP_PASS', ''),
        'SMTP_FROM_EMAIL' => 'contact@snelkrediet.eu',
        'SMTP_FROM_NAME' => 'Snel Krediet',
        'NOTIFICATION_EMAIL' => sk_env_value('NOTIFICATION_EMAIL', 'contact@snelkrediet.eu'),
    ];

    $phpConfigPaths = [
        dirname(__DIR__, 2) . '/smtp-config.php',
        dirname(__DIR__, 3) . '/smtp-config.php',
        dirname(__DIR__) . '/smtp-config.php',
        __DIR__ . '/smtp-config.php',
        dirname(__DIR__, 2) . '/.smtp-config.php',
        dirname(__DIR__, 3) . '/.smtp-config.php',
        dirname(__DIR__) . '/.smtp-config.php',
        __DIR__ . '/.smtp-config.php',
    ];

    foreach ($phpConfigPaths as $cfgPath) {
        if (is_string($cfgPath) && @is_file($cfgPath) && @is_readable($cfgPath)) {
            $loaded = @include $cfgPath;
            if (is_array($loaded)) {
                if (!empty($loaded['SMTP_HOST'])) $config['SMTP_HOST'] = (string)$loaded['SMTP_HOST'];
                if (!empty($loaded['SMTP_PORT'])) $config['SMTP_PORT'] = (int)$loaded['SMTP_PORT'];
                if (!empty($loaded['SMTP_USER'])) $config['SMTP_USER'] = (string)$loaded['SMTP_USER'];
                if (!empty($loaded['SMTP_PASS'])) $config['SMTP_PASS'] = (string)$loaded['SMTP_PASS'];
                if (!empty($loaded['NOTIFICATION_EMAIL'])) $config['NOTIFICATION_EMAIL'] = (string)$loaded['NOTIFICATION_EMAIL'];
                if ($config['SMTP_PASS'] !== '') {
                    return $config;
                }
            }
        }
    }

    $envPaths = [
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__, 3) . '/.env',
        dirname(__DIR__, 4) . '/.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env',
    ];

    foreach ($envPaths as $path) {
        if (!is_string($path) || !@is_file($path) || !@is_readable($path)) {
            continue;
        }
        $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            continue;
        }
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || strpos($trimmed, '#') === 0 || strpos($trimmed, '=') === false) {
                continue;
            }
            list($k, $v) = explode('=', $trimmed, 2);
            $key = trim($k);
            $val = trim($v);
            $val = trim($val, "\"'");
            if ($key === 'SMTP_HOST' && $val !== '') $config['SMTP_HOST'] = $val;
            if ($key === 'SMTP_PORT' && $val !== '') $config['SMTP_PORT'] = (int)$val;
            if ($key === 'SMTP_USER' && $val !== '') $config['SMTP_USER'] = $val;
            if ($key === 'SMTP_PASS' && $val !== '') $config['SMTP_PASS'] = $val;
            if ($key === 'NOTIFICATION_EMAIL' && $val !== '') $config['NOTIFICATION_EMAIL'] = $val;
        }
        if ($config['SMTP_PASS'] !== '') {
            break;
        }
    }

    return $config;
}

function sk_smtp_expect($socket, int $expectedCode): bool {
    $response = '';
    while (($line = fgets($socket, 1024)) !== false) {
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    $code = (int)substr(trim($response), 0, 3);
    return $code === $expectedCode;
}

function sk_build_multipart_mime(string $htmlBody, string $boundary): string {
    $plainText = sk_html_to_text($htmlBody);
    $plainB64 = chunk_split(base64_encode($plainText));
    $htmlB64 = chunk_split(base64_encode($htmlBody));

    return "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . "{$plainB64}\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . "{$htmlB64}\r\n"
        . "--{$boundary}--\r\n";
}

function sk_generate_message_id(string $domain = 'snelkrediet.eu'): string {
    try {
        $rand = bin2hex(random_bytes(12));
    } catch (\Throwable $e) {
        $rand = str_replace('.', '', uniqid('', true));
    }
    return "<{$rand}.snelkrediet@{$domain}>";
}

function sk_smtp_attempt(
    string $host,
    int $port,
    bool $useStartTls,
    string $username,
    string $password,
    string $fromEmail,
    string $fromName,
    string $toEmail,
    string $subject,
    string $htmlBody,
    string $replyTo = ''
): bool {
    $transport = ($port === 465 && !$useStartTls) ? 'ssl://' . $host : 'tcp://' . $host;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
            'allow_self_signed' => false,
        ],
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 15);
    if (!sk_smtp_expect($socket, 220)) {
        fclose($socket);
        return false;
    }

    $rawHost = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? 'snelkrediet.eu');
    $ehloHost = preg_replace('/[^a-zA-Z0-9.\-]/', '', explode(':', (string)$rawHost)[0]);
    if ($ehloHost === '' || $ehloHost === '_') {
        $ehloHost = 'snelkrediet.eu';
    }

    fwrite($socket, "EHLO {$ehloHost}\r\n");
    if (!sk_smtp_expect($socket, 250)) {
        fclose($socket);
        return false;
    }

    if ($useStartTls) {
        fwrite($socket, "STARTTLS\r\n");
        if (!sk_smtp_expect($socket, 220)) {
            fclose($socket);
            return false;
        }
        $cryptoMethod = defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')
            ? STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
            : STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
            $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
        }
        if (!@stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
            fclose($socket);
            return false;
        }
        fwrite($socket, "EHLO {$ehloHost}\r\n");
        if (!sk_smtp_expect($socket, 250)) {
            fclose($socket);
            return false;
        }
    }

    fwrite($socket, "AUTH LOGIN\r\n");
    if (!sk_smtp_expect($socket, 334)) {
        fclose($socket);
        return false;
    }

    fwrite($socket, base64_encode($username) . "\r\n");
    if (!sk_smtp_expect($socket, 334)) {
        fclose($socket);
        return false;
    }

    fwrite($socket, base64_encode($password) . "\r\n");
    if (!sk_smtp_expect($socket, 235)) {
        fclose($socket);
        return false;
    }

    fwrite($socket, "MAIL FROM:<{$fromEmail}>\r\n");
    if (!sk_smtp_expect($socket, 250)) {
        fclose($socket);
        return false;
    }

    fwrite($socket, "RCPT TO:<{$toEmail}>\r\n");
    if (!sk_smtp_expect($socket, 250)) {
        fclose($socket);
        return false;
    }

    fwrite($socket, "DATA\r\n");
    if (!sk_smtp_expect($socket, 354)) {
        fclose($socket);
        return false;
    }

    $boundary = 'sk_alt_' . md5(uniqid((string)mt_rand(), true));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $safeReplyTo = preg_replace('/[\r\n]+/', '', $replyTo);
    $messageId = sk_generate_message_id('snelkrediet.eu');

    $headers = [
        "Date: " . date('r'),
        "Message-ID: {$messageId}",
        "From: {$encodedFromName} <{$fromEmail}>",
        "To: <{$toEmail}>",
        "Subject: {$encodedSubject}",
        "MIME-Version: 1.0",
        "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        "X-Auto-Response-Suppress: OOF, AutoReply",
    ];
    if ($safeReplyTo !== '' && strcasecmp($safeReplyTo, $fromEmail) !== 0 && filter_var($safeReplyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = "Reply-To: <{$safeReplyTo}>";
    }

    $mimeBody = sk_build_multipart_mime($htmlBody, $boundary);
    $message = implode("\r\n", $headers) . "\r\n\r\n" . $mimeBody . "\r\n.\r\n";

    fwrite($socket, $message);
    $sent = sk_smtp_expect($socket, 250);
    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return $sent;
}

function sk_smtp_send(
    string $host,
    int $port,
    string $username,
    string $password,
    string $fromEmail,
    string $fromName,
    string $toEmail,
    string $subject,
    string $htmlBody,
    string $replyTo = ''
): bool {
    $useStartTls = ($port === 587);
    if (sk_smtp_attempt($host, $port, $useStartTls, $username, $password, $fromEmail, $fromName, $toEmail, $subject, $htmlBody, $replyTo)) {
        return true;
    }

    // Fallback between SSL (465) and STARTTLS (587) on Hostinger
    $altPort = ($port === 465) ? 587 : 465;
    $altStartTls = ($altPort === 587);
    return sk_smtp_attempt($host, $altPort, $altStartTls, $username, $password, $fromEmail, $fromName, $toEmail, $subject, $htmlBody, $replyTo);
}

function sk_smtp_attempt_batch(
    string $host,
    int $port,
    bool $useStartTls,
    string $username,
    string $password,
    string $fromEmail,
    string $fromName,
    array $messages
): ?array {
    $transport = ($port === 465 && !$useStartTls) ? 'ssl://' . $host : 'tcp://' . $host;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
            'allow_self_signed' => false,
        ],
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) {
        return null;
    }

    stream_set_timeout($socket, 15);
    if (!sk_smtp_expect($socket, 220)) {
        fclose($socket);
        return null;
    }

    $rawHost = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? 'snelkrediet.eu');
    $ehloHost = preg_replace('/[^a-zA-Z0-9.\-]/', '', explode(':', (string)$rawHost)[0]);
    if ($ehloHost === '' || $ehloHost === '_') {
        $ehloHost = 'snelkrediet.eu';
    }

    fwrite($socket, "EHLO {$ehloHost}\r\n");
    if (!sk_smtp_expect($socket, 250)) {
        fclose($socket);
        return null;
    }

    if ($useStartTls) {
        fwrite($socket, "STARTTLS\r\n");
        if (!sk_smtp_expect($socket, 220)) {
            fclose($socket);
            return null;
        }
        $cryptoMethod = defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')
            ? STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
            : STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
            $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
        }
        if (!@stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
            fclose($socket);
            return null;
        }
        fwrite($socket, "EHLO {$ehloHost}\r\n");
        if (!sk_smtp_expect($socket, 250)) {
            fclose($socket);
            return null;
        }
    }

    fwrite($socket, "AUTH LOGIN\r\n");
    if (!sk_smtp_expect($socket, 334)) {
        fclose($socket);
        return null;
    }

    fwrite($socket, base64_encode($username) . "\r\n");
    if (!sk_smtp_expect($socket, 334)) {
        fclose($socket);
        return null;
    }

    fwrite($socket, base64_encode($password) . "\r\n");
    if (!sk_smtp_expect($socket, 235)) {
        fclose($socket);
        return null;
    }

    $results = [];
    foreach ($messages as $key => $msg) {
        $cleanTo = preg_replace('/[\r\n]+/', '', trim((string)($msg['to'] ?? '')));
        if ($cleanTo === '' || !filter_var($cleanTo, FILTER_VALIDATE_EMAIL)) {
            $results[$key] = false;
            continue;
        }

        fwrite($socket, "MAIL FROM:<{$fromEmail}>\r\n");
        if (!sk_smtp_expect($socket, 250)) {
            fwrite($socket, "RSET\r\n");
            sk_smtp_expect($socket, 250);
            $results[$key] = false;
            continue;
        }

        fwrite($socket, "RCPT TO:<{$cleanTo}>\r\n");
        if (!sk_smtp_expect($socket, 250)) {
            fwrite($socket, "RSET\r\n");
            sk_smtp_expect($socket, 250);
            $results[$key] = false;
            continue;
        }

        fwrite($socket, "DATA\r\n");
        if (!sk_smtp_expect($socket, 354)) {
            fwrite($socket, "RSET\r\n");
            sk_smtp_expect($socket, 250);
            $results[$key] = false;
            continue;
        }

        $boundary = 'sk_alt_' . md5(uniqid((string)mt_rand(), true));
        $encodedSubject = '=?UTF-8?B?' . base64_encode((string)($msg['subject'] ?? '')) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $safeReplyTo = preg_replace('/[\r\n]+/', '', trim((string)($msg['replyTo'] ?? '')));
        $messageId = sk_generate_message_id('snelkrediet.eu');

        $headers = [
            "Date: " . date('r'),
            "Message-ID: {$messageId}",
            "From: {$encodedFromName} <{$fromEmail}>",
            "To: <{$cleanTo}>",
            "Subject: {$encodedSubject}",
            "MIME-Version: 1.0",
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
            "X-Auto-Response-Suppress: OOF, AutoReply",
        ];
        if ($safeReplyTo !== '' && strcasecmp($safeReplyTo, $fromEmail) !== 0 && filter_var($safeReplyTo, FILTER_VALIDATE_EMAIL)) {
            $headers[] = "Reply-To: <{$safeReplyTo}>";
        }

        $mimeBody = sk_build_multipart_mime((string)($msg['html'] ?? ''), $boundary);
        $payload = implode("\r\n", $headers) . "\r\n\r\n" . $mimeBody . "\r\n.\r\n";

        fwrite($socket, $payload);
        $results[$key] = sk_smtp_expect($socket, 250);
    }

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return $results;
}

function sk_send_batch_mails(array $messages): array {
    $config = sk_load_env_config();
    $fromEmail = $config['SMTP_FROM_EMAIL'];
    $fromName = $config['SMTP_FROM_NAME'];

    if ($config['SMTP_PASS'] !== '') {
        $port = $config['SMTP_PORT'];
        $useStartTls = ($port === 587);
        $batchRes = sk_smtp_attempt_batch(
            $config['SMTP_HOST'],
            $port,
            $useStartTls,
            $config['SMTP_USER'],
            $config['SMTP_PASS'],
            $fromEmail,
            $fromName,
            $messages
        );

        if ($batchRes === null) {
            $altPort = ($port === 465) ? 587 : 465;
            $batchRes = sk_smtp_attempt_batch(
                $config['SMTP_HOST'],
                $altPort,
                ($altPort === 587),
                $config['SMTP_USER'],
                $config['SMTP_PASS'],
                $fromEmail,
                $fromName,
                $messages
            );
        }

        if (is_array($batchRes)) {
            return [
                'results' => $batchRes,
                'method' => 'smtp',
                'smtpConfigured' => true,
            ];
        }
    }

    $results = [];
    foreach ($messages as $key => $msg) {
        $res = sk_send_mail_detailed(
            (string)($msg['to'] ?? ''),
            (string)($msg['subject'] ?? ''),
            (string)($msg['html'] ?? ''),
            (string)($msg['replyTo'] ?? '')
        );
        $results[$key] = (bool)$res['sent'];
    }

    return [
        'results' => $results,
        'method' => 'php_mail',
        'smtpConfigured' => ($config['SMTP_PASS'] !== ''),
    ];
}

function sk_send_mail_detailed(string $toEmail, string $subject, string $htmlBody, string $replyTo = ''): array {
    $cleanTo = preg_replace('/[\r\n]+/', '', trim($toEmail));
    if ($cleanTo === '' || !filter_var($cleanTo, FILTER_VALIDATE_EMAIL)) {
        return ['sent' => false, 'method' => 'invalid'];
    }

    $config = sk_load_env_config();
    $fromEmail = $config['SMTP_FROM_EMAIL'];
    $fromName = $config['SMTP_FROM_NAME'];

    // 1. Prefer authenticated Hostinger SMTP (DKIM + SPF aligned)
    if ($config['SMTP_PASS'] !== '') {
        $smtpOk = sk_smtp_send(
            $config['SMTP_HOST'],
            $config['SMTP_PORT'],
            $config['SMTP_USER'],
            $config['SMTP_PASS'],
            $fromEmail,
            $fromName,
            $cleanTo,
            $subject,
            $htmlBody,
            $replyTo
        );
        if ($smtpOk) {
            return ['sent' => true, 'method' => 'smtp'];
        }
    }

    // 2. Fallback to Hostinger local PHP mail() relay with multipart/alternative + Message-ID
    $boundary = 'sk_alt_' . md5(uniqid((string)mt_rand(), true));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $safeReplyTo = preg_replace('/[\r\n]+/', '', trim($replyTo));
    $messageId = sk_generate_message_id('snelkrediet.eu');

    $headers = [
        "Date: " . date('r'),
        "Message-ID: {$messageId}",
        "MIME-Version: 1.0",
        "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        "From: {$encodedFromName} <{$fromEmail}>",
        "X-Auto-Response-Suppress: OOF, AutoReply",
    ];
    if ($safeReplyTo !== '' && filter_var($safeReplyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = "Reply-To: {$safeReplyTo}";
    }

    $headersStr = implode("\r\n", $headers);
    $mimeBody = sk_build_multipart_mime($htmlBody, $boundary);

    $sent = @mail($cleanTo, $encodedSubject, $mimeBody, $headersStr, "-f {$fromEmail}");
    if (!$sent) {
        $sent = @mail($cleanTo, $encodedSubject, $mimeBody, $headersStr);
    }
    return ['sent' => (bool)$sent, 'method' => 'php_mail'];
}

function sk_send_mail(string $toEmail, string $subject, string $htmlBody, string $replyTo = ''): bool {
    $res = sk_send_mail_detailed($toEmail, $subject, $htmlBody, $replyTo);
    return (bool)$res['sent'];
}

function sk_email_signature_html(): string {
    return '
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px; border-collapse: collapse; margin-top: 22px; border-top: 2px solid #0F4C81; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td style="padding-top: 14px;">
          <div style="font-size: 15px; font-weight: 800; color: #0F4C81; margin: 0 0 3px 0;">
            Team Kredietadvies &mdash; SNEL KREDIET BV
          </div>
          <div style="font-size: 12px; color: #475569; font-weight: 600; margin: 0 0 10px 0;">
            Erkend Kredietbemiddelaar in Belgi&euml; &middot; FSMA 109482 A-B
          </div>
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; font-size: 12px; color: #334155; line-height: 1.65;">
            <tr>
              <td>
                <strong style="color: #0F4C81;">Tel:</strong>
                <a href="tel:+3197010280754" style="color: #1e293b; text-decoration: none; font-weight: 600;">+31 97010280754</a>
              </td>
            </tr>
            <tr>
              <td>
                <strong style="color: #0F4C81;">E-mail:</strong>
                <a href="mailto:contact@snelkrediet.eu" style="color: #0F4C81; text-decoration: none; font-weight: 600;">contact@snelkrediet.eu</a>
              </td>
            </tr>
            <tr>
              <td>
                <strong style="color: #0F4C81;">Web:</strong>
                <a href="https://snelkrediet.eu" style="color: #0F4C81; text-decoration: none; font-weight: 600;">www.snelkrediet.eu</a>
                &nbsp;&middot;&nbsp;
                <span style="color: #007A52; font-weight: 700;">&#9733;&#9733;&#9733;&#9733;&#9733; 4,8/5 Trustpilot</span>
              </td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 11px; padding-top: 4px;">
                Wetstraat 145, 1000 Brussel, Belgi&euml; &middot; Ma. - Vr. 08:30 &ndash; 18:30 | Za. 09:00 &ndash; 13:00
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>';
}
