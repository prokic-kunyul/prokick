# PANDUAN OPTIMASI & NEXT STEPS (SEO & CDN)

Dokumen ini berisi panduan teknis untuk pengembangan lanjutan: **SEO** (jika menambah halaman baru) dan **CDN** (untuk upload gambar aman).

---

## 1. PANDUAN SEO (Search Engine Optimization)

### A. Menambah Halaman Baru (Dynamic Metadata)

Setiap kali Anda membuat halaman baru (misal: `/blog/[slug]`), WAJIB tambahkan fungsi `generateMetadata` agar judulnya terbaca Google.

**Contoh Code:**

```tsx
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

// 1. Fungsi ini jalan di Server sebelum halaman dirender
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ambil data dari database
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  return {
    title: `${post.title} | PRESTIGE.SPORT`,
    description: post.summary,
    openGraph: {
      images: [post.image], // Gambar thumbnail saat dishare ke WA/Twitter
    },
  };
}

// 2. Page Component Anda
export default function BlogPage({ params }: Props) {
  // ...
}
```

### B. Update Sitemap (`app/sitemap.ts`)

Jika Anda menambah fitur baru (misal: halaman kategori baru `/categories`), update file `app/sitemap.ts`:

```ts
const routes = [
  "",
  "/products",
  "/categories", // <-- Tambahkan route baru disini
].map((route) => ({
  url: `${baseUrl}${route}`,
  lastModified: new Date(),
  // ...
}));
```

---

## 2. PANDUAN INTEGRASI CDN (UploadThing)

Saat ini upload masih ke folder lokal (Hilang kalau deploy Vercel). Ikuti langkah ini untuk pindah ke Cloud (UploadThing).

### Langkah 1: Install Package

Jalankan di terminal:

```bash
npm install uploadthing @uploadthing/react
```

### Langkah 2: Buat Akun & API Key

1. Buka [uploadthing.com](https://uploadthing.com) -> Login Github.
2. Buat App baru "Prestige Sport".
3. Copy **API Keys** ke file `.env` local dan environment Vercel:
   ```env
   UPLOADTHING_SECRET=sk_live_...
   UPLOADTHING_APP_ID=...
   ```

### Langkah 3: Setup Router (`app/api/uploadthing/core.ts`)

Buat file baru ini untuk mengatur siapa yang boleh upload.

```ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Definisi tipe upload "imageUploader"
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload URL:", file.url);
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### Langkah 4: Setup API Route (`app/api/uploadthing/route.ts`)

Buat file ini untuk menghubungkan Next.js dengan UploadThing.

```ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

### Langkah 5: Pakai di Halaman Admin

Ganti `<input type="file">` lama Anda dengan komponen UploadThing.

```tsx
"use client";
import { UploadButton } from "@/utils/uploadthing"; // (Perlu setup utils dulu, cek dokumentasi)

export default function AdminForm() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // PENTING: Ambil URL dari sini
        const url = res[0].url;
        console.log("Gambar tersimpan di:", url);
        // Simpan 'url' ini ke database Prisma Anda
      }}
      onUploadError={(error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
```

---

**Catatan:** Dokumen ini disimpan di root project sebagai `OPTIMIZATION_TASKS.md`.

---

## 3. LIVE SCORE WIDGET (Integration Guide)

Fitur ini meningkatkan _User Engagement_ tanpa merusak _SEO_ (Server Speed).

### Strategi: Client-Side Fetching (Lazy Load)

Jangan fetch skor di Server Component (layout/page) karena akan memperlambat loading awal. Gunakan `useEffect` di Client Component.

### Contoh Implementasi:

1.  **Daftar API Open Source:**

    - [Football-Data.org](https://www.football-data.org/) (Gratis Tier Tertentu)
    - [API-Football](https://www.api-football.com/)

2.  **Komponen Score (`components/widgets/LiveScore.tsx`):**

    ```tsx
    "use client";
    import { useEffect, useState } from "react";

    export function LiveScore() {
      const [matches, setMatches] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Fetch data HANYA di browser
        fetch("https://api.football-data.org/v4/matches")
          .then((res) => res.json())
          .then((data) => {
            setMatches(data.matches);
            setLoading(false);
          });
      }, []);

      if (loading)
        return <div className="text-white text-xs">Loading Live Scores...</div>;

      return (
        <div className="bg-black/50 p-2 marquee-animation">
          {/* Loop matches disini */}
        </div>
      );
    }
    ```

3.  **Pasang di Layout:**
    Letakkan di bagian paling atas atau bawah navbar, jangan nge-block konten utama.
