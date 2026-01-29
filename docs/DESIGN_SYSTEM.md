# DESIGN SYSTEM - PRESTIGE SPORT 🎨

Dokumen ini berisi panduan visual agar tampilan website tetap konsisten dan "Satu Nafas".

## 1. Color Palette (The Blue Universe)

Kita menggunakan tema **"Deep Space Blue"** untuk menciptakan kesan premium, futuristik, dan kedalaman (depth).

### A. Backgrounds

| Nama                    | Kode Hex                 | Penggunaan                                |
| :---------------------- | :----------------------- | :---------------------------------------- |
| **Deep Navy (Primary)** | `#050A1F`                | Background Utama (Hero, Campaign, Footer) |
| **Pitch Black**         | `#000000`                | Background Card / Overlay Gelap           |
| **Glass White**         | `rgba(255,255,255,0.05)` | Card Panel / Border Transparan            |

### B. Accents & Gradients (The Energy)

| Nama              | Kode Tailwind                         | Penggunaan                            |
| :---------------- | :------------------------------------ | :------------------------------------ |
| **Electric Cyan** | `cyan-400`                            | Highlight Teks, Glow, Tombol Sekunder |
| **Royal Blue**    | `blue-600`                            | Tombol Utama, Gradient Background     |
| **Text Gradient** | `from-cyan-400 via-blue-400 to-white` | Judul Utama (Headings)                |

---

## 2. Typography

Kita menggunakan kombinasi font yang modern dan sporty.

### A. Headings (Judul)

- **Font:** `Russo One` (Google Fonts)
- **Karakter:** Tebal, Kotak, Sporty.
- **Penggunaan:** Judul Besar, Banner, Skor.

### B. Body Text (Isi)

- **Font:** `Geist Sans` (Default Next.js)
- **Karakter:** Bersih, Modern, Mudah Dibaca.
- **Penggunaan:** Deskripsi Produk, Menu, Tombol.

---

## 3. Effects (The Polish)

Efek visual khusus untuk menambah kesan mahal.

### A. Neon Glow

Digunakan pada tombol atau border untuk memberi kesan "menyala".

```css
box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); /* Cyan Glow */
```

### B. Glassmorphism

Digunakan pada kartu produk atau navigasi.

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### C. Immersive Text

Teks besar di background dengan opacity rendah.

- **Opacity:** 10%
- **Blend Mode:** Overlay / Screen
- **Stroke:** Text Transparent + Stroke Only (opsional)

---

**Rules of Thumb:**

> "Jangan gunakan warna Merah/Kuning kecuali untuk Error atau Diskon. Biarkan Biru & Cyan mendominasi untuk menjaga kesan dingin & elegan."
