<p align="center">
  <img src="https://raw.githubusercontent.com/baday4121/HeyDay-Secret/refs/heads/main/public/logo.png" width="100" alt="HeyDay Secret Logo" style="border-radius: 12px; margin-bottom: 10px;">
</p>

<p align="center">
  <h1 align="center">HeyDay Secret - Anonymous Messaging Platform</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-v11.x-red?style=flat-square&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/TailwindCSS-v3.x-blue?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## Tentang Aplikasi

**HeyDay Secret** adalah platform web aplikasi pesan anonim (mirip Secreto) yang dibangun menggunakan **Laravel**. Aplikasi ini memungkinkan pengguna mengirim pesan rahasia secara anonim kepada pemilik halaman, lengkap dengan sistem manajemen admin, serta integrasi notifikasi melalui **Telegram Bot**.

---

## Teknologi yang Digunakan

* **Backend:** [Laravel](https://laravel.com) (PHP Framework)
* **Database:** MySQL
* **Frontend:** Blade Templating Engine & [Tailwind CSS](https://tailwindcss.com)

---

## Cara Instalasi & Menjalankan Project

1. **Clone Repository ini:**
```bash
git clone https://github.com/baday4121/HeyDay-Secret.git
cd HeyDay-Secret

```

2. **Install Dependensi PHP:**
```bash
composer install

```

3. **Salin File Konfigurasi Lingkungan (.env):**
```bash
copy .env.example .env

```

4. **Generate App Key:**
```bash
php artisan key:generate

```

5. **Konfigurasi Database & Telegram di `.env`:**
```env
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=

TELEGRAM_BOT_TOKEN=masukkan_token_bot
TELEGRAM_CHAT_ID=masukkan_chat_id

```

6. **Jalankan Migrasi Database:**
```bash
php artisan migrate

```

7. **Jalankan Server Lokal:**
```bash
php artisan serve

```

8. Buka browser dan akses `http://localhost:8000`.

---


## Lisensi

Project ini bersifat *open-source* di bawah lisensi [MIT](https://opensource.org/license/MIT).