<?php
/**
 * contact.php
 * Handles contact form submissions and returns JSON response.
 * Place this on a PHP-enabled server (e.g., XAMPP, WAMP, or shared hosting).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ---- Sanitize & Validate ----
function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter a valid name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Please enter a subject.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters.';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ---- Send Email ----
// TODO: Replace with your actual email address
$to      = 'yourname@email.com';
$headers = implode("\r\n", [
    'From: Portfolio Contact <noreply@yourportfolio.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
]);

$body = "New message from your portfolio contact form:\n\n"
      . "Name:    {$name}\n"
      . "Email:   {$email}\n"
      . "Subject: {$subject}\n\n"
      . "Message:\n{$message}\n\n"
      . "---\nSent from your 3D Portfolio";

$sent = mail($to, "Portfolio: {$subject}", $body, $headers);

// ---- Log to file (optional) ----
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}
$logEntry = date('Y-m-d H:i:s') . " | {$name} | {$email} | {$subject}\n";
file_put_contents($logDir . '/contacts.log', $logEntry, FILE_APPEND | LOCK_EX);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => "Thanks {$name}! Your message has been sent. I'll get back to you soon."
    ]);
} else {
    // Even if mail() fails (common on localhost), log was saved
    echo json_encode([
        'success' => true,
        'message' => "Thanks {$name}! Your message was received. I'll get back to you soon."
    ]);
}
