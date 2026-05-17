# DRM Migration Plan

## Scope And Execution Gate

- [x] Analyzed `prompt01.md`.
- [x] Analyzed the existing React project in `model_aplikasi`.
- [x] Confirmed this document is TASK 1 only.
- [ ] Do not execute TASK 2, TASK 3, or TASK 4 until the user reviews this plan and says `Proceed`.

## Current Project Snapshot

- [x] Project folder is `model_aplikasi`.
- [x] Frontend stack is React 19, Vite 6, TypeScript, Tailwind CSS 4, React Router, lucide-react, motion.
- [x] App routes are defined in `src/App.tsx`.
- [x] Main layout and bottom navigation are defined in `src/components/Layout.tsx`.
- [x] Theme state is local-only in `src/context/ThemeContext.tsx`.
- [x] Firebase initialization is centralized in `src/firebase.ts`.
- [x] Firebase config is loaded from `firebase-applet-config.json`.
- [x] Firestore rules exist in `firestore.rules`.
- [x] Firestore data model exists in `firebase-blueprint.json`.
- [x] `package.json` includes `firebase`.
- [x] `package.json` includes `idb` for browser IndexedDB offline storage.
- [x] `package-lock.json` contains Firebase dependency tree.
- [x] No PHP backend exists yet.
- [x] No MySQL schema exists yet.
- [x] No Android/Kotlin wrapper exists yet.
- [x] No `window.AndroidDRM` bridge type or runtime usage exists yet.

## Current React Features Implemented

### Routing And Screens

- [x] `/` renders `Library`.
- [x] `/search` renders `Search`.
- [x] `/history` renders `History` behind `ProtectedRoute`.
- [x] `/profile` renders `Profile`.
- [x] `/downloads` renders `Downloads`.
- [x] `/comic/:id` renders `ComicDetail`.
- [x] `/login` renders `Login`.
- [x] `/read/:comicId/:chapterId` renders `Reader` outside the main layout.

### Authentication

- [x] `src/context/AuthContext.tsx` uses Firebase Auth `onAuthStateChanged`.
- [x] `src/pages/Login.tsx` uses Firebase Google popup login.
- [x] `src/pages/Profile.tsx` uses Firebase `signOut`.
- [x] `ProtectedRoute` depends on Firebase user state.
- [x] User profile creation currently writes to Firestore `users/{uid}`.
- [ ] No custom PHP session or token authentication exists.
- [ ] No Android-provided identity/session bridge exists.

### Firestore Data Access

- [x] `Library.tsx` reads Firestore `favorites` and then `comics`.
- [x] `Search.tsx` reads Firestore `comics` and filters client-side.
- [x] `ComicDetail.tsx` reads Firestore `comics/{id}` and `comics/{id}/chapters`.
- [x] `ComicDetail.tsx` reads/writes/deletes Firestore `favorites`.
- [x] `Reader.tsx` reads Firestore chapter and comic documents.
- [x] `Reader.tsx` writes Firestore `history`.
- [x] `History.tsx` reads and deletes Firestore `history`.
- [x] `History.tsx` joins history items with Firestore comic and chapter documents.
- [ ] No frontend API client abstraction exists.
- [ ] No PHP REST endpoints are consumed by the React app.

### Offline Reading

- [x] `src/services/offlineStorage.ts` uses IndexedDB through `idb`.
- [x] Offline metadata is stored in IndexedDB object stores `comics`, `chapters`, and `images`.
- [x] Current download logic fetches raw image URLs directly from the browser.
- [x] Current offline image rendering uses `URL.createObjectURL(blob)`.
- [x] `Downloads.tsx` lists IndexedDB-downloaded comics and chapters.
- [x] `ComicDetail.tsx` uses `downloadChapter`, `removeChapterOffline`, `isChapterDownloaded`, and `getDownloadedChapters`.
- [x] `Reader.tsx` uses `isChapterDownloaded` and `getOfflineImageUrls`.
- [ ] Current offline implementation does not encrypt image blobs.
- [ ] Current offline implementation stores images in browser IndexedDB, not Android app-specific internal storage.
- [ ] Current offline implementation does not store AES keys in Android `EncryptedSharedPreferences`.
- [ ] Current offline implementation does not decrypt on the Android side.

