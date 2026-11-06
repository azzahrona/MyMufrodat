# MufradatKu

Website pembelajaran kosakata Bahasa Arab untuk siswa SD kelas 3. Dibangun sebagai static website menggunakan React, Vite, TypeScript, dan Tailwind CSS.

## Fitur

- Materi kosakata berdasarkan lima tema: buah-buahan, hewan, benda di kelas, anggota tubuh, dan keluarga.
- Kartu kosakata dengan ilustrasi, tulisan Arab berharakat, transliterasi, dan arti Bahasa Indonesia.
- Tombol audio menggunakan Web Speech API (suara Arab mengikuti ketersediaan voice di browser/perangkat).
- Kuis tebak arti dengan 5 pertanyaan acak.
- Matching game dengan sistem pilih/ketuk, tanpa harus drag-and-drop.
- Poin dan progres belajar disimpan di LocalStorage.
- Responsif untuk HP, tablet, dan laptop.
- Tidak membutuhkan login, backend, maupun database.

## Persyaratan

- Node.js versi 20.19+ atau 22.12+ (disarankan versi LTS terbaru yang kompatibel dengan Vite 6).
- npm.
- Visual Studio Code (disarankan).

## Menjalankan di laptop

1. Ekstrak ZIP.
2. Buka folder `MufradatKu` melalui Visual Studio Code.
3. Buka Terminal di VS Code.
4. Jalankan:

```bash
npm install
npm run dev
```

5. Buka alamat lokal yang muncul di terminal, biasanya `http://localhost:5173`.

## Build untuk produksi

```bash
npm run build
```

Hasil build berada di folder `dist`.

Untuk mencoba hasil build:

```bash
npm run preview
```

## Upload ke GitHub

Buat repository baru di GitHub, lalu dari terminal di folder proyek jalankan:

```bash
git init
git add .
git commit -m "Initial commit MufradatKu"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPOSITORY.git
git push -u origin main
```

Ganti `USERNAME` dan `NAMA-REPOSITORY` sesuai repository milikmu.

## Deploy ke Vercel

1. Login ke Vercel.
2. Pilih **Add New → Project**.
3. Import repository GitHub MufradatKu.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Klik **Deploy**.

Setelah repository terhubung, push baru ke branch produksi akan memicu deployment otomatis.

## Menambah kosakata

Data kosakata berada di `src/data/vocabulary.ts`.

Setiap item menggunakan properti:

- `id`: ID unik.
- `categoryId`: ID tema.
- `arabic`: tulisan Arab.
- `transliteration`: cara membaca.
- `meaning`: arti Bahasa Indonesia.
- `emoji`: simbol ilustrasi.
- `image`: path gambar lokal di folder `public/images/vocab`.

Tambahkan file ilustrasi SVG/WebP baru ke `public/images/vocab`, lalu sesuaikan properti `image`.

## Catatan audio

Audio menggunakan `window.speechSynthesis` (Web Speech API). Ketersediaan suara Bahasa Arab berbeda-beda pada setiap browser dan sistem operasi. Jika suara Arab tidak tersedia, transliterasi tetap dapat digunakan sebagai panduan membaca. Untuk hasil pengucapan yang konsisten di semua perangkat, siapkan rekaman MP3 sendiri dan tambahkan pemutar audio lokal pada pengembangan berikutnya.

## Catatan progres

Progres disimpan di browser/perangkat yang digunakan melalui LocalStorage. Data tidak tersinkronisasi antarperangkat dan dapat hilang jika data situs/browser dibersihkan.
