# Database lokal HEWAN.AI

HEWAN.AI menggunakan IndexedDB di browser sebagai database utama. Aplikasi tidak memerlukan akun, konfigurasi koneksi, server, atau layanan database eksternal.

## Penyimpanan

- `animals`: profil 93 hewan katalog yang di-seed dari `app.js`.
- `knowledge`: materi dasar berbahasa Indonesia dari `animal-knowledge.js` dan `animal-knowledge-expanded.js`, termasuk klasifikasi dari `animal-classification.js`, disimpan bersama sumber dan versi seed.
- `user_records`: histori chat, materi training, dokumen/sumber internet, kandidat, keputusan review, dan tombstone penghapusan.
- `feedback`: feedback rekomendasi.
- `metadata`: versi seed knowledge lokal.

Jika IndexedDB tidak tersedia atau gagal dibuka, HEWAN.AI memakai localStorage sebagai fallback. Penyimpanan hanya tersedia pada browser, profil, dan perangkat yang sama; tidak tersinkron antarperangkat.

## Memulai ulang atau mencadangkan

Materi training menyediakan ekspor/impor JSON. Histori chat dan feedback tersimpan lokal. Menghapus data situs dari pengaturan browser dapat menghapus database lokal; ekspor materi penting sebelum membersihkan data browser.

## Sumber pengetahuan

Setiap profil berisi topik informasi, diet, habitat, perawatan, perilaku, kesejahteraan, dan fakta dengan tautan sumber. Katalog ini berfokus pada hewan pendamping, akuarium, aviari, ternak, dan sebagian invertebrata; tidak mencakup seluruh spesies di dunia. Pola makan, kelas biologis, dan reproduksi dicatat terpisah. Materi umum bukan diagnosis atau pengganti pemeriksaan dokter hewan. Identifikasi spesies dan konsultasi dokter hewan eksotik/akuatik/unggas/ternak diperlukan sesuai hewannya.
