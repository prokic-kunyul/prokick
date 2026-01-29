# PANDUAN DEPLOYMENT (GO-LIVE) 🚀

Dokumen ini menjelaskan langkah-langkah membawa project dari **Laptop (Localhost)** ke **Internet (Production)**.

## 1. Persiapan Database (PENTING)

Saat develop kita pakai `SQLite` (file lokal). Untuk production (Vercel), kita **WAJIB** pakai database cloud seperti **PostgreSQL**.

### Rekomendasi Provider (Gratis Tier):

1.  **Neon.tech** (Sangat mudah, serverless).
2.  **Supabase** (Populer).
3.  **Vercel Postgres** (Integrasi langsung).

### Langkah Migrasi ke PostgreSQL:

1.  Buka `prisma/schema.prisma`.
2.  Ubah `provider` dari `"sqlite"` ke `"postgresql"`.
    ```prisma
    datasource db {
      provider = "postgresql" // Ganti ini
      url      = env("DATABASE_URL")
    }
    ```
3.  Hapus folder `prisma/migrations` lama (karena itu migrasi SQLite).
4.  Jalankan `npx prisma migrate dev --name init_postgres` (Pastikan `.env` sudah pakai URL Postgres).

---

## 2. Setup Environment Variables (Vercel)

Saat setting project baru di Vercel, masukkan variable ini di menu **Settings > Environment Variables**:

| Variable               | Value (Contoh)                      | Kegunaan                       |
| :--------------------- | :---------------------------------- | :----------------------------- |
| `DATABASE_URL`         | `postgres://user:pass@host/db`      | Koneksi Database Cloud         |
| `NEXT_PUBLIC_BASE_URL` | `https://prestige-sport.vercel.app` | Untuk SEO & Sitemap            |
| `UPLOADTHING_SECRET`   | `sk_live_...`                       | (Jika sudah pakai UploadThing) |
| `UPLOADTHING_APP_ID`   | `...`                               | (Jika sudah pakai UploadThing) |

---

## 3. Deployment Flow

1.  **Push ke GitHub:** Pastikan kode terbaru sudah di repo GitHub.
2.  **Import di Vercel:** Connect GitHub Repo ke Vercel.
3.  **Build Command:** Default (`npm run build`) sudah benar.
4.  **Install Command:** Default (`npm install`) sudah benar.
5.  **Output Directory:** Default (`.next`) sudah benar.

### Post-Install Command (Opsional tapi Disarankan)

Agar database otomatis sync saat deploy, tambahkan ini di `package.json` > scripts > `build`:

```json
"build": "npx prisma generate && npx prisma migrate deploy && next build"
```

---

## 4. Checklist Sebelum Launch 📝

- [ ] **Data Seed:** Apakah perlu data awal? (Jalankan `npx prisma db seed` jika ada).
- [ ] **SEO Check:** Cek `robots.txt` dan `sitemap.xml` di URL production.
- [ ] **Images:** Pastikan folder `public/uploads` diganti ke Cloud Storage (karena Vercel tidak menyimpan file upload lokal selamanya).
- [ ] **Domain:** Sambungkan domain custom (misal: `prestigesport.id`) di menu Domains Vercel.

---

**Selamat! Toko Anda sudah Online! 🌍**
