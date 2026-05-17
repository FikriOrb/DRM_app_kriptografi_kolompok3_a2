# DRM Manga Reader React Frontend

React + Vite UI for the hybrid Android DRM manga reader.

## Run locally

1. Import `../backend/db_manga.sql` into MySQL.
2. Update `../backend/config.php` with database credentials and strong secrets.
3. Place `backend/` under your XAMPP web root, or configure Apache to serve it.
4. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL`.
5. Install and run:

```bash
npm install
npm run dev
```

For Android emulator builds, `VITE_API_BASE_URL` usually needs:

```text
VITE_API_BASE_URL="http://10.0.2.2/backend/api.php"
```

Offline downloads require the native `window.AndroidDRM` bridge from `../android_wrapper`.
