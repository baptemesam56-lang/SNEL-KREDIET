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

function sk_load_env_config(): array {
    $config = [
        'SMTP_HOST' => getenv('SMTP_HOST') ?: 'smtp.hostinger.com',
        'SMTP_PORT' => (int)(getenv('SMTP_PORT') ?: 465),
        'SMTP_USER' => getenv('SMTP_USER') ?: 'contact@snelkrediet.eu',
        'SMTP_PASS' => getenv('SMTP_PASS') ?: '',
        'SMTP_FROM_EMAIL' => 'contact@snelkrediet.eu',
        'SMTP_FROM_NAME' => 'Snel Krediet',
        'NOTIFICATION_EMAIL' => getenv('NOTIFICATION_EMAIL') ?: 'contact@snelkrediet.eu',
    ];

    $envPaths = [
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__, 3) . '/.env',
        dirname(__DIR__) . '/.env',
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
    $transport = ($port === 465) ? 'ssl://' . $host : $host;
    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT
    );
    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 15);
    if (!sk_smtp_expect($socket, 220)) {
        fclose($socket);
        return false;
    }

    $serverName = $_SERVER['SERVER_NAME'] ?? 'snelkrediet.eu';
    fwrite($socket, "EHLO {$serverName}\r\n");
    if (!sk_smtp_expect($socket, 250)) {
        fclose($socket);
        return false;
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

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $safeReplyTo = preg_replace('/[\r\n]+/', '', $replyTo);
    $headers = [
        "Date: " . date('r'),
        "From: {$encodedFromName} <{$fromEmail}>",
        "To: <{$toEmail}>",
        "Subject: {$encodedSubject}",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
    ];
    if ($safeReplyTo !== '' && filter_var($safeReplyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = "Reply-To: <{$safeReplyTo}>";
    }

    $encodedBody = chunk_split(base64_encode($htmlBody));
    $message = implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody . "\r\n.\r\n";

    fwrite($socket, $message);
    $sent = sk_smtp_expect($socket, 250);
    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return $sent;
}

function sk_send_mail(string $toEmail, string $subject, string $htmlBody, string $replyTo = ''): bool {
    $cleanTo = preg_replace('/[\r\n]+/', '', trim($toEmail));
    if ($cleanTo === '' || !filter_var($cleanTo, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $config = sk_load_env_config();
    $fromEmail = $config['SMTP_FROM_EMAIL'];
    $fromName = $config['SMTP_FROM_NAME'];

    // 1. Use authenticated Hostinger SMTP if credentials are available on server
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
            return true;
        }
    }

    // 2. Fallback to Hostinger local PHP mail() relay
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $safeReplyTo = preg_replace('/[\r\n]+/', '', trim($replyTo));

    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "From: {$encodedFromName} <{$fromEmail}>",
    ];
    if ($safeReplyTo !== '' && filter_var($safeReplyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = "Reply-To: {$safeReplyTo}";
    }

    $headersStr = implode("\r\n", $headers);
    $encodedBody = chunk_split(base64_encode($htmlBody));

    $sent = @mail($cleanTo, $encodedSubject, $encodedBody, $headersStr, "-f {$fromEmail}");
    if (!$sent) {
        $sent = @mail($cleanTo, $encodedSubject, $encodedBody, $headersStr);
    }
    return (bool)$sent;
}
