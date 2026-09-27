<p align="center">
  <img src="https://raw.githubusercontent.com/baday4121/HeyDay-Secret/refs/heads/main/public/logo.png" width="100" alt="HeyDay Secret Logo" style="border-radius: 12px; margin-bottom: 10px;">
</p>

<p align="center">
  <h1 align="center">HeyDay Secret - Anonymous Messaging Platform</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-v11.x-red?style=flat-square&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-v4.x-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## 📖 Tentang Aplikasi

**HeyDay Secret** adalah platform aplikasi pesan anonim (mirip Secreto) yang dibangun menggunakan arsitektur modern terpisah: **Backend RESTful API (Laravel 11)** dan **Frontend SPA (React.js + Vite)**. 

Aplikasi ini memungkinkan pengunjung mengirim pesan rahasia secara instan, dan memberikan kontrol penuh kepada pemilik (Admin) untuk membalas, mengarsip, melacak metadata pengirim, hingga mengekspor pesan menjadi gambar (Canvas) untuk dibagikan ke Instagram Story atau WhatsApp.

---

## ✨ Fitur Utama

- **Single Page Application (SPA):** Navigasi super cepat tanpa *reload* browser.
- **API Authentication:** Keamanan *dashboard* admin menggunakan Laravel Sanctum.
- **Pesan & Balasan Anonim:** Komunikasi rahasia 2 arah.
- **Profanity Filter:** Pendeteksi kata kasar/toksik otomatis yang langsung mengarsipkan pesan.
- **Metadata Tracking:** Melacak IP Address, Lokasi, dan Perangkat (User Agent) pengirim secara diam-diam.
- **Telegram Bot Integration:** Notifikasi *real-time* ke Telegram saat ada pesan baru.
- **Story Export (html2canvas):** Ekspor pesan menjadi gambar estetik siap *share* ke IG Story / WhatsApp.
- 🚦 **Rate Limiting:** Mencegah spam pesan beruntun dari IP yang sama.

---

## 📂 Struktur Direktori

Proyek ini dipisahkan menjadi dua ruang lingkup utama:

```text
HeyDay-Secret/
│
├── heyday-backend/     # Server API (Laravel 11, Database, Logika Core)
└── heyday-frontend/    # Client UI (React.js, Tailwind CSS v4, Axios)

```

---

## Panduan Instalasi & Menjalankan Aplikasi

Pastikan komputer Anda sudah terinstal **PHP 8.2+**, **Composer**, **Node.js**, dan **MySQL/MariaDB**.

### Tahap 1: Setup Backend (Laravel API)

1. Masuk ke folder backend:
```bash
cd heyday-backend

```


2. Instal dependensi PHP:
```bash
composer install

```


3. Salin file environment dan *generate* *app key*:
```bash
cp .env.example .env
php artisan key:generate

```


4. Konfigurasi `.env` Anda (Database & Telegram Bot):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=heyday_db
DB_USERNAME=root
DB_PASSWORD=

TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

```


5. Jalankan migrasi database:
```bash
php artisan migrate

```


6. Jalankan server lokal Laravel (berjalan di port 8000):
```bash
php artisan serve

```



### Tahap 2: Setup Frontend (React SPA)

1. Buka terminal baru dan masuk ke folder frontend:
```bash
cd heyday-frontend

```


2. Instal dependensi Node.js:
```bash
npm install

```


3. Jalankan server pengembangan Vite:
```bash
npm run dev

```


4. Buka browser pada alamat: **`http://localhost:5173`**

---

## Akses Admin

Untuk mengakses *Dashboard Admin*, gunakan kredensial yang telah dibuat pada *Database Seeder* (atau daftarkan secara manual di database), lalu akses URL rahasia berikut di browser frontend Anda:

**URL Login:** `http://localhost:5173/login-baday`

*(Akses API Login dilindungi oleh Middleware, pastikan frontend mengirim parameter `?key=qwerty` atau sesuaikan di konfigurasi).*

---

## 📜 Lisensi

Aplikasi ini bersifat *Open-Source* dan dilisensikan di bawah [MIT License](https://opensource.org/license/MIT).