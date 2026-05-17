<?php
declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'db_manga';
const DB_USER = 'root';
const DB_PASS = '';

const ADMIN_UPLOAD_TOKEN = 'FikriAdminManga2026!';
const API_SECRET = 'PastelComicsRahasia99';

const PUBLIC_BASE_URL = 'http://localhost/manga_api';
const STORAGE_DIR = __DIR__ . '/storage';
const ENCRYPTED_DIR = STORAGE_DIR . '/encrypted';
const COVER_DIR = STORAGE_DIR . '/covers';

function pdo(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function ensure_storage_dirs(): void
{
    foreach ([STORAGE_DIR, ENCRYPTED_DIR, COVER_DIR] as $dir) {
        if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
            throw new RuntimeException('Unable to create storage directory.');
        }
    }
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(mixed $data = null): never
{
    json_response(['ok' => true, 'data' => $data]);
}

function fail(string $message, int $status = 400): never
{
    json_response(['ok' => false, 'error' => $message], $status);
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Invalid JSON body.', 400);
    }

    return $data;
}

function current_user_id(): ?int
{
    $header = $_SERVER['HTTP_X_USER_ID'] ?? '';
    if (preg_match('/^\d+$/', $header) !== 1) {
        return null;
    }

    return (int) $header;
}

function require_user_id(): int
{
    $userId = current_user_id();
    if ($userId === null || $userId <= 0) {
        fail('Authentication required.', 401);
    }

    return $userId;
}

function absolute_public_url(string $path): string
{
    if (preg_match('/^https?:\/\//i', $path) === 1) {
        return $path;
    }

    return rtrim(PUBLIC_BASE_URL, '/') . '/' . ltrim($path, '/');
}

function page_token(int $pageId, int $chapterId): string
{
    return hash_hmac('sha256', $pageId . ':' . $chapterId, API_SECRET);
}

function slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : 'comic';
}