### UI And Types

- [x] `src/types.ts` defines `UserProfile`, `Comic`, `Chapter`, `Favorite`, `HistoryItem`.
- [x] `src/types.ts` still defines Firestore-specific `OperationType` and `FirestoreErrorInfo`.
- [x] `src/utils.ts` has `handleFirestoreError` and imports Firebase auth.
- [x] `ComicCard.tsx` expects public `coverUrl` strings.
- [x] `Reader.tsx` renders pages as normal `<img>` elements.
- [ ] No DRM-safe canvas renderer exists.
- [ ] No explicit screen-capture prevention exists in React, because that must be enforced by Android `FLAG_SECURE`.

## Firebase And Browser Offline Items To Delete Or Replace

- [ ] Delete `model_aplikasi/src/firebase.ts`.
- [ ] Delete `model_aplikasi/firebase-applet-config.json`.
- [ ] Delete `model_aplikasi/firebase-blueprint.json` after its schema is migrated to SQL documentation.
- [ ] Delete `model_aplikasi/firestore.rules`.
- [ ] Remove `firebase` from `model_aplikasi/package.json`.
- [ ] Regenerate `model_aplikasi/package-lock.json` after removing Firebase.
- [ ] Remove Firebase imports from `AuthContext.tsx`.
- [ ] Remove Firebase imports from `Login.tsx`.
- [ ] Remove Firebase imports from `Profile.tsx`.
- [ ] Remove Firebase imports from `Library.tsx`.
- [ ] Remove Firebase imports from `Search.tsx`.
- [ ] Remove Firebase imports from `ComicDetail.tsx`.
- [ ] Remove Firebase imports from `Reader.tsx`.
- [ ] Remove Firebase imports from `History.tsx`.
- [ ] Replace `handleFirestoreError` with a generic `handleApiError` or typed API error helper.
- [ ] Remove Firestore-specific types from `src/types.ts`.
- [ ] Replace or remove `src/services/offlineStorage.ts`; browser IndexedDB must not be the DRM storage source for protected pages.
- [ ] Decide whether `idb` remains for non-sensitive UI metadata only; remove it if not needed.
- [ ] Remove AI Studio/Gemini-only env assumptions from `.env.example` if this app no longer uses Gemini.
- [ ] Remove Vite `process.env.GEMINI_API_KEY` define if unused.

## Target Architecture

- [ ] PHP/XAMPP is the online backend and master data source.
- [ ] MySQL stores users, comics, genres, chapters, page metadata, favorites, history, and download grants.
- [ ] Admin upload flow encrypts every manga page before saving it as `.bin`.
- [ ] PHP never stores plaintext page files on disk after encryption succeeds.
- [ ] Online reader receives metadata and secure page URLs, not plaintext filesystem paths.
- [ ] Android WebView hosts the React frontend from local XAMPP URL.
- [ ] Android `MainActivity` enforces `FLAG_SECURE`.
- [ ] Android injects `window.AndroidDRM`.
- [ ] React calls `window.AndroidDRM` for download, offline availability checks, offline page retrieval, and deletion.
- [ ] Android downloads encrypted `.bin` files from PHP.
- [ ] Android stores encrypted `.bin` files under `Context.filesDir`.
- [ ] Android stores AES key and IV material using `EncryptedSharedPreferences`.
- [ ] Android decrypts pages strictly in memory and returns Base64 data to React.
- [ ] React displays offline decrypted data via `<canvas>` or `<img src="data:...">`.

## Backend Plan: PHP And MySQL

### Files To Add In TASK 2

- [ ] Add `backend/db_manga.sql`.
- [ ] Add `backend/config.php`.
- [ ] Add `backend/api.php`.
- [ ] Add `backend/upload_admin.php`.
- [ ] Add `backend/.htaccess` if Apache routing or file access hardening is needed.
- [ ] Add `backend/uploads/.gitkeep` or document the runtime-only upload directory.
- [ ] Add `backend/storage/encrypted/.gitkeep` or document the runtime-only encrypted storage directory.

### Database Schema

