# Panduan Menyalakan Proyek Komikan

Karena proyek ini memiliki arsitektur yang cukup profesional (terdiri dari Backend API, Admin Panel, dan Aplikasi Android), kamu perlu menyalakannya secara berurutan agar semuanya dapat terhubung dengan baik.

Jika laptopmu baru saja dihidupkan, ikuti 3 langkah mudah di bawah ini:

---

## Langkah 1: Nyalakan Server & Database (XAMPP)
Langkah ini berfungsi untuk mengaktifkan database MySQL dan server Apache yang menjadi tempat API (Backend) bekerja.

1. Buka aplikasi **XAMPP Control Panel** di laptopmu.
2. Klik tombol **Start** pada baris **Apache**. (Tunggu hingga teksnya berubah menjadi hijau, menandakan server PHP berjalan).
3. Klik tombol **Start** pada baris **MySQL**. (Tunggu hingga berubah hijau, menandakan database berjalan).

*(Catatan: Pastikan folder `backend` dari proyek ini sudah dicopy/diletakkan di dalam `C:\xampp\htdocs\manga_api` jika sebelumnya ada pembaruan).*

---

## Langkah 2: Nyalakan Web Admin Panel (React)
Langkah ini untuk menghidupkan website tempat kamu (sebagai Admin) dapat menambah, menghapus, atau mengedit data komik dan chapter.

1. Buka folder proyek utamamu (`C:\Projek kripto`) menggunakan **Visual Studio Code**.
2. Buka terminal bawaan VS Code dengan menekan tombol `` Ctrl + ` `` (backtick, sebelah kiri angka 1).
3. Pindah ke direktori Admin Panel dengan mengetik perintah berikut:
   ```bash
   cd admin_panel
   ```
4. Jalankan server React dengan mengetik:
   ```bash
   npm run dev
   ```
5. Tunggu hingga muncul tulisan `Local: http://localhost:5173/` yang berwarna hijau.
6. Tahan tombol `Ctrl` di keyboard lalu **Klik link tersebut** untuk membuka Web Admin Panel di browsermu.

---

## Langkah 3: Nyalakan Aplikasi Pembaca (Android Studio)
Langkah ini untuk menjalankan aplikasi Android tempat pengguna (user) membaca komik yang sudah terenkripsi.

1. Buka aplikasi **Android Studio**.
2. Pilih opsi **Open** dan arahkan ke folder `android_wrapper` milikmu (tempat kode Kotlin/Android berada).
3. Tunggu sebentar hingga proses *Loading/Gradle Sync* di bagian bawah selesai.
4. Sambungkan HP Android-mu menggunakan kabel USB (pastikan *USB Debugging* aktif), ATAU jalankan *Emulator* bawaan Android Studio.
5. Klik tombol **Play (Segitiga Hijau)** di panel atas Android Studio.
6. Aplikasi **Komikan** akan otomatis ter-install dan terbuka di HP/Emulator kamu.

---

**Selesai! 🎉**
Kini kamu sudah bisa membaca komik di HP secara aman (Anti-Screenshot & Enkripsi berjalan), sambil bebas mengelola data (Upload, Edit, Delete) melalui Admin Panel di browsermu!
