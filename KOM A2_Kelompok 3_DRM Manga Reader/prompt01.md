# Mega Prompt: Project Reboot - React to Hybrid Android DRM Manga Reader

**Role:** Senior Full-Stack Security Engineer (React, Android Kotlin, PHP/MySQL) specializing in Hybrid DRM Systems.

**Context:**
I have provided a folder named `model_aplikasi` containing a React + Vite + Tailwind project (originally built with Firebase). 
We are rebooting this project into a **Hybrid Android Application**. The React app will act as the frontend UI, hosted on a local XAMPP server, and wrapped inside a **Native Android WebView (Kotlin)**. Firebase must be completely removed and replaced with a custom PHP/MySQL REST API.

**Core Objectives & DRM Architecture:**
1. **Backend (PHP/XAMPP):** Master database for online streaming. Admin uploads must strictly encrypt image files into `.bin` using AES-256-CBC before saving to the server.
2. **Frontend (React):** Re-wire all data fetching from Firebase to the new PHP REST API (`fetch`/`axios`).
3. **Android Wrapper (Kotlin):** A secure WebView application enforcing `FLAG_SECURE` (OS-level anti-screenshot and screen recording prevention).
4. **Offline DRM Bridge:** Android provides a `@JavascriptInterface` (`window.AndroidDRM`) to the React app. 
   - **Download:** When a user clicks download in React, Android fetches the `.bin` from PHP, saves it to App-Specific Internal Storage (`Context.filesDir`), and stores the AES keys in `EncryptedSharedPreferences`. 
   - **Read Offline:** React asks Android for the image, Android decrypts the `.bin` strictly in-memory (on-the-fly), and returns a Base64 string directly to the React `<canvas>` or `<img>`.

**Immediate Tasks for You (The AI):**

**TASK 1: Codebase Analysis & Master Plan**
Analyze the provided `model_aplikasi` folder thoroughly. Create a new file named `DRM_MIGRATION_PLAN.md` at the root. This file MUST contain a highly detailed, checkable list (`[ ]` and `[x]`) divided into:
- What is currently implemented in the provided React code.
- What needs to be deleted (e.g., Firebase configs).
- The exact technical steps needed to achieve the Backend, Frontend, and Android Wrapper objectives.

**TASK 2: Backend Construction (PHP & MySQL)**
Generate the `db_manga.sql` schema and the PHP scripts (`upload_admin.php` for AES encryption and `api.php` for serving JSON data).

**TASK 3: React Refactoring**
Strip out Firebase entirely. Refactor `Library.tsx`, `ComicDetail.tsx`, and `Reader.tsx` to fetch data from the PHP API and trigger the `window.AndroidDRM` bridge for download/offline reading states.

**TASK 4: Android WebView Construction**
Provide the complete Kotlin source code for the Android wrapper:
- `MainActivity.kt` (WebView setup, `FLAG_SECURE`, cleartext traffic config).
- `AndroidDRMBridge.kt` (The Javascript interface handling downloads, secure local storage, and AES-256 decryption).

**Execution Protocol:**
Start immediately by executing **TASK 1**. Output the complete `DRM_MIGRATION_PLAN.md` file based on your analysis of `model_aplikasi`. Do not proceed to Tasks 2, 3, or 4 until I review the plan and say "Proceed".