- [ ] Create database `db_manga`.
- [ ] Create `users` table with local user ids, email, display name, avatar, password hash or external device token fields, timestamps.
- [ ] Create `comics` table with title, slug, description, author, cover path, status, rating, timestamps.
- [ ] Create `genres` table.
- [ ] Create `comic_genres` join table.
- [ ] Create `chapters` table with comic id, chapter number, title, timestamps.
- [ ] Create `chapter_pages` table with chapter id, page index, encrypted file path, mime type, byte size, checksum, key id, timestamps.
- [ ] Create `page_keys` or `drm_keys` table only if keys are kept server-side for online grant creation; prefer minimal exposure and never return keys to browser JavaScript.
- [ ] Create `favorites` table with unique `(user_id, comic_id)`.
- [ ] Create `reading_history` table with unique `(user_id, comic_id)` and latest chapter.
- [ ] Create `download_grants` table if the Android bridge must request time-limited access to encrypted page URLs and wrapped keys.
- [ ] Add foreign keys and indexes for comic lookup, chapter listing, favorites, history, and page ordering.

### Upload And Encryption

- [ ] `upload_admin.php` must validate admin authentication before accepting uploads.
- [ ] Accept comic metadata, chapter metadata, cover image, and page images.
- [ ] Validate allowed MIME types, file extensions, file sizes, and image dimensions.
- [ ] Store cover images either public or separately encrypted depending on product policy; current UI expects public covers.
- [ ] Generate a unique AES-256 key and random IV per page or per chapter.
- [ ] Encrypt page bytes using AES-256-CBC through `openssl_encrypt` with raw binary output.
- [ ] Write only encrypted output as `.bin`.
- [ ] Store IV, checksum, mime type, original extension, page index, and encrypted path in MySQL.
- [ ] Remove temporary plaintext upload files after encryption.
- [ ] Return structured JSON with created comic/chapter/page ids.
- [ ] Log upload errors without leaking keys or filesystem internals to clients.

### API Endpoints

- [ ] `GET /backend/api.php?action=comics` returns list of comics with genres and cover URLs.
- [ ] `GET /backend/api.php?action=search&q=&genres=` returns filtered comics.
- [ ] `GET /backend/api.php?action=comic&id=` returns one comic.
- [ ] `GET /backend/api.php?action=chapters&comic_id=` returns chapter list ordered by number descending.
- [ ] `GET /backend/api.php?action=chapter&comic_id=&chapter_id=` returns chapter metadata and page descriptors.
- [ ] `POST /backend/api.php?action=login` supports replacement auth if local login is implemented.
- [ ] `POST /backend/api.php?action=logout` clears local session/token if implemented.
- [ ] `GET /backend/api.php?action=profile` returns current user profile if authenticated.
- [ ] `GET /backend/api.php?action=favorites` returns favorite comics for current user.
- [ ] `POST /backend/api.php?action=favorite` toggles or creates a favorite.
- [ ] `DELETE /backend/api.php?action=favorite&comic_id=` removes a favorite.
- [ ] `GET /backend/api.php?action=history` returns reading history with comic/chapter joins.
- [ ] `POST /backend/api.php?action=history` records last-read chapter.
- [ ] `DELETE /backend/api.php?action=history&id=` deletes a history item.
- [ ] `POST /backend/api.php?action=download_grant` returns encrypted page URLs and key metadata only to an authenticated Android bridge flow.
- [ ] Ensure all JSON responses use a stable envelope such as `{ "ok": true, "data": ... }` and `{ "ok": false, "error": ... }`.

### Backend Security Controls

- [ ] Use PDO with prepared statements only.
- [ ] Set JSON and CORS headers deliberately for the XAMPP/WebView origin.
- [ ] Do not expose filesystem absolute paths.
- [ ] Deny direct web access to key files and non-public storage.
- [ ] Place encrypted files outside the web root when possible; otherwise protect with route-level access checks.
- [ ] Add request method checks per action.
- [ ] Add admin upload CSRF protection or admin token validation.
- [ ] Add rate limiting or basic abuse protection for auth and download grant endpoints.
- [ ] Do not return AES keys to ordinary browser JavaScript.
- [ ] If keys must be delivered for offline DRM, deliver them only to Android-native code over authenticated HTTPS or controlled local development HTTP.

## Frontend Plan: React Refactor

### API Client

- [ ] Add `src/services/api.ts`.
- [ ] Define `API_BASE_URL` using Vite env, defaulting to XAMPP path such as `http://10.0.2.2/backend/api.php` for Android emulator or configured LAN IP for device.
- [ ] Add typed helpers for `getComics`, `searchComics`, `getComic`, `getChapters`, `getChapter`, `getFavorites`, `toggleFavorite`, `getHistory`, `saveHistory`, and `deleteHistory`.
- [ ] Normalize PHP response envelopes to TypeScript models.
- [ ] Replace Firestore error handling with API error handling.

### Android DRM Bridge Types

- [ ] Add `src/types/android-drm.d.ts` or extend `src/types.ts`.
- [ ] Define `window.AndroidDRM.downloadChapter(payloadJson: string): string | Promise-like result pattern`.
- [ ] Define `window.AndroidDRM.isChapterDownloaded(comicId: string, chapterId: string): boolean`.
- [ ] Define `window.AndroidDRM.removeChapter(comicId: string, chapterId: string): boolean`.
- [ ] Define `window.AndroidDRM.getOfflinePage(comicId: string, chapterId: string, pageIndex: number): string`.
- [ ] Define `window.AndroidDRM.getDownloadedChapters(comicId: string): string`.
- [ ] Add a browser fallback only for development, not for DRM production.

### Auth Strategy

- [ ] Decide final auth replacement: PHP session, JWT, Android-provided user/device token, or local guest mode.
- [ ] Refactor `AuthContext.tsx` away from Firebase.
- [ ] Refactor `Login.tsx` away from Google popup.
- [ ] Refactor `Profile.tsx` away from Firebase `signOut`.
- [ ] Update `ProtectedRoute` to use the new auth state.
- [ ] Ensure favorites/history endpoints include user identity.

### Required Page Refactors

- [ ] Refactor `Library.tsx` to call `api.getFavorites()` or `api.getLibrary()`.
- [ ] Refactor `ComicDetail.tsx` to call `api.getComic(id)` and `api.getChapters(id)`.
- [ ] Refactor `ComicDetail.tsx` favorite toggle to call PHP API.
- [ ] Refactor `ComicDetail.tsx` download button to call `window.AndroidDRM.downloadChapter(...)`.
- [ ] Refactor `ComicDetail.tsx` downloaded-state checks to call `window.AndroidDRM.getDownloadedChapters(...)` or `isChapterDownloaded(...)`.
- [ ] Refactor `Reader.tsx` to call `api.getChapter(comicId, chapterId)` for online metadata.
- [ ] Refactor `Reader.tsx` to use Android offline pages when `window.AndroidDRM.isChapterDownloaded(...)` is true.
- [ ] Refactor `Reader.tsx` to call `api.saveHistory(...)` instead of Firestore `setDoc`.
- [ ] Update `Reader.tsx` rendering path so offline Base64 pages can be displayed without storing plaintext in IndexedDB.

### Additional Page Refactors

- [ ] Refactor `Search.tsx` to use PHP search/list endpoint.
- [ ] Refactor `History.tsx` to use PHP history endpoints.
- [ ] Refactor `Downloads.tsx` to use Android bridge instead of IndexedDB.
- [ ] Refactor `utils.ts` to remove Firebase references.
- [ ] Refactor `types.ts` to use API/DRM naming instead of Firestore naming.
- [ ] Update `.env.example` with `VITE_API_BASE_URL`.
- [ ] Update `README.md` with XAMPP, PHP, MySQL, React build, and Android WebView run instructions.

### Frontend DRM Boundaries

- [ ] Online streaming should not cache plaintext pages in IndexedDB.
- [ ] Offline reading should request one decrypted page at a time from Android.
- [ ] React should avoid logging Base64 page data.
- [ ] React should revoke object URLs if any are still used for non-DRM assets.
- [ ] React should show clear unsupported-environment UI when Android bridge is required but unavailable.

## Android Wrapper Plan

### Files To Provide In TASK 4

- [ ] Provide `MainActivity.kt`.
- [ ] Provide `AndroidDRMBridge.kt`.
- [ ] Provide required `AndroidManifest.xml` entries.
- [ ] Provide `network_security_config.xml` for local XAMPP cleartext traffic where needed.
- [ ] Provide Gradle dependency notes for WebView, Security Crypto, coroutines/OkHttp if used.

### MainActivity

- [ ] Enable `WindowManager.LayoutParams.FLAG_SECURE`.
- [ ] Configure WebView JavaScript.
- [ ] Configure DOM storage only if required by the React app.
- [ ] Restrict navigation to trusted local/XAMPP origins.
- [ ] Add `AndroidDRMBridge` as `window.AndroidDRM`.
- [ ] Load React URL from local XAMPP, emulator host `10.0.2.2`, or configured device URL.
- [ ] Configure cleartext traffic only for development/local XAMPP target.
- [ ] Disable WebView debugging for release builds.
- [ ] Handle back navigation through WebView history.

### AndroidDRMBridge

- [ ] Expose `@JavascriptInterface` methods consumed by React.
- [ ] Download encrypted `.bin` files from PHP with authenticated requests.
- [ ] Store encrypted files under app-specific internal storage.
- [ ] Store key and IV material in `EncryptedSharedPreferences`.
- [ ] Maintain local metadata for comics, chapters, pages, and download status.
- [ ] Decrypt AES-256-CBC pages in memory only.
- [ ] Return Base64 data URL or raw Base64 plus MIME type to React.
- [ ] Delete encrypted files and keys when the user removes a download.
- [ ] Validate all input ids and page indexes received from JavaScript.
- [ ] Avoid returning keys, IVs, or file paths to JavaScript.
- [ ] Return structured JSON strings for success/error to keep bridge behavior predictable.

## Data Model Mapping

- [x] Firestore `users` maps to MySQL `users`.
- [x] Firestore `comics` maps to MySQL `comics`.
- [x] Firestore `comics/{comicId}/chapters` maps to MySQL `chapters` plus `chapter_pages`.
- [x] Firestore array field `genres` maps to MySQL `genres` and `comic_genres`.
- [x] Firestore `favorites` maps to MySQL `favorites`.
- [x] Firestore `history` maps to MySQL `reading_history`.
- [ ] Current `Chapter.images: string[]` must become page descriptors, such as `{ id, pageIndex, streamUrl, encryptedUrl, mimeType }`.
- [ ] Current `Comic.coverUrl` can remain public URL unless covers are also encrypted.
- [ ] Current user id type must be normalized from Firebase UID to local PHP user id or device/user token.

## Verification Plan

- [ ] After TASK 2, import `db_manga.sql` into MySQL and verify tables/indexes.
- [ ] After TASK 2, test `upload_admin.php` with sample images and confirm only `.bin` pages persist.
- [ ] After TASK 2, call each `api.php?action=...` endpoint with valid and invalid inputs.
- [ ] After TASK 3, run `npm install` if dependency changes require lockfile updates.
- [ ] After TASK 3, run `npm run lint`.
- [ ] After TASK 3, run `npm run build`.
- [ ] After TASK 3, search for remaining `firebase`, `Firestore`, `firebase.ts`, and `idb` references.
- [ ] After TASK 4, build Android project.
- [ ] After TASK 4, verify WebView loads the React app.
- [ ] After TASK 4, verify screenshots and screen recordings are blocked by `FLAG_SECURE`.
- [ ] After TASK 4, verify download stores `.bin` files internally.
- [ ] After TASK 4, verify keys are stored in encrypted preferences.
- [ ] After TASK 4, verify offline reading works with network disabled.
- [ ] After TASK 4, verify decrypted plaintext files are not written to disk.

## Open Decisions Before Proceeding

- [ ] Choose auth model: PHP username/password, PHP token, Android device-bound token, or guest-only local profile.
- [ ] Choose whether covers are public images or encrypted DRM assets.
- [ ] Choose whether online streaming decrypts on PHP server per request or sends encrypted `.bin` only to Android for decryption.
- [ ] Choose XAMPP URL strategy for physical Android devices, since `localhost` inside Android is not the PC.
- [ ] Choose whether React should support browser-only development without Android DRM, and what feature limitations apply.
- [ ] Choose whether the Android wrapper source should be generated as a full Android project or source files only.
