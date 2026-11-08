# Product Requirements Document (PRD)

# Sistem Informasi Operasional Garasi Hobby

**Versi:** 1.1  
**Status:** Draft hasil klarifikasi awal untuk validasi stakeholder  
**Tanggal:** 23 September 2026  
**Product Owner / Sponsor:** Pak Arif — Owner Garasi Hobby  
**Project Manager / System Analyst:** Aya  
**Backend / Database Engineer:** Ilyas  
**Frontend Engineer:** Syamil  
**Platform:** Web responsif / Progressive Web App (PWA)  
**Bahasa utama:** Bahasa Indonesia  
**Mata uang:** Rupiah Indonesia (IDR)  
**Zona waktu:** Asia/Jakarta  
**Cakupan kendaraan:** Seluruh jenis motor

> **Keputusan produk utama:** Garasi Hobby memiliki dua domain operasional yang saling terhubung, yaitu **showroom motor** dan **bengkel**. Keduanya menjadi bagian MVP, menggunakan satu sistem, satu basis data terpusat, satu manajemen pengguna, satu identitas motor lintas siklus kepemilikan, dan satu dashboard owner. MVP diprioritaskan untuk penggunaan internal, bukan marketplace publik.

---

## 1. Ringkasan Eksekutif

Garasi Hobby menggabungkan aktivitas showroom atau jual-beli motor dengan layanan bengkel. Sistem harus dapat mencatat seluruh jenis motor. Operasional saat ini masih mengandalkan buku dan notepad untuk mencatat motor, stok, transaksi, dan pekerjaan servis. Cara kerja tersebut menyulitkan pemilik untuk mengetahui kondisi usaha secara cepat, terutama ketika pemilik ingin mendelegasikan pekerjaan harian kepada tim tanpa kehilangan kontrol atas stok, transaksi, harga, dan profit.

Produk yang akan dibangun adalah **Sistem Informasi Operasional Garasi Hobby** berbentuk web responsif atau PWA. Sistem dapat digunakan dari ponsel dan laptop serta dapat mencatat seluruh jenis motor. Produk mengelola dua domain utama. Domain showroom menangani inventaris, foto, status, pelanggan pembeli, dan transaksi penjualan motor. Domain bengkel menangani penerimaan motor, foto kondisi awal, work order, estimasi, pengerjaan, pemakaian suku cadang, transaksi servis, dan nota. Kedua domain berbagi master pelanggan, identitas motor, stok suku cadang, pembayaran, laporan, dan audit aktivitas.

Fokus MVP adalah membuat proses operasional tercatat secara konsisten dan mudah digunakan oleh staf. Sistem harus cukup sederhana untuk dipakai dalam aktivitas harian, tetapi tetap memberikan kontrol yang memadai kepada Pak Arif sebagai owner. Pembayaran penuh didukung melalui tunai dan transfer bank yang dikonfirmasi manual, serta QRIS dan e-wallet yang dikonfirmasi otomatis melalui payment gateway. Provider payment gateway masih menjadi keputusan terbuka. Fitur marketplace distributor, integrasi WhatsApp, akuntansi formal, payroll, dan manajemen media sosial tidak termasuk dalam MVP.[1] [2]

---

## 2. Status Dokumen dan Cara Penggunaan

Dokumen ini menjadi baseline kebutuhan produk untuk analisis, desain UI/UX, perancangan basis data, pengembangan frontend dan backend, pengujian, serta User Acceptance Test (UAT). Setiap requirement memiliki identitas unik agar dapat ditelusuri ke desain, task pengembangan, test case, dan hasil UAT. Versi 1.1 memasukkan hasil klarifikasi awal tentang scope showroom dan bengkel, pembayaran, foto, stok, motor, diskon, cabang, serta migrasi. Poin yang belum diketahui tidak diasumsikan sebagai fakta dan tetap dicatat sebagai keputusan terbuka.

Istilah **harus** menunjukkan requirement wajib pada rilis yang ditetapkan oleh kolom prioritas. Istilah **sebaiknya** menunjukkan requirement bernilai tinggi yang belum wajib. P0 wajib pada MVP, sedangkan requirement P1 yang memakai kata *harus* baru bersifat wajib ketika Release 1.1 dikerjakan. Poin yang masih memerlukan keputusan Pak Arif ditandai sebagai **keputusan terbuka**. Requirement baru yang mengubah modul, pengguna, integrasi, biaya, atau jadwal harus diproses melalui change request.

### 2.1 Definisi prioritas

| Prioritas | Definisi | Konsekuensi rilis |
|---|---|---|
| **P0 — Wajib MVP** | Fungsi inti tanpa alternatif manual yang layak atau fungsi yang menentukan integritas transaksi. | Produk tidak dapat diterima jika requirement gagal. |
| **P1 — Penting** | Fungsi yang meningkatkan kontrol, efisiensi, dan kualitas operasional secara signifikan. | Dikerjakan setelah P0 stabil atau dimasukkan dalam rilis 1.1. |
| **P2 — Lanjutan** | Fungsi ekspansi, optimasi, atau integrasi yang tidak diperlukan untuk validasi MVP. | Masuk backlog fase berikutnya. |

### 2.2 Ringkasan perubahan versi 1.1

| Area | Perubahan utama |
|---|---|
| Scope | Bengkel, showroom core, dan penjualan barang langsung dipastikan masuk MVP; inquiry/follow-up tetap Release 1.1. |
| Motor | Sistem menerima seluruh jenis motor dan menggunakan satu identitas motor lintas showroom, kepemilikan pelanggan, dan servis. |
| Stok | Stock movement menjadi source of truth; pemakaian barang WO mengurangi stok saat dikonfirmasi dan modal memakai weighted average cost. |
| Pembayaran | Pembayaran wajib lunas; tunai/transfer manual serta QRIS/e-wallet otomatis melalui payment gateway. |
| Foto | Foto showroom dan kondisi awal bengkel menjadi P0 dengan jumlah minimum, batas format/ukuran, kompresi, dan akses privat. |
| Kontrol | Diskon configurable dengan default 0%, approval owner, audit, dan mekanik/PIC tanpa akun login. |
| Ekspansi | MVP satu lokasi, tetapi model data memiliki location agar siap dikembangkan untuk cabang. |
| Migrasi | Hanya data aktif, opening balance, motor/pelanggan relevan, dan WO berjalan yang dimigrasikan. |

---

## 3. Latar Belakang dan Masalah Bisnis

Showroom dan bengkel sebelumnya berjalan di lokasi berbeda, kemudian digabungkan di satu lokasi. Penggabungan tersebut meningkatkan kebutuhan akan pencatatan terpadu. Data motor, barang, servis, pemasukan, dan aktivitas pengguna perlu disimpan dalam satu sistem agar alur antara showroom, bengkel, stok, dan owner tidak terputus.[1]

Masalah bisnis yang harus diselesaikan adalah sebagai berikut.

| ID | Masalah saat ini | Dampak bisnis |
|---|---|---|
| PB-01 | Pencatatan motor, barang, dan transaksi masih menggunakan buku atau notepad. | Data mudah tercecer, pencarian lambat, dan histori sulit ditelusuri. |
| PB-02 | Stok suku cadang berjumlah banyak dan belum dikendalikan dalam satu sistem. | Barang dapat habis tanpa diketahui dan pembelian ulang terlambat. |
| PB-03 | Barang keluar akibat servis atau penjualan tidak selalu langsung mengubah catatan stok. | Saldo stok tidak mencerminkan kondisi fisik. |
| PB-04 | Owner tidak ingin terlibat dalam seluruh aktivitas operasional harian. | Delegasi sulit dilakukan karena kontrol masih bergantung pada kepercayaan dan catatan manual. |
| PB-05 | Harga modal, harga jual, dan biaya jasa tersebar atau bergantung pada ingatan staf. | Risiko salah harga, margin tidak terpantau, dan layanan tidak konsisten. |
| PB-06 | Nota servis belum dihasilkan melalui sistem yang terhubung ke detail jasa dan barang. | Rekap transaksi dan penggunaan suku cadang membutuhkan pekerjaan ulang. |
| PB-07 | Data motor showroom dan motor servis belum dibedakan secara sistematis. | Status, kepemilikan, dan tujuan keberadaan motor sulit dipantau. |
| PB-08 | Kemampuan digital staf operasional beragam. | Sistem yang kompleks berisiko tidak dipakai dan operasional kembali ke pencatatan manual. |
| PB-09 | Owner membutuhkan informasi melalui ponsel. | Sistem yang bergantung pada laptop tidak sesuai pola kerja owner. |
| PB-10 | Belum ada histori aktivitas pengguna yang memadai. | Kesalahan dan potensi kecurangan sulit diperiksa. |

---

## 4. Visi Produk, Prinsip, dan Sasaran

### 4.1 Visi produk

> Menjadi pusat pencatatan operasional Garasi Hobby yang sederhana, dapat dipercaya, dan mudah diakses dari ponsel sehingga showroom dan bengkel dapat dijalankan oleh tim, sementara owner tetap memiliki kontrol atas motor, stok, transaksi, dan profit.

### 4.2 Prinsip produk

1. **Mobile-first.** Aktivitas penting harus nyaman dilakukan atau dipantau dari ponsel.
2. **Sederhana untuk staf.** Alur input harus pendek, menggunakan bahasa operasional, dan meminimalkan field yang tidak diperlukan.
3. **Satu sumber data.** Showroom, bengkel, stok, transaksi, dan laporan harus menggunakan data yang sama.
4. **Transaksi dapat ditelusuri.** Setiap perubahan stok dan status harus memiliki sumber serta pengguna yang bertanggung jawab.
5. **Owner by exception.** Owner tidak perlu menginput semua aktivitas. Owner perlu melihat ringkasan, peringatan, approval, dan penyimpangan.
6. **Tidak mengorbankan integritas demi kecepatan.** Transaksi finansial dan stok tidak boleh dihapus tanpa jejak.
7. **Branding fleksibel.** Nama, logo, warna, alamat, dan identitas nota harus dapat diubah karena identitas Garasi Hobby masih berkembang.[1]

### 4.3 Sasaran dan metrik keberhasilan

| ID | Sasaran | Metrik target MVP | Cara pengukuran |
|---|---|---|---|
| OBJ-01 | Digitalisasi transaksi bengkel | Minimal 90% transaksi servis selama masa uji coba tercatat dalam sistem. | Perbandingan transaksi sistem dengan catatan/nota uji coba. |
| OBJ-02 | Akurasi stok | Seluruh transaksi P0 yang menggunakan barang menghasilkan pergerakan stok yang dapat ditelusuri. | Audit sampel transaksi terhadap stock movement. |
| OBJ-03 | Pengawasan owner | Owner dapat mengetahui stok menipis, transaksi terbaru, motor aktif, dan ringkasan pendapatan dari ponsel. | UAT dashboard owner. |
| OBJ-04 | Kecepatan transaksi | Transaksi servis standar dapat diselesaikan tanpa berpindah ke catatan manual. | Uji skenario transaksi end-to-end. |
| OBJ-05 | Kualitas data | Tidak ada transaksi final tanpa nomor transaksi, tanggal, pengguna, total, dan detail item/jasa. | Validasi basis data dan test case. |
| OBJ-06 | Adopsi staf | Minimal satu staf bengkel dapat menjalankan alur barang masuk dan servis setelah pelatihan singkat. | Observasi UAT tanpa bantuan developer. |
| OBJ-07 | Kesiapan pengembangan | Struktur role, API, dan basis data mendukung penambahan pengguna serta modul lanjutan. | Review teknis dan dokumentasi. |
| OBJ-08 | Digitalisasi showroom | Seluruh motor aktif pilot memiliki identitas, status, dan foto wajib; setiap penjualan pilot tercatat dan memindahkan kepemilikan tanpa duplikasi. | Audit inventaris dan UAT penjualan showroom. |
| OBJ-09 | Keandalan pembayaran | Pembayaran manual dapat direkonsiliasi dan callback gateway tidak menimbulkan finalisasi ganda. | UAT tunai/transfer, gateway sandbox, dan callback duplikat. |

### 4.4 Non-goals MVP

MVP tidak ditujukan untuk menjadi software akuntansi penuh, marketplace suku cadang, aplikasi konsumen, sistem payroll, sistem pajak, CRM pemasaran, atau aplikasi native Android/iOS. Inquiry dan follow-up showroom lanjutan, titip jual, trade-in, cicilan, operasi multi-cabang, serta integrasi WhatsApp juga belum termasuk MVP. Produk tidak menjanjikan operasi offline penuh. PWA dapat dipasang pada perangkat, tetapi transaksi yang mengubah data memerlukan koneksi ke server pada MVP.

---

## 5. Stakeholder, Tim, dan Tata Kelola

### 5.1 Stakeholder utama

| Nama / kelompok | Peran | Kepentingan | Keputusan yang dimiliki |
|---|---|---|---|
| **Pak Arif** | Owner Garasi Hobby, Sponsor, Product Owner | Kontrol usaha, kemudahan pemantauan, keamanan margin, dan kesesuaian proses dengan bisnis. | Prioritas bisnis, scope, akses finansial, penerimaan UAT, dan keputusan go-live. |
| **Aya** | Project Manager / System Analyst | Kejelasan requirement, ketepatan scope, koordinasi, dokumentasi, dan UAT. | Pengelolaan backlog, detail requirement, jadwal internal, dan eskalasi perubahan. |
| **Ilyas** | Backend / Database Engineer | Integritas data, keamanan akses, performa API, transaksi stok, dan deployment. | Desain teknis backend/database dengan persetujuan tim. |
| **Syamil** | Frontend Engineer | Kemudahan penggunaan, responsivitas, form transaksi, dashboard, dan integrasi API. | Implementasi frontend sesuai requirement dan desain tervalidasi. |
| **Staf bengkel** | Pengguna operasional | Kecepatan input, bahasa sederhana, dan proses yang sesuai kegiatan harian. | Masukan alur kerja dan validasi usability. |
| **Staf showroom** | Pengguna operasional showroom | Kejelasan identitas, foto, status motor, harga, dan penjualan. | Masukan alur showroom dan validasi data motor. |
| **Pelanggan** | Penerima layanan | Informasi transaksi dan nota yang jelas. | Tidak mengakses sistem internal pada MVP. |

### 5.2 RACI ringkas

| Aktivitas | Pak Arif | Aya | Ilyas | Syamil | Staf |
|---|---|---|---|---|---|
| Validasi kebutuhan bisnis | A | R | C | C | C |
| Pengelolaan scope dan backlog | C | A/R | C | C | I |
| Desain basis data dan API | C | C | A/R | C | I |
| Desain dan implementasi frontend | C | C | C | A/R | C |
| Persiapan data awal | A | C | R | I | R |
| Pengujian sistem | I | A/R | R | R | C |
| UAT | A | R | C | C | R |
| Keputusan go-live | A | R | C | C | I |

**Keterangan:** R = Responsible, A = Accountable, C = Consulted, I = Informed.

---

## 6. Persona dan Kebutuhan Pengguna

### 6.1 Owner / super admin — Pak Arif

Owner tidak ingin mengelola seluruh detail operasional. Ia memerlukan ringkasan yang dapat dipercaya, peringatan stok, kontrol harga dan profit, serta kemampuan memeriksa siapa yang melakukan perubahan. Aplikasi harus membantu owner mengambil tindakan tanpa mewajibkan pemeriksaan transaksi satu per satu.

**Job-to-be-done:** “Saat saya sedang di luar lokasi, saya ingin melihat kondisi showroom dan bengkel melalui ponsel agar saya dapat mengarahkan tim hanya ketika ada masalah atau keputusan penting.”

### 6.2 Admin atau staf bengkel

Staf bengkel perlu mencatat motor masuk, pekerjaan, suku cadang, pembayaran, dan barang masuk. Pengguna ini membutuhkan form singkat dan tombol yang jelas. Staf tidak harus melihat harga modal atau seluruh profit.

**Job-to-be-done:** “Saat pelanggan datang, saya ingin membuat work order dan nota dengan cepat agar pekerjaan tercatat tanpa memperlambat layanan.”

### 6.3 Admin atau staf showroom

Staf showroom perlu mengetahui motor yang tersedia, memastikan foto wajib lengkap, memperbarui status motor, dan membuat transaksi penjualan. Pengguna ini memerlukan identitas motor, kondisi, harga, dan status yang mudah ditemukan. Pencatatan inquiry dan follow-up direncanakan untuk Release 1.1.

**Job-to-be-done:** “Saat calon pembeli bertanya, saya ingin menemukan motor yang relevan dan mengetahui status serta harganya agar saya dapat menjawab dengan cepat.”

### 6.4 Pengguna input terbatas

Peran ini disiapkan untuk masa depan, misalnya staf gudang atau penerima barang. Pengguna hanya dapat menginput aktivitas tertentu dan tidak dapat melihat data finansial sensitif.

### 6.5 Mekanik atau penanggung jawab pekerjaan

Mekanik tidak wajib memiliki akun aplikasi pada MVP. Nama mekanik atau penanggung jawab tetap disimpan sebagai referensi operasional pada work order agar pekerjaan dapat ditelusuri dan difilter. Seluruh input sistem dilakukan oleh staf bengkel yang berizin.

---

## 7. Ruang Lingkup Rilis

### 7.1 MVP / Release 1.0

MVP mencakup autentikasi, role owner dan staf, master data, manajemen suku cadang, barang masuk, stock movement, customer dan motor, work order bengkel, estimasi, pengerjaan, penjualan barang langsung, transaksi, pembayaran penuh, nota, dashboard owner, laporan dasar, audit log, serta inventaris dan penjualan motor showroom. Sistem harus dapat mencatat seluruh jenis motor.

Showroom dan bengkel sama-sama termasuk domain inti MVP. Scope showroom dibatasi pada data motor, foto wajib, status Draft/Tersedia/Reserved/Terjual/Diarsipkan, pelanggan, penjualan, pembayaran, dan bukti transaksi. Inquiry, follow-up, pengadaan motor, titip jual, trade-in, cicilan, komisi, dan CRM penjualan lanjutan belum termasuk MVP.

Foto wajib diterapkan pada motor showroom dan kondisi awal motor bengkel. Pembayaran MVP harus lunas melalui tunai atau transfer bank yang diverifikasi manual, atau QRIS dan e-wallet yang dikonfirmasi otomatis melalui payment gateway. Sistem tetap internal dan pelanggan tidak memiliki akun pada MVP.

### 7.2 Release 1.1

Release 1.1 mencakup inquiry dan follow-up showroom, approval pembelian yang lebih lengkap, retur penjualan barang terstruktur, ekspor laporan, pengaturan nota, stock opname terstruktur, notifikasi yang dapat dikonfigurasi, serta peningkatan usability berdasarkan data penggunaan awal.

### 7.3 Fase 2

Fase 2 dapat mencakup katalog publik, customer portal, integrasi WhatsApp, printer kasir tervalidasi, titip jual, trade-in, cicilan, operasi multi-cabang, lampiran dokumen kendaraan, dan integrasi supplier.

### 7.4 Di luar scope produk saat ini

Fitur berikut tidak termasuk baseline PRD: marketplace distributor berskala publik, akuntansi double-entry, pajak, payroll, sistem HR, native mobile app, otomatisasi media sosial, rekomendasi AI, operasi multi-cabang penuh, dan integrasi perangkat bengkel.

---

## 8. Model Operasional Tingkat Tinggi

Showroom dan bengkel merupakan dua proses berbeda yang berbagi pelanggan, data motor, pembayaran, dan laporan. Bengkel juga menggunakan stok suku cadang. Owner menerima informasi dari kedua domain melalui dashboard dan audit log. BPMN kolaborasi yang disusun sebelumnya menjadi visual pendukung alur ini.[3]

[Buka BPMN Showroom dan Bengkel Garasi Hobby](../garasi-hobby-showroom-bengkel.bpmn)

### 8.1 Alur showroom

1. Pelanggan meminta melihat motor.
2. Staf mencari inventaris motor dan memeriksa status ketersediaan.
3. Staf menyampaikan detail kondisi dan harga.
4. Jika pelanggan belum setuju, tidak ada transaksi yang difinalisasi pada MVP.
5. Jika pelanggan setuju, staf mencatat transaksi dan pembayaran.
6. Sistem mengubah status motor menjadi terjual dan membuat bukti transaksi.
7. Owner melihat perubahan inventaris dan ringkasan penjualan.

### 8.2 Alur bengkel

1. Staf menerima motor dan data pelanggan.
2. Sistem membuat work order.
3. Staf mengunggah foto kondisi awal, lalu staf atau mekanik melakukan pemeriksaan dan staf mencatat estimasi.
4. Setelah persetujuan pelanggan tercatat, staf mengecek stok suku cadang.
5. Jika stok tidak cukup, staf membuat permintaan pembelian atau menandai pekerjaan menunggu barang.
6. Staf mencatat pekerjaan aktual dan mengonfirmasi suku cadang yang benar-benar dipakai; sistem langsung membuat movement keluar.
7. Sistem menghitung transaksi dari pekerjaan aktual dan memproses pembayaran penuh tanpa mengurangi stok servis untuk kedua kalinya.
8. Sistem membuat nota A4/PDF dan menutup work order setelah motor diserahkan.
9. Owner melihat pendapatan, channel/status pembayaran, pemakaian barang, status pekerjaan, dan peringatan.

---

## 9. Struktur Navigasi Produk

Navigasi harus menyesuaikan role. Menu yang tidak diizinkan tidak ditampilkan. Struktur awal adalah sebagai berikut.

| Menu utama | Submenu / fungsi | Role utama |
|---|---|---|
| Dashboard | Ringkasan usaha, notifikasi, aktivitas terbaru | Owner, admin terbatas |
| Bengkel | Work order, estimasi, pekerjaan aktif, transaksi servis | Owner, staf bengkel |
| Showroom | Inventaris motor, foto, status, dan penjualan motor | Owner, staf showroom |
| Stok | Daftar barang, barang masuk, stock movement, stok minimum, penyesuaian | Owner, staf yang diberi akses |
| Transaksi | Servis, penjualan barang, penjualan motor, pembayaran, nota | Owner, staf sesuai domain |
| Pelanggan & Motor | Pelanggan, motor milik pelanggan, histori layanan | Owner, staf |
| Supplier & Pembelian | Supplier, permintaan pembelian, penerimaan barang | Owner, staf tertentu |
| Laporan | Penjualan, servis, stok, profit estimasi, aktivitas | Owner; staf sesuai izin |
| Pengaturan | Identitas bisnis, pengguna, role, penomoran, metode pembayaran | Owner |

---

## 10. Role dan Hak Akses

### 10.1 Role baseline

| Kapabilitas | Owner / Super Admin | Staf Bengkel | Staf Showroom | Staf Gudang / Input Terbatas |
|---|---:|---:|---:|---:|
| Melihat dashboard keseluruhan | Ya | Terbatas | Terbatas | Tidak |
| Melihat harga modal dan profit | Ya | Tidak | Tidak | Tidak |
| Mengelola pengguna dan role | Ya | Tidak | Tidak | Tidak |
| Mengelola master barang/jasa | Ya | Jika diberi izin | Tidak | Terbatas |
| Mencatat barang masuk | Ya | Jika diberi izin | Tidak | Ya |
| Melakukan penyesuaian stok | Ya | Tidak secara default | Tidak | Tidak |
| Membuat work order | Ya | Ya | Tidak | Tidak |
| Memfinalisasi transaksi servis | Ya | Ya | Tidak | Tidak |
| Mengelola inventaris showroom | Ya | Tidak | Ya | Tidak |
| Memfinalisasi penjualan motor | Ya | Tidak | Ya jika diberi izin | Tidak |
| Mengonfirmasi pembayaran tunai/transfer | Ya | Ya untuk transaksi bengkel/POS | Ya untuk transaksi showroom | Tidak |
| Melihat status pembayaran gateway | Ya | Sesuai transaksi bengkel/POS | Sesuai transaksi showroom | Tidak |
| Menyetujui diskon di atas batas | Ya | Tidak | Tidak | Tidak |
| Mengelola mekanik/PIC non-login | Ya | Jika diberi izin | Tidak | Tidak |
| Membatalkan transaksi final | Ya dengan alasan | Tidak | Tidak | Tidak |
| Melihat laporan finansial | Ya | Terbatas | Terbatas | Tidak |
| Melihat audit log | Ya | Tidak | Tidak | Tidak |

### 10.2 Prinsip akses

Sistem menerapkan prinsip **least privilege**. Pengguna hanya mendapatkan akses yang diperlukan. Harga modal, profit, credential gateway, pengaturan role, approval diskon, refund, dan pembatalan transaksi final merupakan data atau tindakan sensitif. Staf hanya melihat status pembayaran yang relevan dan tidak dapat membaca credential provider. Sistem harus mendukung perluasan role tanpa mengubah struktur utama aplikasi.

---

## 11. Functional Requirements

### 11.1 Autentikasi, pengguna, dan sesi

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| AUTH-01 | Sistem harus menyediakan login menggunakan identitas pengguna dan kata sandi. | P0 | Kredensial valid membuka aplikasi; kredensial salah menampilkan pesan umum tanpa mengungkap detail akun. |
| AUTH-02 | Sistem harus mengarahkan pengguna ke dashboard atau menu awal sesuai role. | P0 | Staf bengkel tidak diarahkan ke fungsi showroom jika tidak memiliki izin. |
| AUTH-03 | Sistem harus membatasi menu, halaman, API, dan aksi berdasarkan permission, bukan hanya menyembunyikan tombol. | P0 | Akses langsung melalui URL atau API tetap ditolak jika permission tidak dimiliki. |
| AUTH-04 | Owner harus dapat membuat, mengaktifkan, menonaktifkan, dan mengubah role pengguna. | P0 | Pengguna nonaktif tidak dapat login; histori transaksi pengguna tetap tersedia. |
| AUTH-05 | Kata sandi harus disimpan dalam bentuk hash yang aman dan tidak dapat dibaca kembali. | P0 | Basis data tidak menyimpan kata sandi plain text. |
| AUTH-06 | Sistem harus mengakhiri sesi setelah periode tidak aktif yang dikonfigurasi atau saat pengguna logout. | P1 | Token/sesi lama tidak dapat digunakan setelah logout atau kedaluwarsa. |
| AUTH-07 | Owner harus dapat mereset kata sandi staf melalui proses administratif. | P1 | Kata sandi lama berhenti berlaku setelah reset berhasil. |
| AUTH-08 | Sistem harus mencatat login berhasil, login gagal berulang, logout, dan perubahan role pada audit log. | P1 | Event mencatat waktu, pengguna atau identitas yang dicoba, dan jenis aktivitas. |

### 11.2 Pengaturan bisnis dan master data

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| MST-01 | Owner harus dapat mengatur nama usaha, logo, alamat, nomor kontak, dan catatan nota dengan nilai awal Garasi Hobby. | P0 | Perubahan tampil pada header aplikasi atau nota tanpa perubahan kode. |
| MST-02 | Sistem harus menyimpan konfigurasi mata uang IDR dan zona waktu Asia/Jakarta. | P0 | Tanggal transaksi dan laporan menggunakan zona waktu yang sama. |
| MST-03 | Sistem harus menyediakan master kategori barang. | P0 | Barang dapat ditautkan ke satu kategori aktif dan dapat difilter berdasarkan kategori. |
| MST-04 | Sistem harus menyediakan master satuan barang. | P0 | Item memiliki satuan, misalnya pcs, botol, set, atau liter. |
| MST-05 | Sistem harus menyediakan master jasa servis dengan nama, harga standar, status aktif, dan catatan. | P0 | Jasa aktif dapat dipilih pada work order; jasa nonaktif tidak muncul pada transaksi baru. |
| MST-06 | Sistem harus menyediakan master metode pembayaran beserta mode MANUAL/GATEWAY, channel, status aktif, dan provider bila relevan. | P0 | Tunai/transfer memakai mode MANUAL; QRIS/e-wallet memakai mode GATEWAY; metode nonaktif tidak muncul pada transaksi baru. |
| MST-07 | Sistem harus menyediakan master supplier dengan nama, kontak, alamat, dan status aktif. | P0 | Supplier aktif dapat dipilih pada penerimaan barang dan laporan pembelian. |
| MST-08 | Sistem harus menghasilkan nomor transaksi unik sesuai tipe transaksi. | P0 | Tidak ada dua work order, nota servis, penerimaan barang, atau penjualan motor dengan nomor yang sama. |
| MST-09 | Owner harus dapat mengubah pola awalan nomor tanpa mengubah histori transaksi. | P1 | Transaksi lama mempertahankan nomor awal; transaksi baru menggunakan pola terbaru. |
| MST-10 | Sistem harus menggunakan soft delete atau status nonaktif untuk master data yang sudah pernah dipakai. | P0 | Data referensi tidak hilang dari histori transaksi. |
| MST-11 | Owner harus dapat mengelola daftar mekanik atau penanggung jawab operasional tanpa membuat akun login. | P0 | Nama aktif dapat dipilih pada WO; mekanik tanpa akun tidak dapat mengakses aplikasi. |
| MST-12 | Sistem harus memiliki satu lokasi usaha default dan menyimpan referensi lokasi pada data operasional yang relevan. | P0 | MVP berjalan sebagai satu lokasi; struktur data dapat ditambah lokasi tanpa mengubah histori lama. |

### 11.3 Pelanggan dan motor pelanggan

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| CRM-01 | Staf harus dapat membuat data pelanggan minimal dengan nama dan satu kontak jika tersedia. | P0 | Pelanggan dapat disimpan tanpa field yang tidak relevan; duplikasi kontak diberi peringatan. |
| CRM-02 | Sistem harus mendukung pelanggan tanpa akun aplikasi. | P0 | Pelanggan tetap dapat ditautkan ke transaksi internal tanpa proses registrasi. |
| CRM-03 | Staf harus dapat menambahkan satu atau lebih motor milik pelanggan menggunakan identitas motor yang terpadu. | P0 | Motor menyimpan nomor polisi jika ada, merek, model/tipe, tahun opsional, warna, nomor rangka/mesin bila tersedia, dan catatan. |
| CRM-04 | Sistem harus menampilkan histori servis dan transaksi yang terkait dengan pelanggan atau motor. | P1 | Pengguna berizin dapat membuka pelanggan/motor dan melihat transaksi berurutan berdasarkan tanggal. |
| CRM-05 | Sistem harus memperingatkan kemungkinan data pelanggan atau motor duplikat. | P1 | Peringatan muncul saat kontak atau nomor polisi yang sama ditemukan; staf dapat memilih data lama. |
| CRM-06 | Data pelanggan harus dapat dicari berdasarkan nama, kontak, nomor polisi, merek, atau model motor. | P0 | Hasil relevan muncul tanpa harus memasukkan teks lengkap. |

### 11.4 Inventaris suku cadang

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| INV-01 | Sistem harus menyimpan barang dengan SKU/kode unik, nama, kategori, merek, satuan, weighted average cost, harga jual, stok minimum, lokasi, dan status aktif. | P0 | SKU unik; weighted average tidak dapat diedit bebas oleh staf; barang aktif dapat digunakan pada transaksi. |
| INV-02 | Owner harus dapat menentukan apakah suatu item dikelola stoknya. | P0 | Item non-stock tidak memengaruhi saldo; item stock menghasilkan movement. |
| INV-03 | Sistem harus menampilkan saldo stok saat ini dan status normal, menipis, atau habis per lokasi. | P0 | Status dihitung dari proyeksi saldo ledger dan batas minimum; saldo tidak dapat diedit langsung. |
| INV-04 | Setiap perubahan stok harus menghasilkan stock movement dengan tipe, referensi, kuantitas, biaya historis, lokasi, waktu, dan pengguna. | P0 | Stock movement menjadi source of truth dan saldo dapat direkonsiliasi dari seluruh movement item. |
| INV-05 | Sistem harus menambah stok dari penerimaan barang. | P0 | Setelah penerimaan difinalisasi, saldo bertambah sesuai detail. |
| INV-06 | Sistem harus mengurangi stok servis ketika barang aktual dicatat benar-benar diambil atau dipakai, dan mengurangi stok penjualan barang ketika transaksi difinalisasi. | P0 | Movement keluar memiliki referensi WO atau transaksi; finalisasi servis tidak mengurangi stok untuk kedua kalinya. |
| INV-07 | Sistem harus melarang stok negatif secara default. | P0 | Konfirmasi pemakaian WO atau finalisasi penjualan ditolak jika kuantitas melebihi stok tersedia. |
| INV-08 | Owner dapat melakukan override stok negatif hanya jika kebijakan ini diaktifkan dan alasan dicatat. | P2 | Override hanya dapat dilakukan role berizin dan muncul pada audit log. |
| INV-09 | Owner harus dapat melakukan penyesuaian stok dengan alasan wajib. | P0 | Adjustment menghasilkan movement terpisah dan tidak mengubah histori transaksi sumber. |
| INV-10 | Sistem harus menyediakan pencarian dan filter barang berdasarkan nama, SKU, kategori, merek, dan status stok. | P0 | Filter dapat digabungkan dan hasil menunjukkan saldo. |
| INV-11 | Sistem sebaiknya mendukung impor data barang melalui template. | P1 | File valid diimpor; baris bermasalah dilaporkan tanpa membuat data parsial yang tidak jelas. |
| INV-12 | Sistem harus menghitung harga modal barang menggunakan weighted average cost dan menyimpan snapshot harga modal serta harga jual pada setiap transaksi. | P0 | Penerimaan barang memperbarui weighted average secara konsisten; perubahan master tidak mengubah nilai historis transaksi final. |
| INV-13 | Sistem sebaiknya mendukung stock opname dan selisih stok. | P1 | Pengguna memasukkan hasil hitung fisik; owner menyetujui adjustment. |
| INV-14 | Sistem harus menghasilkan daftar stok di bawah atau sama dengan batas minimum. | P0 | Barang menipis muncul pada dashboard dan halaman stok minimum. |
| INV-15 | Sistem sebaiknya menyimpan lokasi rak atau penyimpanan item. | P1 | Lokasi dapat ditampilkan dan difilter tanpa diwajibkan untuk semua item. |
| INV-16 | Barang aktual yang sudah dikeluarkan untuk WO harus dapat dikembalikan melalui reversal movement jika tidak jadi digunakan. | P0 | Saldo bertambah melalui movement pembalik yang mengacu pada movement awal dan mencatat pengguna serta alasan. |

### 11.5 Supplier, permintaan pembelian, dan barang masuk

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| PUR-01 | Staf berizin harus dapat membuat permintaan pembelian dari barang stok menipis atau kebutuhan pekerjaan. | P1 | Permintaan menyimpan item, jumlah, alasan, pembuat, dan status. |
| PUR-02 | Owner harus dapat menyetujui atau menolak permintaan pembelian. | P1 | Keputusan menyimpan waktu, pengguna, dan catatan; status berubah konsisten. |
| PUR-03 | Staf berizin harus dapat mencatat penerimaan barang dari supplier. | P0 | Penerimaan menyimpan supplier, tanggal, nomor referensi, item, jumlah, dan harga modal. |
| PUR-04 | Penerimaan barang dalam status draft tidak boleh mengubah stok. | P0 | Stok berubah hanya saat dokumen difinalisasi. |
| PUR-05 | Finalisasi penerimaan harus menambah stok, menyimpan harga transaksi, dan menghitung weighted average cost secara atomik. | P0 | Stock movement, detail penerimaan, saldo, dan weighted average memiliki referensi serta hasil perhitungan yang konsisten. |
| PUR-06 | Dokumen penerimaan final tidak boleh dihapus langsung. | P0 | Koreksi dilakukan melalui pembatalan/retur/adjustment berizin dan tercatat. |
| PUR-07 | Sistem sebaiknya menampilkan histori pembelian per supplier dan barang. | P1 | Pengguna dapat memfilter periode, supplier, dan item. |
| PUR-08 | Sistem sebaiknya mengizinkan lampiran foto nota supplier. | P2 | Lampiran tersimpan dengan batas tipe dan ukuran file. |

### 11.6 Work order, estimasi, dan operasi bengkel

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| WKS-01 | Staf bengkel harus dapat membuat work order dari pelanggan dan motor yang sudah ada atau baru. | P0 | Sistem menghasilkan nomor WO unik dan status awal Draft/Inspeksi. |
| WKS-02 | Work order harus menyimpan tanggal masuk, keluhan, identitas motor, kilometer opsional, kondisi awal, dan staf penerima. | P0 | Field wajib divalidasi sebelum WO diproses. |
| WKS-03 | Sistem harus mewajibkan foto kondisi awal sebelum pengerjaan dimulai. | P0 | Minimal dua foto tersedia: satu tampilan umum dan satu bagian bermasalah; foto tambahan wajib jika ada kerusakan lain. Draft tetap dapat disimpan sebelum foto lengkap. |
| WKS-04 | Staf harus dapat mencatat hasil pemeriksaan dan rekomendasi pekerjaan. | P0 | Catatan tersimpan bersama waktu dan pengguna. |
| WKS-05 | Staf harus dapat membuat estimasi yang terdiri dari jasa dan suku cadang. | P0 | Subtotal jasa, barang, diskon sesuai policy owner, dan total dihitung server; diskon di atas batas menunggu approval. |
| WKS-06 | Sistem harus mendukung status persetujuan estimasi: Menunggu, Disetujui, Ditolak, atau Direvisi. | P0 | Pekerjaan tidak dapat dimulai sebelum estimasi disetujui, kecuali owner override dengan alasan. Revisi yang melewati batas konfigurasi memerlukan persetujuan ulang. |
| WKS-07 | Persetujuan pelanggan harus dicatat manual oleh staf dengan nama pemberi persetujuan, metode konfirmasi, waktu, dan nilai estimasi. | P0 | Metode dapat berupa langsung, telepon, atau WhatsApp; bukti screenshot/foto bersifat opsional dan identitas staf pencatat tersimpan. |
| WKS-08 | Sistem harus memeriksa stok barang pada estimasi atau sebelum pengerjaan. | P0 | Item yang tidak cukup diberi penanda; status WO dapat menjadi Menunggu Barang. |
| WKS-09 | Sistem harus mendukung status WO: Draft, Inspeksi, Menunggu Persetujuan, Menunggu Barang, Dikerjakan, Siap Diambil, Selesai, dan Dibatalkan. | P0 | Transisi status mengikuti aturan dan dicatat dalam histori. |
| WKS-10 | Staf harus dapat mencatat jasa aktual dan barang aktual yang digunakan. | P0 | Perbedaan dari estimasi tercatat; perubahan yang melewati batas nominal/persentase konfigurasi meminta persetujuan pelanggan ulang. |
| WKS-11 | Sistem harus menghitung nilai transaksi dari item aktual yang difinalisasi. | P0 | Total nota sama dengan total detail jasa, barang, diskon, dan biaya lain yang diizinkan. |
| WKS-12 | Pencatatan barang aktual sebagai diambil atau dipakai harus langsung mengurangi stok. | P0 | Satu detail barang menghasilkan movement keluar dengan referensi WO; finalisasi transaksi memverifikasi movement tanpa membuat pengurangan kedua. |
| WKS-13 | Sistem harus mencegah finalisasi ganda untuk work order yang sama. | P0 | Satu WO hanya memiliki satu transaksi final aktif. |
| WKS-14 | Staf harus dapat membatalkan WO sebelum transaksi final dengan alasan wajib. | P0 | Status menjadi Dibatalkan; sistem memeriksa barang yang sudah keluar dan mewajibkan pengembalian atau reversal yang sah. |
| WKS-15 | Koreksi setelah transaksi final hanya dapat dilakukan melalui pembatalan atau transaksi koreksi oleh role berizin. | P0 | Histori asli tetap dapat ditelusuri dan koreksi tercatat. |
| WKS-16 | Sistem sebaiknya menampilkan papan pekerjaan aktif berdasarkan status. | P1 | Staf dapat memfilter WO menunggu, dikerjakan, dan siap diambil. |
| WKS-17 | Sistem harus menyimpan mekanik atau penanggung jawab pekerjaan tanpa mewajibkan akun login bagi mekanik. | P0 | WO dapat difilter berdasarkan mekanik; perubahan penanggung jawab tercatat; seluruh input dilakukan staf berizin. |
| WKS-18 | Sistem harus menampilkan histori servis per motor. | P1 | Detail pekerjaan, tanggal, kilometer, jasa, dan barang dapat ditinjau oleh pengguna berizin. |

### 11.7 Transaksi penjualan barang langsung

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| POS-01 | Staf berizin harus dapat membuat penjualan barang tanpa work order servis. | P0 | Transaksi memiliki detail barang, jumlah, harga, total, pembayaran, dan nomor unik. |
| POS-02 | Pelanggan pada penjualan barang dapat bersifat opsional atau menggunakan pelanggan umum. | P0 | Transaksi tetap valid tanpa membuat data pelanggan palsu. |
| POS-03 | Sistem harus memeriksa stok sebelum transaksi difinalisasi. | P0 | Kuantitas melebihi stok ditolak sesuai kebijakan stok negatif. |
| POS-04 | Finalisasi penjualan barang harus mengurangi stok. | P0 | Movement keluar memiliki referensi nomor penjualan. |
| POS-05 | Harga transaksi mengikuti master harga jual; diskon atau perubahan harga dibatasi konfigurasi owner berdasarkan role dan jenis transaksi. | P0 | Batas awal adalah 0% sampai dikonfigurasi; setiap diskon mencatat alasan; nilai di atas batas memerlukan persetujuan owner dan audit log. |
| POS-06 | Sistem harus menghasilkan bukti transaksi/nota. | P0 | Nota menunjukkan item, kuantitas, harga, total, pembayaran, tanggal, dan identitas usaha. |
| POS-07 | Retur penjualan barang merupakan fitur P1 dan harus menghasilkan movement masuk yang dapat ditelusuri. | P1 | Retur mengacu pada transaksi awal dan tidak menghapus transaksi asli. |

### 11.8 Inventaris dan transaksi showroom motor

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| SHR-01 | Staf showroom harus dapat membuat data motor inventaris menggunakan identitas motor yang terpadu. | P0 | Motor memiliki kode inventaris unik, merek, model, tahun opsional, warna, nomor rangka/mesin bila tersedia, harga modal, harga jual, status, dan catatan kondisi. |
| SHR-02 | Sistem harus membedakan motor inventaris showroom dari motor milik pelanggan melalui klasifikasi kepemilikan dan tujuan, tanpa menduplikasi identitas fisik motor. | P0 | Tipe kepemilikan/tujuan tidak tertukar pada pencarian dan laporan. |
| SHR-03 | Sistem harus mendukung status motor showroom: Draft, Tersedia, Reserved, Terjual, dan Diarsipkan. | P0 | Reserved terkait pelanggan dan waktu reservasi tanpa deposit; motor Terjual tidak dapat dipilih untuk transaksi baru. Durasi default reservasi masih keputusan terbuka. |
| SHR-04 | Staf harus mengunggah foto motor sebelum status diubah menjadi Tersedia. | P0 | Minimal tiga foto tersedia: depan, samping kanan, dan samping kiri; satu foto dapat ditetapkan sebagai foto utama. |
| SHR-05 | Sistem harus menyimpan harga modal dan harga jual motor dengan akses terbatas. | P0 | Harga modal hanya terlihat oleh owner atau role berizin. |
| SHR-06 | Sistem harus mendukung pencarian motor berdasarkan kode, merek, model, tahun, warna, harga, dan status. | P0 | Filter dapat digabungkan dan hasil menampilkan status terbaru. |
| SHR-07 | Staf showroom harus dapat mencatat inquiry pelanggan terhadap satu atau lebih motor. | P1 | Inquiry menyimpan pelanggan/kontak, motor yang diminati, sumber, catatan, status, dan follow-up. |
| SHR-08 | Sistem sebaiknya mendukung status inquiry: Baru, Dihubungi, Viewing, Negosiasi, Menang, dan Kalah. | P1 | Perubahan status tercatat dan dapat difilter. |
| SHR-09 | Staf harus dapat mencatat transaksi penjualan motor dari motor berstatus Tersedia atau Reserved. | P0 | Transaksi memiliki pelanggan, motor, harga final, metode pembayaran, tanggal, pengguna, serta aturan diskon sesuai konfigurasi owner. |
| SHR-10 | Finalisasi penjualan harus secara atomik memastikan pembayaran penuh, mengubah status motor menjadi Terjual, menutup kepemilikan Garasi Hobby, dan membuat kepemilikan pelanggan. | P0 | Tidak ada kondisi parsial antara transaksi, pembayaran, status inventaris, dan kepemilikan motor. |
| SHR-11 | Sistem harus mencegah satu motor dijual dua kali. | P0 | Percobaan finalisasi kedua ditolak. |
| SHR-12 | Sistem harus menghasilkan bukti transaksi penjualan motor. | P0 | Dokumen menampilkan identitas usaha, pelanggan, motor, nilai transaksi, pembayaran, dan nomor transaksi. |
| SHR-13 | Checklist dokumen kendaraan dapat dicatat tanpa menyimpan salinan identitas sensitif pada MVP. | P1 | Pengguna dapat menandai kelengkapan seperti STNK/BPKB sesuai kebutuhan; penyimpanan file sensitif membutuhkan keputusan terpisah. |
| SHR-14 | Pembatalan penjualan final hanya dapat dilakukan owner dengan alasan. | P0 | Status transaksi, status motor, kepemilikan, stock/non-stock terkait, serta status refund dikoreksi secara konsisten dan tercatat. |
| SHR-15 | Sistem sebaiknya menampilkan estimasi margin motor kepada owner. | P1 | Margin dihitung dari harga final dikurangi harga modal dan biaya yang telah disepakati. |
| SHR-16 | Proses pengadaan, titip jual, komisi, cicilan, dan trade-in tidak termasuk MVP. | P2 | Fitur tidak muncul sebagai alur wajib pada rilis 1.0. |
| SHR-17 | Finalisasi penjualan harus mempertahankan identitas motor yang sama dan memindahkan relasi kepemilikannya kepada pelanggan. | P0 | Motor terjual dapat kembali untuk servis dengan histori kendaraan yang sama tanpa membuat record motor duplikat. |

### 11.9 Pembayaran dan nota

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| PAY-01 | Setiap transaksi final harus lunas melalui satu metode dan mencatat jumlah yang diterima. | P0 | Non-tunai harus sama dengan total transaksi; tunai boleh lebih dan menghasilkan kembalian; transaksi tidak dapat ditutup dengan saldo terutang. |
| PAY-02 | MVP harus mendukung tunai, transfer bank manual, QRIS, dan e-wallet. | P0 | Tunai dan transfer dikonfirmasi manual oleh staf; QRIS dan e-wallet dikonfirmasi otomatis melalui payment gateway. |
| PAY-03 | Sistem harus menghitung total, diskon yang diizinkan, jumlah diterima, dan kembalian untuk transaksi tunai. | P0 | Perhitungan konsisten antara layar, basis data, dan nota. |
| PAY-04 | Pembayaran parsial, piutang, cicilan, deposit, dan split payment tidak termasuk MVP. | P2 | Transaksi final hanya dapat ditutup setelah pembayaran penuh menggunakan satu metode. |
| PAY-05 | Nota final harus tersedia dalam layout A4 ramah cetak dan dapat disimpan sebagai PDF setelah pembayaran penuh terverifikasi. | P0 | Nota memiliki nomor, tanggal, identitas usaha, detail, total, pembayaran, petugas, dan tidak diterbitkan sebagai final saat pembayaran masih Pending. |
| PAY-06 | Pencetakan thermal khusus memerlukan validasi perangkat dan termasuk P1. | P1 | Layout diuji pada printer yang dipilih sebelum dinyatakan selesai. |
| PAY-07 | Nomor nota harus unik dan tidak dapat digunakan ulang setelah transaksi dibatalkan. | P0 | Nomor pembatalan tetap ada dalam histori dengan status Batal. |
| PAY-08 | Reprint nota harus diberi label atau dicatat sebagai cetak ulang. | P1 | Sistem menyimpan pengguna dan waktu reprint. |
| PAY-09 | Sistem harus membuat permintaan pembayaran QRIS/e-wallet melalui adapter payment gateway yang providernya dapat diganti. | P0 | Request menyimpan external reference unik, nominal, waktu kedaluwarsa, dan status awal Pending. |
| PAY-10 | Sistem harus memperbarui pembayaran gateway secara otomatis melalui callback/webhook terverifikasi. | P0 | Status Paid, Failed, atau Expired diproses idempotent; callback berulang tidak membuat pembayaran atau transaksi ganda. |
| PAY-11 | Konfirmasi transfer bank manual harus menyimpan staf pemeriksa, waktu, dan referensi pembayaran jika tersedia. | P0 | Transaksi belum dianggap lunas sebelum staf berizin mengonfirmasi jumlah yang diterima. |
| PAY-12 | Kegagalan atau keterlambatan payment gateway tidak boleh mengubah transaksi menjadi lunas. | P0 | Sistem menampilkan status Pending/Failed/Expired dan menyediakan retry yang tidak menduplikasi pembayaran. |
| PAY-13 | Pembatalan transaksi berbayar harus mencatat status dan referensi refund tanpa menghapus pembayaran asli. | P0 | Refund gateway dapat berstatus Refund Pending lalu Refunded; otomatisasi atau proses manual ditentukan setelah provider dipilih. |

### 11.10 Dashboard owner

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| DSH-01 | Dashboard owner harus menampilkan ringkasan pendapatan hari ini dan periode yang dipilih. | P0 | Nilai berasal dari transaksi final aktif dan mengikuti filter periode. |
| DSH-02 | Dashboard harus memisahkan pendapatan bengkel, penjualan barang, dan penjualan motor. | P0 | Total kategori dapat direkonsiliasi dengan laporan detail. |
| DSH-03 | Dashboard harus menampilkan jumlah WO aktif berdasarkan status. | P0 | Angka dapat dibuka menuju daftar WO terfilter. |
| DSH-04 | Dashboard harus menampilkan jumlah motor showroom berdasarkan status. | P0 | Tersedia, Reserved, dan Terjual dapat dibedakan. |
| DSH-05 | Dashboard harus menampilkan stok menipis dan habis. | P0 | Item sesuai rule batas minimum dan dapat dibuka ke detail. |
| DSH-06 | Dashboard harus menampilkan aktivitas terbaru yang relevan. | P1 | Event menunjukkan waktu, pengguna, tipe, dan referensi. |
| DSH-07 | Dashboard harus dapat digunakan pada layar ponsel tanpa scroll horizontal. | P0 | UAT pada viewport selebar 360 piksel lulus untuk informasi dan aksi utama. |
| DSH-08 | Data sensitif seperti profit hanya muncul untuk role berizin. | P0 | Pengguna tanpa izin tidak menerima data dari API maupun UI. |
| DSH-09 | Dashboard sebaiknya menyediakan shortcut tindakan utama. | P1 | Owner/staf dapat menuju work order, barang masuk, atau transaksi dalam satu aksi. |
| DSH-10 | Dashboard owner harus menampilkan pembayaran Pending/Failed/Expired dan refund yang belum selesai. | P0 | Setiap ringkasan dapat dibuka ke transaksi dan provider reference terkait. |

### 11.11 Laporan

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| RPT-01 | Sistem harus menyediakan laporan transaksi servis berdasarkan periode. | P0 | Laporan menampilkan nomor, tanggal, pelanggan/motor, total jasa, total barang, channel/status pembayaran, dan status transaksi. |
| RPT-02 | Sistem harus menyediakan laporan penjualan barang berdasarkan periode. | P0 | Total sesuai transaksi final aktif dan dapat ditelusuri berdasarkan channel/status pembayaran. |
| RPT-03 | Sistem harus menyediakan laporan penjualan motor showroom. | P0 | Laporan menampilkan motor, pelanggan, harga final, modal untuk role berizin, margin estimasi, channel/status pembayaran, dan status transaksi. |
| RPT-04 | Sistem harus menyediakan laporan stok saat ini. | P0 | Laporan memuat item, saldo, harga referensi sesuai izin, status, dan lokasi bila ada. |
| RPT-05 | Sistem harus menyediakan kartu stok atau histori movement per item. | P0 | Saldo berjalan dapat ditelusuri dari movement awal hingga akhir. |
| RPT-06 | Sistem harus menyediakan laporan barang masuk dan penggunaan barang. | P0 | Pengguna dapat memfilter supplier, item, tipe movement, dan periode. |
| RPT-07 | Sistem harus menyediakan estimasi profit untuk owner. | P1 | Rumus dan komponen profit dijelaskan; barang menggunakan snapshot weighted average cost pada transaksi, bukan harga master terbaru. |
| RPT-08 | Sistem harus membedakan transaksi Draft, Menunggu Pembayaran, Final, Batal, dan Koreksi. | P0 | Transaksi batal tidak masuk pendapatan bersih, refund tertunda tetap terlihat, dan seluruh status tetap tersedia pada audit/report. |
| RPT-09 | Laporan harus mendukung filter tanggal dan pencarian referensi. | P0 | Filter memberikan hasil konsisten dan dapat direset. |
| RPT-10 | Ekspor CSV/XLSX atau PDF merupakan P1. | P1 | File hasil ekspor memuat filter dan waktu pembuatan. |
| RPT-11 | Sistem harus menampilkan timestamp pembaruan data laporan. | P1 | Pengguna mengetahui kapan data terakhir dihitung atau dimuat. |
| RPT-12 | Laporan akuntansi formal seperti neraca dan jurnal umum tidak termasuk MVP. | P2 | Tidak ada klaim bahwa laporan dasar menggantikan software akuntansi. |
| RPT-13 | Sistem harus menyediakan rekonsiliasi pembayaran manual dan gateway. | P0 | Laporan memuat transaksi, metode/channel, status, nominal, internal/external reference, waktu bayar, verifikator, dan refund bila ada. |

### 11.12 Notifikasi, audit, dan kontrol

| ID | Requirement | Prioritas | Acceptance criteria ringkas |
|---|---|---|---|
| CTL-01 | Sistem harus menampilkan notifikasi in-app untuk stok menipis dan habis. | P0 | Notifikasi muncul berdasarkan rule dan dapat dibuka ke item. |
| CTL-02 | Sistem sebaiknya menampilkan notifikasi transaksi besar, pembatalan, atau adjustment stok kepada owner. | P1 | Ambang dapat dikonfigurasi atau ditetapkan pada deployment. |
| CTL-03 | Notifikasi harus memiliki status belum dibaca dan sudah dibaca. | P1 | Pengguna dapat menandai satu atau semua notifikasi sebagai dibaca. |
| CTL-04 | Integrasi WhatsApp atau email tidak termasuk MVP sampai kanal dan biaya disetujui. | P2 | Tidak ada ketergantungan MVP pada layanan eksternal tersebut. |
| CTL-05 | Sistem harus memiliki audit log untuk transaksi final, pembatalan, perubahan harga sensitif, diskon/approval, perubahan status pembayaran, adjustment stok, role, dan pengaturan. | P0 | Log mencatat aktor, waktu, aksi, objek, nilai penting sebelum/sesudah, requester/approver, dan referensi provider jika relevan. |
| CTL-06 | Audit log tidak boleh dapat diubah oleh pengguna operasional. | P0 | Hanya sistem yang menulis log; owner hanya membaca/filter. |
| CTL-07 | Sistem harus mencatat alasan untuk pembatalan transaksi dan adjustment stok. | P0 | Aksi tidak dapat disimpan tanpa alasan. |
| CTL-08 | Owner harus dapat memfilter audit log berdasarkan tanggal, pengguna, modul, dan aksi. | P1 | Hasil filter sesuai parameter. |
| CTL-09 | Sistem sebaiknya memberikan indikator jika data master yang dirujuk sudah nonaktif. | P1 | Histori tetap terbaca tanpa menawarkan data nonaktif pada transaksi baru. |

---

## 12. Aturan Bisnis

### 12.1 Aturan umum transaksi

| ID | Aturan |
|---|---|
| BR-001 | Draft dapat diedit oleh pengguna yang berizin. Dokumen final tidak diedit langsung; koreksi dilakukan melalui pembatalan atau transaksi koreksi. |
| BR-002 | Nomor dokumen unik dibuat server untuk mencegah duplikasi. |
| BR-003 | Tanggal, waktu, dan pengguna pembuat/finalisasi wajib disimpan. |
| BR-004 | Nilai transaksi historis tidak berubah ketika harga master berubah. |
| BR-005 | Penghapusan master data yang telah dipakai dilakukan melalui status nonaktif. |
| BR-006 | Pembatalan wajib memiliki alasan dan masuk audit log. |
| BR-007 | Perhitungan finansial dilakukan server dan divalidasi kembali ketika finalisasi. |
| BR-008 | Batas diskon dikonfigurasi owner berdasarkan role dan jenis transaksi; nilai awal 0% sampai diubah. |
| BR-009 | Diskon selalu menyimpan alasan; diskon di atas batas memerlukan persetujuan owner dan audit log. |
| BR-010 | Dokumen final tidak dihapus. Pembatalan mempertahankan nomor dokumen dan membuat reversal untuk dampak stok atau pembayaran yang relevan. |
| BR-011 | Penjualan barang dan motor hanya menjadi Final setelah pembayaran penuh terverifikasi; perubahan status, stock movement yang relevan, ownership, dan penerbitan nota dilakukan atomik pada basis data lokal. |

### 12.2 Aturan stok

| ID | Aturan |
|---|---|
| BR-STK-01 | Stok berubah hanya melalui stock movement yang memiliki tipe dan referensi. |
| BR-STK-02 | Draft penerimaan, estimasi servis, dan draft penjualan tidak mengubah stok. Barang servis baru mengubah stok setelah secara eksplisit dicatat diambil atau dipakai. |
| BR-STK-03 | Penerimaan final menambah stok; barang aktual yang dikeluarkan untuk WO dan penjualan barang final mengurangi stok. |
| BR-STK-04 | Stok negatif dilarang pada baseline MVP. |
| BR-STK-05 | Adjustment hanya dilakukan role berizin dan membutuhkan alasan. |
| BR-STK-06 | Batas minimum dapat berbeda per item. Status menipis berlaku ketika saldo lebih kecil atau sama dengan batas minimum. |
| BR-STK-07 | Pembatalan transaksi yang telah memengaruhi stok harus membuat reversal movement, bukan menghapus movement lama. |
| BR-STK-08 | Penerimaan final menghitung ulang weighted average cost berdasarkan saldo dan nilai persediaan sebelum penerimaan serta jumlah dan nilai barang yang diterima. |
| BR-STK-09 | Finalisasi transaksi servis tidak membuat movement keluar kedua untuk barang yang sudah dikeluarkan melalui WO. |

Rumus weighted average cost per barang dan lokasi adalah `(stok lama × rata-rata lama + jumlah masuk × harga masuk) ÷ (stok lama + jumlah masuk)`. Jika stok lama nol, rata-rata baru sama dengan harga barang masuk. Barang keluar menyimpan snapshot rata-rata saat movement dibuat. Reversal menggunakan biaya historis movement asal, bukan rata-rata terbaru.

### 12.3 Aturan bengkel

| ID | Aturan |
|---|---|
| BR-WKS-01 | Satu work order terkait dengan satu motor dan satu pelanggan pada satu kunjungan. |
| BR-WKS-02 | Satu work order dapat memiliki banyak jasa dan banyak suku cadang. |
| BR-WKS-03 | Transaksi servis final dibuat dari item aktual, bukan semata-mata estimasi. |
| BR-WKS-04 | Status Selesai hanya dapat dicapai setelah transaksi final dan penyerahan motor dicatat. |
| BR-WKS-05 | Jika pelanggan menolak estimasi, WO dapat dibatalkan tanpa mengurangi stok. |
| BR-WKS-06 | Jika barang tidak cukup, WO dapat berstatus Menunggu Barang. |
| BR-WKS-07 | Estimasi menggunakan status Menunggu, Disetujui, Ditolak, atau Direvisi dan terpisah dari status WO. |
| BR-WKS-08 | Revisi estimasi yang melewati batas konfigurasi memerlukan persetujuan ulang sebelum pekerjaan dilanjutkan atau transaksi difinalisasi. |
| BR-WKS-09 | Pembatalan WO wajib merekonsiliasi seluruh barang yang sudah dikeluarkan melalui reversal atau penjelasan movement yang sah. |

### 12.4 Aturan showroom

| ID | Aturan |
|---|---|
| BR-SHR-01 | Motor showroom dan motor pelanggan bengkel menggunakan identitas motor terpadu dengan klasifikasi kepemilikan dan tujuan yang berbeda. |
| BR-SHR-02 | Hanya motor Tersedia atau Reserved yang dapat diproses menjadi transaksi penjualan. Motor Reserved hanya dijual kepada pelanggan reservasi kecuali owner melakukan override dengan alasan. |
| BR-SHR-03 | Satu motor hanya dapat memiliki satu penjualan final aktif. |
| BR-SHR-04 | Finalisasi penjualan dan perubahan status menjadi Terjual harus terjadi dalam satu transaksi basis data. |
| BR-SHR-05 | Harga modal dan margin hanya dapat diakses role berizin. |
| BR-SHR-06 | Checklist dokumen pada MVP adalah informasi kelengkapan, bukan layanan verifikasi legal. |
| BR-SHR-07 | Motor yang terjual mempertahankan identitas yang sama saat kepemilikan ditautkan ke pelanggan agar histori penjualan dan servis tetap utuh. |
| BR-SHR-08 | Motor tidak dapat berstatus Tersedia sebelum memiliki minimal tiga foto wajib. |

### 12.5 Aturan pembayaran

| ID | Aturan |
|---|---|
| BR-PAY-01 | Transaksi MVP harus dibayar penuh; pembayaran parsial, piutang, deposit, cicilan, dan split payment tidak diperbolehkan. |
| BR-PAY-02 | Tunai dan transfer bank dikonfirmasi manual oleh staf berizin. |
| BR-PAY-03 | QRIS dan e-wallet dikonfirmasi otomatis hanya dari callback/webhook payment gateway yang valid. |
| BR-PAY-04 | Status pembayaran gateway minimal Pending, Paid, Failed, dan Expired. Hanya status Paid yang dapat melunasi transaksi. |
| BR-PAY-05 | Callback/webhook harus diproses idempotent dan tidak boleh menghasilkan pembayaran atau finalisasi ganda. |
| BR-PAY-06 | Provider payment gateway harus dipilih sebelum implementasi integrasi dimulai. |
| BR-PAY-07 | Pembatalan transaksi berbayar mempertahankan pembayaran asli dan membuat rekam refund terpisah. |
| BR-PAY-08 | Sebelum provider dipilih, baseline refund gateway adalah Refund Pending yang diselesaikan owner melalui proses provider dan direkonsiliasi di sistem. |

### 12.6 Aturan profit estimasi

Profit pada MVP merupakan **estimasi operasional**, bukan laba akuntansi. Untuk transaksi servis atau penjualan barang, estimasi profit dihitung dari pendapatan dikurangi snapshot weighted average cost barang pada saat transaksi. Biaya jasa dapat dianggap pendapatan kotor sampai model biaya tenaga kerja ditentukan. Untuk penjualan motor, estimasi margin dihitung dari harga jual final dikurangi harga modal motor dan biaya tambahan yang dicatat. Pajak, depresiasi, overhead, gaji, biaya payment gateway, dan biaya lain tidak otomatis masuk perhitungan kecuali ditambahkan pada fase berikutnya.

---

## 13. Status Model

### 13.1 Work order bengkel

| Status | Makna | Transisi yang diizinkan |
|---|---|---|
| Draft | Data awal belum lengkap. | Inspeksi, Dibatalkan |
| Inspeksi | Motor sedang diperiksa. | Menunggu Persetujuan, Dibatalkan |
| Menunggu Persetujuan | Estimasi sudah dibuat dan menunggu keputusan pelanggan. | Dikerjakan, Menunggu Barang, Dibatalkan |
| Menunggu Barang | Pekerjaan menunggu ketersediaan suku cadang. | Dikerjakan, Dibatalkan |
| Dikerjakan | Pekerjaan berlangsung. | Siap Diambil, Menunggu Barang |
| Siap Diambil | Pekerjaan selesai secara operasional. | Selesai |
| Selesai | Transaksi final dan motor telah diserahkan. | Tidak ada; koreksi melalui proses khusus |
| Dibatalkan | Pekerjaan tidak dilanjutkan. | Tidak ada; buat WO baru jika diperlukan |

Status **Direvisi** merupakan status estimasi, bukan status work order. Ketika estimasi direvisi, WO tetap atau kembali berada pada status Menunggu Persetujuan sampai pelanggan memberikan keputusan baru.

### 13.2 Status estimasi servis

| Status | Makna |
|---|---|
| Menunggu | Estimasi telah dibuat dan belum mendapat keputusan pelanggan. |
| Disetujui | Pelanggan menyetujui nilai dan ruang lingkup estimasi yang tercatat. |
| Ditolak | Pelanggan tidak menyetujui estimasi. |
| Direvisi | Isi atau nilai estimasi berubah dan menunggu persetujuan ulang jika melewati batas konfigurasi. |

### 13.3 Motor showroom

| Status | Makna | Transisi yang diizinkan |
|---|---|---|
| Draft | Data motor belum siap ditawarkan. | Tersedia, Diarsipkan |
| Tersedia | Motor dapat ditawarkan atau dijual. | Reserved, Terjual, Diarsipkan |
| Reserved | Motor ditahan untuk pelanggan tertentu sampai waktu reservasi; tanpa deposit pada MVP. | Tersedia, Terjual, Diarsipkan |
| Terjual | Penjualan sudah difinalisasi. | Hanya dapat dikoreksi owner melalui pembatalan |
| Diarsipkan | Motor tidak aktif ditawarkan. | Tersedia jika diaktifkan kembali |

### 13.4 Dokumen transaksi

| Status | Makna |
|---|---|
| Draft | Belum memengaruhi saldo stok dan laporan final. |
| Menunggu Pembayaran | Detail transaksi sudah dikunci sementara, tetapi pembayaran penuh belum terverifikasi. |
| Final | Sah, memengaruhi laporan dan status terkait; stok hanya berubah pada titik bisnis yang ditetapkan dan tidak boleh dikurangi dua kali. |
| Batal | Tidak masuk pendapatan aktif; reversal dibuat jika sebelumnya memengaruhi stok. |
| Koreksi | Dokumen yang memperbaiki dokumen final dengan referensi yang jelas. |

### 13.5 Pembayaran gateway

| Status | Makna |
|---|---|
| Pending | Permintaan pembayaran dibuat dan belum dikonfirmasi provider. |
| Paid | Provider mengonfirmasi pembayaran berhasil melalui callback/webhook terverifikasi. |
| Failed | Provider menyatakan pembayaran gagal. |
| Expired | Batas waktu pembayaran berakhir tanpa konfirmasi berhasil. |
| Cancelled | Percobaan pembayaran dibatalkan sebelum berhasil. |
| Refund Pending | Transaksi dibatalkan setelah Paid dan pengembalian dana belum selesai. |
| Refunded | Pengembalian dana telah dikonfirmasi dan memiliki referensi. |

---

## 14. Model Data Konseptual

Model berikut merupakan kebutuhan data tingkat produk. Detail normalisasi, tipe data, index, dan strategi transaksi ditentukan pada dokumen desain teknis.

### 14.1 Entitas inti

| Entitas | Tujuan | Atribut minimum |
|---|---|---|
| User | Identitas pengguna internal | id, nama, username/email/nomor, password_hash, status, role_id, last_login |
| Role & Permission | Pengaturan akses | role, permission, relasi role-permission |
| BusinessLocation | Lokasi operasional | id, nama, alamat, status; MVP menggunakan satu lokasi default |
| OperationalStaff | Mekanik/PIC tanpa akun login | id, nama, tipe, status, location_id |
| Customer | Data pelanggan | id, nama, kontak, alamat opsional, catatan, status |
| Vehicle | Identitas terpadu seluruh jenis motor | id, nomor polisi, merek, model/tipe, tahun, warna, nomor rangka/mesin opsional |
| VehicleOwnership | Histori kepemilikan motor | id, vehicle_id, owner_type, customer_id opsional, location_id opsional, valid_from, valid_to, source_transaction_id |
| ShowroomInventory | Data komersial motor showroom | id, vehicle_id, kode inventaris, harga modal, harga jual, status, kondisi, location_id, reserved_customer_id opsional, reserved_until opsional |
| VehiclePhoto | Foto showroom dan kondisi bengkel | id, vehicle_id, work_order_id opsional, tipe, path/object_key, urutan, ukuran, uploaded_by |
| Item | Suku cadang/barang global | id, SKU, nama, kategori, merek, satuan, harga jual, min_stock, status |
| InventoryBalance | Proyeksi saldo dan modal per lokasi | item_id, location_id, current_stock, weighted_average_cost, updated_at; unik per item/lokasi |
| StockMovement | Ledger perubahan stok | id, item_id, location_id, tipe, qty_in, qty_out, unit_cost, referensi, tanggal, user_id, alasan, reversal_of |
| Supplier | Pemasok | id, nama, kontak, alamat, status |
| PurchaseRequest | Permintaan pembelian | id, pembuat, approver, status, alasan, tanggal |
| GoodsReceipt | Penerimaan barang | id, supplier, location_id, referensi, tanggal, status, total, detail |
| ServiceCatalog | Master jasa | id, nama, harga standar, status |
| WorkOrder | Aktivitas servis | id, nomor, vehicle_id, customer_id, keluhan, inspeksi, status, tanggal, operational_staff_id, location_id |
| Estimate | Estimasi dan persetujuan pelanggan | id, work_order_id, versi, status, total, approval_name, approval_method, approved_at |
| EstimateLine | Jasa/barang pada estimasi | estimate_id, tipe, reference_id, qty, harga, subtotal |
| WorkOrderItem | Jasa/barang aktual | work_order_id, tipe, reference_id, qty, harga, stock_movement_id opsional, catatan perubahan |
| Transaction | Header transaksi | id, nomor, tipe, tanggal, customer, location_id, subtotal, diskon, total, status, user |
| TransactionLine | Detail transaksi | transaction_id, tipe item/jasa/motor, reference_id, qty, harga, cost_snapshot, subtotal |
| DiscountApproval | Permintaan dan keputusan diskon | transaction_id, requester_id, approver_id, nilai_sebelum, nilai_sesudah, alasan, status, decided_at |
| PaymentAttempt | Percobaan/konfirmasi pembayaran manual atau gateway | transaction_id, metode, jumlah, status, internal_reference, external_reference, provider, expires_at, paid_at, confirmed_by |
| PaymentGatewayEvent | Callback/webhook payment gateway | provider, external_event_id, external_reference, event_type, signature_valid, payload_hash, received_at, processed_at |
| Refund | Rekam pengembalian dana | transaction_id, payment_attempt_id, jumlah, status, internal/external_reference, requested_by, confirmed_at |
| Inquiry | Minat calon pembeli showroom | customer/kontak, motor, sumber, status, follow_up, catatan |
| Notification | Peringatan pengguna | tipe, target_user/role, referensi, pesan, read_at |
| AuditLog | Histori aktivitas sensitif | actor, aksi, modul, entity, entity_id, before, after, timestamp |
| BusinessSetting | Identitas dan konfigurasi | key, value, tipe, updated_by |

### 14.2 Relasi penting

- Satu pelanggan dapat memiliki banyak histori kepemilikan motor, dan hanya satu kepemilikan aktif berlaku untuk satu motor pada satu waktu.
- Satu identitas motor dapat berpindah dari inventaris showroom menjadi milik pelanggan tanpa membuat record baru.
- Satu motor dapat memiliki banyak work order dan foto sepanjang siklus hidupnya.
- Satu work order memiliki banyak jasa dan suku cadang.
- Satu work order dapat memiliki beberapa versi estimasi, tetapi hanya satu versi yang berlaku untuk persetujuan terakhir.
- Satu transaksi memiliki banyak baris transaksi dan tepat satu metode pelunasan pada MVP. Beberapa payment attempt boleh tercatat untuk retry, tetapi maksimal satu attempt berstatus Paid.
- Satu item memiliki banyak stock movement.
- Satu penerimaan barang memiliki banyak detail item.
- Satu inventaris showroom dapat memiliki maksimal satu penjualan final aktif.
- Satu pembayaran gateway dapat memiliki banyak event callback/webhook, tetapi setiap external event hanya diproses satu kali.
- Setiap data operasional utama merujuk ke satu lokasi default pada MVP agar model dapat dikembangkan untuk cabang tanpa menyediakan operasi multi-cabang sekarang.
- Setiap transaksi final, adjustment, pembatalan, atau perubahan sensitif memiliki audit log.

### 14.3 Data sensitif

Harga modal, profit, kredensial, token/payment secret, dan audit log termasuk data sensitif internal. Nomor rangka, nomor mesin, kontak pelanggan, foto kondisi motor, dan dokumen kendaraan merupakan data yang perlu dibatasi sesuai kebutuhan. MVP sebaiknya tidak menyimpan foto KTP atau dokumen identitas pemerintah sebelum tujuan, retensi, akses, dan perlindungannya disepakati.

---

## 15. UX dan UI Requirements

### 15.1 Prinsip interaksi

Antarmuka harus terasa operasional, bukan administratif. Pengguna harus mengetahui tindakan berikutnya tanpa membaca panduan panjang. Halaman transaksi harus menampilkan ringkasan total dan status dengan jelas. Tindakan berisiko seperti finalisasi, pembatalan, adjustment, dan perubahan harga sensitif membutuhkan konfirmasi.

### 15.2 Requirement UX

| ID | Requirement UX | Prioritas | Kriteria |
|---|---|---|---|
| UX-01 | Tampilan harus mobile-first dan tetap nyaman pada laptop. | P0 | Tidak ada scroll horizontal pada alur utama mulai viewport 360 × 800 piksel. |
| UX-02 | Aksi utama per halaman harus mudah dikenali. | P0 | Satu primary action yang konsisten, misalnya Simpan Draft atau Finalisasi. |
| UX-03 | Form harus menggunakan label Bahasa Indonesia yang dipahami staf. | P0 | Tidak bergantung pada istilah teknis seperti debit/credit stock tanpa penjelasan. |
| UX-04 | Field wajib dan error harus terlihat jelas di dekat field. | P0 | Pengguna mengetahui apa yang salah dan cara memperbaikinya. |
| UX-05 | Sistem harus menyediakan pencarian cepat untuk barang, pelanggan, dan motor. | P0 | Hasil dapat dipilih tanpa membuka halaman master terpisah. |
| UX-06 | Pengguna harus dapat menyimpan draft pada proses panjang. | P0 | Data draft tersedia kembali tanpa memengaruhi laporan final. |
| UX-07 | Sistem harus membedakan status menggunakan teks dan warna. | P0 | Informasi tetap dapat dipahami tanpa hanya mengandalkan warna. |
| UX-08 | Dialog konfirmasi harus digunakan pada finalisasi dan pembatalan. | P0 | Dialog menyebutkan dampak stok/finansial. |
| UX-09 | Owner harus dapat mencapai informasi kritis dalam maksimal dua tingkat navigasi dari dashboard. | P1 | Stok menipis, WO aktif, dan transaksi terbaru mudah dibuka. |
| UX-10 | Identitas visual dapat menggunakan gimmick atau jargon secara terukur tanpa mengganggu keterbacaan. | P1 | Elemen branding tidak menutupi informasi dan tombol operasional. |
| UX-11 | Sistem harus menyediakan empty state yang menjelaskan tindakan awal. | P1 | Halaman tanpa data menawarkan tombol dan penjelasan yang relevan. |
| UX-12 | Feedback sukses/gagal harus terlihat setelah aksi. | P0 | Pengguna tidak perlu menebak apakah data sudah tersimpan. |

### 15.3 Aksesibilitas minimum

Kontras teks dan tombol harus memadai. Ukuran target sentuh utama sebaiknya minimal sekitar 44 piksel. Setiap field memiliki label. Dialog dapat digunakan dengan keyboard pada desktop. Ikon tidak digunakan sebagai satu-satunya penjelas tindakan sensitif.

---

## 16. Non-Functional Requirements

### 16.1 Performa dan kapasitas

| ID | Requirement | Target MVP |
|---|---|---|
| NFR-PERF-01 | Waktu muat halaman operasional utama | Mayoritas halaman tampil dalam ≤3 detik pada Chrome Android dengan viewport 360 × 800, bandwidth uji 10 Mbps, dan latensi hingga 150 ms setelah login. |
| NFR-PERF-02 | Respons pencarian master data | Hasil awal tampil dalam ≤2 detik pada volume target sementara; target final ditetapkan setelah volume operasional divalidasi. |
| NFR-PERF-03 | Finalisasi transaksi | Selesai dalam ≤5 detik dan tidak menghasilkan finalisasi ganda. |
| NFR-PERF-04 | Volume awal | Baseline sementara mendukung ribuan item dan puluhan ribu movement/transaksi; jumlah pengguna dan volume aktual wajib divalidasi sebelum load test final. |
| NFR-PERF-05 | Pagination | Daftar besar menggunakan pagination atau lazy loading. |

### 16.2 Keandalan dan integritas

| ID | Requirement | Target MVP |
|---|---|---|
| NFR-REL-01 | Transaksi atomik | Finalisasi transaksi, perubahan stok, dan status terkait berhasil seluruhnya atau dibatalkan seluruhnya. |
| NFR-REL-02 | Idempotensi | Pengiriman ulang request finalisasi atau callback/webhook pembayaran tidak membuat transaksi, pembayaran, nota, atau movement duplikat. |
| NFR-REL-03 | Referensial | Foreign key/validasi aplikasi mencegah referensi data yang tidak sah. |
| NFR-REL-04 | Konsistensi uang | Nilai uang menggunakan tipe presisi tetap; tidak menggunakan floating point biner. |
| NFR-REL-05 | Waktu server | Nomor dan timestamp final mengikuti server dan zona waktu konfigurasi. |
| NFR-REL-06 | Ledger stok | Stock movement menjadi source of truth; saldo tersimpan hanya merupakan proyeksi/cache yang diperbarui atomik dan dapat direkonsiliasi. |
| NFR-REL-07 | Gateway eksternal | Event pembayaran duplikat, terlambat, atau tidak berurutan tidak boleh membuat status transaksi mundur atau menjadi lunas tanpa event valid. |

### 16.3 Keamanan

| ID | Requirement | Target MVP |
|---|---|---|
| NFR-SEC-01 | Transport | Seluruh trafik produksi menggunakan HTTPS. |
| NFR-SEC-02 | Password | Password di-hash menggunakan algoritma modern dan salted. |
| NFR-SEC-03 | Authorization | Permission diperiksa pada backend untuk setiap aksi sensitif. |
| NFR-SEC-04 | Input validation | Input divalidasi di frontend dan backend; query menggunakan parameterisasi/ORM aman. |
| NFR-SEC-05 | Secret management | Secret, termasuk API key dan webhook secret payment gateway, tidak disimpan di source code atau repository publik. |
| NFR-SEC-06 | Session | Token/sesi memiliki kedaluwarsa dan dapat dicabut. |
| NFR-SEC-07 | File upload | Foto dibatasi JPEG, PNG, atau WebP maksimal 5 MB per file; nama/MIME divalidasi, metadata lokasi dibuang jika tersedia, file tidak dieksekusi, dan gambar dikompresi otomatis. |
| NFR-SEC-08 | Brute force | Login gagal berulang dibatasi atau diperlambat. |
| NFR-SEC-09 | Error handling | Pesan pengguna tidak membocorkan stack trace, query, atau konfigurasi server. |
| NFR-SEC-10 | Audit | Aksi sensitif memiliki log yang tidak dapat diedit oleh staf biasa. |
| NFR-SEC-11 | Webhook payment | Signature, provider reference, nominal, dan merchant tujuan diverifikasi di backend; status dari frontend tidak dipercaya sebagai bukti pembayaran. |
| NFR-SEC-12 | Akses foto | Foto motor dan kondisi WO hanya dapat diakses pengguna terautentikasi yang memiliki permission terhadap domain terkait. |

### 16.4 Privasi dan retensi

Sistem hanya mengumpulkan data pelanggan dan kendaraan yang diperlukan untuk transaksi dan layanan. Akses data dibatasi berdasarkan role. Retensi data transaksi mengikuti kebutuhan usaha dan peraturan yang berlaku, sedangkan kebijakan retensi foto masih harus ditetapkan sebelum go-live. Jika data pelanggan harus dihapus atau dianonimkan, histori finansial dan audit tidak boleh kehilangan integritas; implementasi dilakukan sesuai keputusan legal/bisnis.

### 16.5 Backup dan pemulihan

| ID | Requirement | Target MVP |
|---|---|---|
| NFR-BCK-01 | Backup basis data dan metadata media | Backup otomatis minimal harian setelah sistem digunakan nyata; objek foto mengikuti mekanisme redundansi/backup storage yang dipilih. |
| NFR-BCK-02 | Retensi | Menyimpan beberapa titik pemulihan; jumlah dan durasi ditentukan berdasarkan hosting. |
| NFR-BCK-03 | Restore test | Prosedur restore diuji sebelum go-live atau segera setelah deployment. |
| NFR-BCK-04 | Export operasional | Owner dapat meminta ekspor data penting sebagai mitigasi tambahan pada hosting gratis. |
| NFR-BCK-05 | Kepemilikan | Penanggung jawab backup dan biaya storage harus ditetapkan sebelum go-live. |

### 16.6 Kompatibilitas dan maintainability

Aplikasi harus mendukung versi stabil terbaru Chrome pada Android dan desktop. Dukungan Safari iOS diuji untuk alur utama jika perangkat tersedia. Backend dan frontend memiliki konfigurasi lingkungan terpisah, migrasi database versioned, logging error, dokumentasi setup, serta test untuk logika transaksi kritis. Skema menyimpan satu lokasi default pada MVP, tetapi tidak menyediakan UI pemilihan cabang, transfer stok antar-cabang, atau laporan konsolidasi multi-lokasi.

---

## 17. API dan Integrasi Tingkat Produk

PRD tidak menetapkan framework, tetapi API harus mendukung kontrak yang konsisten untuk autentikasi, master data, stok, bengkel, showroom, transaksi, laporan, dan audit. Backend menjadi sumber kebenaran untuk permission, perhitungan final, nomor dokumen, status, dan stock movement.

### 17.1 Prinsip API

- Endpoint menggunakan autentikasi dan authorization berbasis permission.
- Request finalisasi memiliki mekanisme pencegahan duplikasi.
- Callback/webhook gateway diverifikasi dan diproses secara idempotent.
- Error memiliki kode dan pesan yang dapat ditangani frontend.
- Daftar mendukung pagination, filter, sort, dan pencarian yang relevan.
- Nilai uang dikirim dalam format presisi yang disepakati.
- Timestamp menggunakan format standar dan dikonversi ke Asia/Jakarta pada tampilan.
- Perubahan kontrak API didokumentasikan dan dikoordinasikan antara Ilyas dan Syamil.

### 17.2 Integrasi eksternal

| Integrasi | MVP | Catatan |
|---|---:|---|
| WhatsApp | Tidak | Membutuhkan nomor pengirim, provider, biaya, template, dan persetujuan. |
| Payment gateway | Ya, P0 | QRIS dan e-wallet dikonfirmasi otomatis. Provider, biaya, merchant account, sandbox, settlement, dan mekanisme refund harus diputuskan sebelum implementasi pembayaran. |
| Printer thermal | Opsional P1 | Membutuhkan validasi perangkat dan browser. |
| Penyimpanan foto privat | Ya, P0 | Foto showroom dan kondisi awal WO wajib. Provider object storage, biaya, akses privat, retensi, dan backup harus diputuskan sebelum fitur foto dikembangkan. |
| Email | Tidak wajib | Dapat dipertimbangkan untuk laporan atau reset password lanjutan. |
| Marketplace supplier | Tidak | Produk terpisah atau fase ekspansi. |

---

## 18. Analytics, Logging, dan Observability

Produk internal tetap membutuhkan pengukuran agar dapat dievaluasi. Analytics tidak harus menggunakan layanan eksternal. Event penting dapat dicatat melalui event log aplikasi atau query agregat dari basis data.

| ID | Event / metrik | Tujuan |
|---|---|---|
| ANA-01 | Login berhasil/gagal | Menilai akses dan mendeteksi masalah keamanan. |
| ANA-02 | Work order dibuat, difinalisasi, dibatalkan | Mengukur adopsi bengkel dan funnel operasional. |
| ANA-03 | Waktu dari WO dibuat ke selesai | Mengukur durasi layanan secara kasar. |
| ANA-04 | Transaksi servis/penjualan dibuat | Mengukur penggunaan modul dan pendapatan. |
| ANA-05 | Stock-out atau stok minimum | Mengukur masalah persediaan. |
| ANA-06 | Adjustment stok | Mengidentifikasi kualitas pencatatan dan potensi selisih. |
| ANA-07 | Inquiry showroom menjadi penjualan | Metrik Release 1.1 ketika modul inquiry diaktifkan. |
| ANA-08 | Error aplikasi dan API | Membantu diagnosis bug. |
| ANA-09 | Pengguna aktif per role | Mengetahui adopsi internal. |
| ANA-10 | Payment attempt per status/provider | Memantau keberhasilan, kegagalan, kedaluwarsa, callback duplikat, dan kebutuhan rekonsiliasi. |

Log teknis tidak boleh menyimpan password, token, atau data pribadi secara berlebihan. Error kritis perlu memiliki correlation ID agar frontend, backend, dan log dapat dicocokkan.

---

## 19. Data Awal dan Migrasi

Karena data historis masih tersebar di buku dan notepad, MVP tidak memigrasikan seluruh histori transaksi lama. Migrasi dibatasi pada barang aktif beserta harga dan saldo awal, jasa, metode pembayaran, supplier aktif, motor showroom yang masih tersedia, pelanggan dan motor yang masih relevan, serta work order yang masih berjalan. Arsip transaksi lama tetap disimpan di luar sistem dan laporan aplikasi dimulai dari tanggal cutover.

### 19.1 Proses migrasi yang disarankan

1. Aya dan Pak Arif menyepakati template data, field wajib, lokasi default, dan tanggal cutover.
2. Staf melakukan hitung fisik stok, menyiapkan data aktif, dan membersihkan duplikasi.
3. Harga modal awal per barang disepakati sebagai opening weighted average cost.
4. Ilyas menjalankan validasi format dan membuat laporan baris berhasil/gagal.
5. Data uji diimpor ke lingkungan staging.
6. Pak Arif atau staf memeriksa sampel saldo, motor, pelanggan, dan WO aktif.
7. Motor showroom diimpor sebagai identitas motor, kepemilikan Garasi Hobby, dan inventaris showroom; motor pelanggan memakai identitas motor dan kepemilikan pelanggan.
8. WO yang masih berjalan diimpor dan wajib dilengkapi foto kondisi sebelum dilanjutkan.
9. Data produksi diimpor dan dikunci melalui log migrasi yang mencatat pengguna pelaksana.

### 19.2 Aturan cutover

Saldo awal harus memiliki referensi **Opening Balance** per barang dan lokasi, beserta weighted average cost awal. Seluruh transaksi sebelum cutover tidak diklaim tercakup oleh laporan sistem. Sistem harus menampilkan tanggal mulai penggunaan dan menjaga arsip lama sebagai sumber terpisah.

---

## 20. Pengujian dan UAT

### 20.1 Level pengujian

| Level | Fokus | Penanggung jawab utama |
|---|---|---|
| Unit test | Perhitungan, permission, status transition, dan stock movement | Ilyas / Syamil |
| Integration test | API, database transaction, finalisasi, pembatalan, dan laporan | Ilyas |
| UI test manual | Form, navigasi, validasi, responsivitas, dan nota | Syamil / Aya |
| Security test dasar | Authorization, akses URL/API, input invalid, dan session | Ilyas / Aya |
| UAT | Kesesuaian alur showroom, bengkel, owner, dan staf | Aya / Pak Arif / staf |

### 20.2 Skenario UAT wajib

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| UAT-01 | Login sebagai owner dan staf | Menu dan data sesuai role. |
| UAT-02 | Membuat item dan menerima barang | Saldo stok bertambah dan movement tercatat. |
| UAT-03 | Membuat WO, estimasi, menyetujui, dan menyelesaikan servis | Status berubah sesuai urutan; nota terbentuk. |
| UAT-04 | Mengonfirmasi pemakaian suku cadang pada WO lalu membayar servis | Stok berkurang saat pemakaian dikonfirmasi dan tidak berkurang lagi saat pembayaran/finalisasi. |
| UAT-05 | Mencoba mengonfirmasi pemakaian barang melebihi stok | Pencatatan pemakaian ditolak sebelum saldo menjadi negatif. |
| UAT-06 | Menjual barang langsung | Transaksi, pembayaran, nota, dan movement valid. |
| UAT-07 | Membuat motor showroom dan menjualnya | Pembayaran penuh, status Terjual, dan perpindahan kepemilikan terjadi atomik; motor tidak dapat dijual ulang. |
| UAT-08 | Membatalkan transaksi dengan owner | Alasan, reversal, koreksi status/kepemilikan, dan status refund tercatat; laporan diperbarui. |
| UAT-09 | Menerima barang dengan harga baru setelah transaksi lama | Weighted average cost berubah benar dan snapshot modal transaksi lama tidak berubah. |
| UAT-10 | Membuka dashboard dari ponsel | Informasi kritis terbaca tanpa scroll horizontal. |
| UAT-11 | Mengakses laporan finansial sebagai staf tanpa izin | Akses ditolak dan data sensitif tidak terkirim. |
| UAT-12 | Memeriksa audit log | Aksi sensitif dapat ditemukan berdasarkan pengguna dan referensi. |
| UAT-13 | Mengubah motor showroom menjadi Tersedia dengan foto kurang dari tiga | Perubahan status ditolak dan sistem menjelaskan foto yang kurang. |
| UAT-14 | Memulai pengerjaan WO dengan foto kondisi kurang dari dua | Pengerjaan ditolak sampai foto umum dan area masalah tersedia. |
| UAT-15 | Merevisi estimasi melewati ambang konfigurasi | Pekerjaan/finalisasi tertahan sampai persetujuan pelanggan baru tercatat. |
| UAT-16 | Membayar QRIS/e-wallet dan mengirim callback Paid dua kali | Transaksi, pembayaran, nota, dan perubahan terkait hanya dibuat/finalisasi satu kali. |
| UAT-17 | Gateway mengirim status Pending, Failed, atau Expired | Transaksi tidak dianggap lunas dan retry tidak membuat pembayaran ganda. |
| UAT-18 | Menjual motor showroom lalu membuat WO servis | WO memakai identitas motor yang sama dan histori penjualan serta servis tetap terhubung. |
| UAT-19 | Memberikan diskon melebihi batas staf | Finalisasi ditolak sampai owner menyetujui; alasan, requester, dan approver masuk audit log. |
| UAT-20 | Memeriksa data hasil migrasi dan laporan cutover | Opening balance sesuai hitung fisik dan laporan tidak mengklaim histori sebelum cutover. |
| UAT-21 | Membuat data operasional baru pada MVP | Data memakai lokasi default tanpa memerlukan pemilih cabang di UI. |
| UAT-22 | Membayar tunai dan transfer bank manual | Kembalian tunai dihitung benar; transfer belum lunas sebelum diverifikasi staf; identitas verifikator tersimpan. |
| UAT-23 | Membatalkan transaksi gateway berstatus Paid | Pembayaran asli tetap ada, status menjadi Refund Pending/Refunded sesuai proses, dan rekonsiliasi menyimpan referensi refund. |

### 20.3 Exit criteria MVP

MVP dapat dinyatakan siap digunakan ketika seluruh requirement P0 memiliki test yang lulus atau exception yang disetujui Pak Arif; tidak ada defect kritis pada login, transaksi, pembayaran, stok, dan data loss; backup atau ekspor mitigasi tersedia; data awal tervalidasi; dan UAT telah disetujui atau disertai daftar perbaikan yang disepakati.

---

## 21. Rollout dan Operasional

### 21.1 Tahapan rollout

| Tahap | Aktivitas | Exit condition |
|---|---|---|
| Internal development | Pengembangan dengan data dummy | Alur P0 dapat didemokan end-to-end. |
| Staging | Impor sampel data dan testing tim | Defect kritis internal selesai. |
| Pilot | Digunakan oleh satu atau dua pengguna pada transaksi terbatas | Data konsisten dan staf dapat memakai sistem. |
| Go-live | Seluruh transaksi scope MVP mulai dicatat | Owner menyetujui cutover dan data awal. |
| Hypercare | Tim memonitor bug dan pertanyaan awal | Masalah kritis stabil dan handover selesai. |

### 21.2 Pelatihan

Pelatihan dibagi per role. Staf bengkel berlatih membuat WO, menggunakan barang, dan membuat nota. Staf showroom berlatih mengelola motor dan transaksi penjualan. Owner berlatih membaca dashboard, laporan, approval, dan audit log. Panduan singkat sebaiknya menggunakan screenshot dan skenario nyata.

### 21.3 Dukungan setelah serah terima

Sebelum go-live, tim dan Pak Arif perlu menyepakati periode perbaikan bug, siapa yang menerima laporan masalah, prioritas bug, kepemilikan hosting, akun deployment, domain, backup, dan source code. Permintaan fitur baru tidak diperlakukan sebagai bug.

---

## 22. Roadmap Pengembangan

Jadwal berikut mempertahankan rencana awal proyek dan perlu diperbarui jika baseline scope berubah.[2]

| Tahap | Periode rencana | Hasil utama |
|---|---|---|
| Inisiasi dan validasi | 14–20 Sep 2026 | Charter, stakeholder, konteks, dan kebutuhan awal. |
| Analisis dan desain | 21–30 Sep 2026 | PRD, BPMN, user flow, wireframe, ERD, dan kontrak API awal. |
| Pengembangan backend inti | 1–15 Okt 2026 | Auth, role, master, ledger stok/WAC, work order, transaksi, media, payment adapter, dan API. |
| Pengembangan frontend inti | 16–31 Okt 2026 | Dashboard, form operasional, upload foto, pembayaran, nota, laporan, dan integrasi. |
| Testing dan UAT | 1–15 Nov 2026 | Test transaksi, webhook gateway, storage foto, migrasi, perbaikan, dan UAT stakeholder. |
| Deployment dan serah terima | 16–30 Nov 2026 | MVP ter-deploy, panduan, training, dan persetujuan. |

Urutan implementasi yang disarankan adalah fondasi pengguna, lokasi, motor terpadu, dan master data; kemudian inventory ledger/WAC, storage foto, bengkel, transaksi dan pembayaran, showroom, dashboard/laporan, audit, lalu penyempurnaan UX. Frontend dapat menggunakan kontrak API dan mock sejak tahap desain agar tidak seluruhnya menunggu backend selesai.

---

## 23. Risiko dan Mitigasi

| ID | Risiko | Probabilitas | Dampak | Mitigasi | Owner |
|---|---|---:|---:|---|---|
| RSK-01 | Scope bertambah setelah demo atau wawancara | Tinggi | Tinggi | Tetapkan baseline P0, gunakan backlog P1/P2, dan terapkan change request. | Aya |
| RSK-02 | Data awal barang tidak lengkap atau tidak konsisten | Tinggi | Tinggi | Gunakan template, validasi, sampling, dan mulai dari item aktif. | Ilyas / Pak Arif |
| RSK-03 | Staf kembali memakai buku karena aplikasi sulit | Sedang | Tinggi | Mobile-first, alur singkat, pilot, training, dan iterasi berbasis observasi. | Aya / Syamil |
| RSK-04 | Transaksi dan stok tidak konsisten | Sedang | Sangat tinggi | Transaksi basis data atomik, idempotensi, test kritis, dan audit movement. | Ilyas |
| RSK-05 | Harga modal atau profit terlihat oleh pengguna yang tidak berhak | Sedang | Tinggi | Permission backend, test akses, dan review role sebelum go-live. | Ilyas |
| RSK-06 | Hosting gratis tidak memadai | Sedang | Sedang | Batasi MVP internal, backup, monitoring, dan siapkan opsi upgrade. | Ilyas / Pak Arif |
| RSK-07 | Owner atau staf tidak tersedia untuk UAT | Sedang | Tinggi | Jadwalkan sesi sejak awal dan validasi bertahap melalui prototipe. | Aya / Pak Arif |
| RSK-08 | Branding berubah | Tinggi | Rendah | Simpan identitas bisnis sebagai konfigurasi. | Syamil / Ilyas |
| RSK-09 | Printer nota berbeda dari asumsi | Sedang | Sedang | Gunakan format print-friendly/PDF dan validasi hardware sebagai P1. | Syamil |
| RSK-10 | Rekaman planning tidak lengkap | Tinggi | Sedang | Tandai asumsi dan keputusan terbuka; jangan menganggap detail belum dikonfirmasi sebagai final. | Aya |
| RSK-11 | Provider/payment gateway belum dipilih atau onboarding merchant terlambat | Tinggi | Tinggi | Putuskan provider sebelum implementasi pembayaran; siapkan adapter, sandbox, webhook idempotent, dan fallback hanya untuk tunai/transfer manual. | Ilyas / Pak Arif |
| RSK-12 | Storage foto belum dipilih atau biaya/kapasitas membengkak | Tinggi | Tinggi | Pilih private object storage sebelum fitur foto, batasi 5 MB, kompres otomatis, monitor penggunaan, dan tetapkan retensi. | Ilyas / Pak Arif |
| RSK-13 | Callback pembayaran duplikat, terlambat, atau palsu | Sedang | Sangat tinggi | Verifikasi signature dan nominal, simpan event unik, proses idempotent, dan sediakan rekonsiliasi. | Ilyas |
| RSK-14 | Timing pengurangan stok bengkel tidak sesuai kebiasaan staf | Sedang | Tinggi | Gunakan baseline saat barang aktual dikonfirmasi dipakai dan validasi langsung pada pilot/UAT staf bengkel. | Aya / Ilyas |

---

## 24. Dependensi dan Constraint

Proyek dikerjakan oleh tiga mahasiswa dalam periode akademik sampai 30 November 2026. Tiap anggota memiliki peran utama: Aya pada manajemen dan analisis sistem, Ilyas pada backend/database, serta Syamil pada frontend. MVP menggunakan teknologi open-source dan belum memiliki anggaran hosting komersial yang pasti.[2]

Ketersediaan data awal, akses terhadap Pak Arif dan staf, onboarding provider payment gateway, merchant credential, sandbox/production key, domain, hosting, private object storage, backup, serta akun deployment menjadi dependensi penting. Penggunaan foto bergantung pada biaya storage, akses privat, kebijakan retensi, dan kepemilikan akun layanan. Volume pengguna/item/transaksi dan perangkat aktual juga harus diperoleh sebelum load test dan UAT final.

---

## 25. Keputusan Produk dan Keputusan Terbuka

### 25.1 Keputusan produk terkonfirmasi

| ID | Keputusan | Dampak baseline |
|---|---|---|
| DEC-01 | Nama resmi produk dan usaha adalah Garasi Hobby. | Identitas tetap dapat dikonfigurasi, tetapi nilai awal menggunakan Garasi Hobby. |
| DEC-02 | Bengkel dan showroom sama-sama domain inti MVP; sistem menerima seluruh jenis motor. | Showroom P0 mencakup data/foto/status/pelanggan/penjualan/pembayaran/bukti; inquiry dan proses dagang lanjutan tetap P1/P2. |
| DEC-03 | Pembayaran MVP wajib lunas. | Tunai dan transfer bank diverifikasi manual; QRIS dan e-wallet otomatis melalui payment gateway. |
| DEC-04 | Mekanik bukan user login pada MVP. | Mekanik/PIC disimpan sebagai master operasional dan dipilih oleh staf pada WO. |
| DEC-05 | Diskon dikonfigurasi owner per role dan jenis transaksi. | Default 0%; alasan wajib; di atas batas membutuhkan approval owner dan audit. |
| DEC-06 | Harga modal stok menggunakan weighted average cost. | Barang keluar dan baris transaksi menyimpan snapshot modal historis. |
| DEC-07 | Estimasi tidak mengurangi stok; barang bengkel mengurangi stok saat pemakaian aktual dikonfirmasi. | Finalisasi/pembayaran servis tidak mengurangi stok lagi; reversal digunakan untuk barang yang dikembalikan. |
| DEC-08 | Satu identitas motor digunakan sepanjang siklus showroom, kepemilikan pelanggan, dan servis. | Penjualan memindahkan kepemilikan tanpa menduplikasi motor. |
| DEC-09 | Dokumen final tidak dihapus dan pembatalan menggunakan reversal. | Nomor, alasan, aktor, stok, ownership, pembayaran/refund, dan audit dipertahankan. |
| DEC-10 | Nota MVP menggunakan A4 ramah cetak dan PDF. | Printer thermal tetap P1. |
| DEC-11 | Foto showroom dan foto kondisi awal bengkel wajib. | Showroom minimal tiga foto; WO minimal dua foto; maksimal 5 MB per file dan kompresi otomatis. |
| DEC-12 | MVP beroperasi pada satu lokasi, tetapi skema disiapkan untuk lokasi tambahan. | Tidak ada UI multi-cabang, transfer stok, atau laporan konsolidasi pada MVP. |
| DEC-13 | Migrasi hanya mencakup data aktif, opening balance, dan WO berjalan. | Histori transaksi lama tetap menjadi arsip terpisah; laporan dimulai pada cutover. |
| DEC-14 | Persetujuan estimasi dicatat oleh staf. | Simpan versi/nilai estimasi, nama pemberi persetujuan, waktu, dan metode langsung/telepon/WhatsApp; bukti lampiran opsional. |

### 25.2 Keputusan terbuka

| ID | Pertanyaan | Dampak | Pemilik keputusan | Batas keputusan |
|---|---|---|---|---|
| OQ-01 | Provider payment gateway, merchant account, biaya, settlement, sandbox, dan credential apa yang digunakan? | Menentukan kontrak adapter, channel QRIS/e-wallet, webhook, serta jadwal integrasi. | Pak Arif / Ilyas | Sebelum implementasi pembayaran gateway |
| OQ-02 | Refund gateway dilakukan otomatis melalui API atau manual melalui dashboard provider? | Menentukan alur pembatalan, status Refund Pending/Refunded, dan rekonsiliasi. | Pak Arif / Ilyas | Setelah provider dipilih dan sebelum UAT pembatalan |
| OQ-03 | Hosting, domain, private object storage, backup, biaya, dan pemilik akun layanan apa yang digunakan? | Menentukan deployment, keamanan foto, kapasitas, SLA, dan serah terima. | Pak Arif / tim | Storage sebelum fitur foto; lainnya sebelum deployment |
| OQ-04 | Berapa lama foto showroom dan kondisi WO disimpan? | Menentukan privasi, kapasitas, biaya, dan proses penghapusan/anonymization. | Pak Arif / Aya | Sebelum go-live |
| OQ-05 | Berapa pengguna, item, transaksi bulanan, motor showroom aktif, dan perangkat aktual? | Menentukan baseline kapasitas, load test, dan perangkat UAT. | Pak Arif / staf | Sebelum load test dan UAT final |
| OQ-06 | Berapa masa berlaku default status Reserved dan kapan reservasi dilepas? | Menentukan expiry, notifikasi, dan override owner. Tidak ada deposit pada MVP. | Pak Arif / staf showroom | Sebelum UAT showroom |
| OQ-07 | Apakah checklist dokumen kendaraan cukup atau file dokumen perlu disimpan? | Penyimpanan file sensitif meningkatkan risiko privasi dan scope storage. | Pak Arif | Sebelum fitur dokumen lanjutan |
| OQ-08 | Berapa lama masa dukungan setelah serah terima? | Menentukan tanggung jawab bug fix, SLA, dan perubahan. | Pak Arif / tim | Sebelum go-live |
| OQ-09 | Apakah timing pengurangan stok saat barang aktual dikonfirmasi sesuai kebiasaan staf? | Baseline sudah ditetapkan, tetapi wajib divalidasi melalui observasi pilot/UAT. | Aya / staf bengkel | Saat pilot pertama |

---

## 26. Requirement Traceability Matrix

| Sasaran | Requirement utama | Bukti penerimaan |
|---|---|---|
| Digitalisasi bengkel | WKS-01 s.d. WKS-18, PAY-01 s.d. PAY-13 | UAT-03, UAT-04, UAT-14, UAT-15, UAT-16, UAT-17 |
| Kontrol stok | INV-01 s.d. INV-16, PUR-03 s.d. PUR-06, BR-STK-01 s.d. BR-STK-09 | UAT-02, UAT-04, UAT-05, UAT-08, UAT-09, UAT-20 |
| Operasional showroom | SHR-01 s.d. SHR-17 | UAT-07, UAT-13, UAT-18 |
| Pembayaran penuh | PAY-01 s.d. PAY-13, BR-PAY-01 s.d. BR-PAY-08 | UAT-06, UAT-07, UAT-08, UAT-16, UAT-17, UAT-22, UAT-23 |
| Foto wajib | WKS-03, SHR-04, NFR-SEC-07, NFR-SEC-12 | UAT-13, UAT-14 |
| Persiapan lokasi | MST-12, NFR-REL-06 | UAT-21 |
| Pengawasan owner | DSH-01 s.d. DSH-10, RPT-01 s.d. RPT-13 | UAT-08, UAT-10, UAT-12, UAT-16, UAT-17 |
| Keamanan akses | AUTH-01 s.d. AUTH-08, CTL-05 s.d. CTL-08 | UAT-01, UAT-11, UAT-12 |
| Integritas transaksi | BR-001 s.d. BR-011, BR-WKS-01 s.d. BR-WKS-09, BR-SHR-01 s.d. BR-SHR-08, NFR-REL-01 s.d. NFR-REL-07 | UAT-04, UAT-05, UAT-07, UAT-08, UAT-09, UAT-15, UAT-16, UAT-18, UAT-19 |
| Migrasi dan cutover | Bagian 19, DEC-13 | UAT-20 |
| Kemudahan penggunaan | UX-01 s.d. UX-12 | Observasi pilot dan UAT mobile |

---

## 27. Definition of Ready dan Definition of Done

### 27.1 Definition of Ready

Sebuah fitur siap dikembangkan ketika tujuan pengguna jelas, role dan permission sudah ditentukan, field dan aturan bisnis tersedia, status dan error utama sudah dijelaskan, dependensi telah diketahui, acceptance criteria dapat diuji, serta desain atau user flow tersedia jika diperlukan. Fitur yang bergantung pada layanan eksternal belum Ready sebelum provider, credential sandbox, batas biaya, dan kontrak integrasinya tersedia.

### 27.2 Definition of Done

Sebuah fitur dianggap selesai ketika implementasi frontend dan backend terintegrasi, permission diterapkan di backend, validasi dan error state tersedia, unit/integration test kritis lulus, audit dan stock movement ditambahkan jika relevan, tampilan mobile 360 piksel diperiksa, dokumentasi diperbarui, dan acceptance criteria lulus pada staging. Fitur pembayaran gateway juga harus lulus test signature/idempotensi callback, sedangkan fitur foto harus lulus akses privat, kompresi, validasi tipe/ukuran, dan pemulihan kegagalan upload.

---

## 28. Change Control

Perubahan dibedakan menjadi klarifikasi, bug, dan perubahan scope. Klarifikasi tidak mengubah hasil atau effort secara material. Bug adalah perilaku yang tidak sesuai requirement yang disetujui. Perubahan scope menambah atau mengubah modul, role, workflow, integrasi, data, jadwal, atau biaya.

Setiap change request harus memuat deskripsi, alasan bisnis, requirement terdampak, estimasi effort, risiko, prioritas, dan keputusan Pak Arif. Aya memelihara decision log. Requirement yang telah disetujui tidak diubah diam-diam melalui percakapan informal.

---

## 29. Asumsi Baseline

Dokumen ini menggunakan asumsi berikut sampai ada keputusan lain:

1. Sistem digunakan internal oleh satu lokasi default Garasi Hobby; skema disiapkan untuk lokasi tambahan tanpa fitur multi-cabang pada MVP.
2. Role awal terdiri dari owner, staf bengkel, staf showroom, dan input terbatas. Mekanik/PIC tidak memiliki akun login.
3. PWA digunakan sebagai solusi mobile; native app tidak dibuat pada MVP.
4. Bahasa aplikasi adalah Bahasa Indonesia dan mata uang IDR.
5. Sistem dapat mencatat seluruh jenis motor dengan satu identitas sepanjang lifecycle showroom, pelanggan, dan bengkel.
6. Stock movement menjadi source of truth; stok negatif dilarang dan harga modal menggunakan weighted average cost.
7. Estimasi tidak mengurangi stok. Barang bengkel mengurangi stok ketika pemakaian aktual dikonfirmasi; aturan ini wajib divalidasi pada pilot/UAT.
8. Pembayaran penuh melalui satu metode menjadi baseline; tunai/transfer bank manual dan QRIS/e-wallet gateway didukung, sedangkan piutang/cicilan/deposit/split payment tidak termasuk.
9. Notifikasi awal berada di dalam aplikasi.
10. Nota tersedia dalam format A4 ramah cetak dan PDF; printer thermal belum dijamin.
11. Showroom MVP mencakup data motor, foto wajib, status, pelanggan, penjualan, pembayaran, dan bukti transaksi; inquiry/follow-up belum termasuk.
12. Foto showroom dan kondisi awal WO wajib serta disimpan secara privat; provider storage dan retensi belum diputuskan.
13. Profit yang tampil adalah estimasi operasional, bukan laporan akuntansi formal.
14. Data identitas sensitif dan file legal tidak disimpan sampai kebijakan disetujui.
15. Migrasi dibatasi pada data aktif, opening balance, dan WO berjalan; histori lama menjadi arsip terpisah.
16. Hosting, payment gateway, domain, storage, kapasitas, backup, dan kepemilikan akun layanan harus diputuskan sesuai batas pada Bagian 25.2.

---

## 30. Sign-off

Dokumen ini menjadi baseline setelah ditinjau dan disetujui oleh Product Owner dan Project Manager. Persetujuan menunjukkan kesepahaman atas scope, prioritas, aturan bisnis, acceptance criteria, risiko, serta keputusan terbuka. Persetujuan bukan jaminan bahwa seluruh P1 dan P2 masuk MVP.

| Pihak | Nama / Peran | Persetujuan | Tanggal |
|---|---|---|---|
| Beneficiary / Product Owner | Pak Arif — Owner Garasi Hobby | ____________________ | ____________________ |
| Project Management | Aya — Project Manager / System Analyst | ____________________ | ____________________ |
| Backend / Database | Ilyas — Backend / Database Engineer | ____________________ | ____________________ |
| Frontend | Syamil — Frontend Engineer | ____________________ | ____________________ |

---

## Lampiran A — Ringkasan Backlog per Rilis

### MVP P0

MVP P0 mencakup login dan role, satu lokasi default, master barang/jasa/supplier/metode pembayaran/PIC, satu identitas motor, foto wajib, weighted average cost dan stock movement, penerimaan barang, work order dan versi estimasi, persetujuan pelanggan, pemakaian barang aktual, transaksi servis, penjualan barang langsung, inventaris dan penjualan motor showroom, perpindahan kepemilikan, diskon/approval, pembayaran penuh tunai/transfer manual serta QRIS/e-wallet gateway, nota A4/PDF, dashboard, laporan dasar, audit log, migrasi data aktif, dan pengamanan transaksi kritis.

### Release 1.1 P1

Release 1.1 mencakup inquiry/follow-up showroom, purchase request dan approval lengkap, stock opname, histori supplier, retur penjualan terstruktur, papan pekerjaan, ekspor laporan, profit estimasi lebih baik, reprint log, notifikasi lanjutan, dan usability improvement.

### Fase lanjutan P2

Fase lanjutan mencakup pembayaran parsial, piutang, cicilan, deposit, split payment, trade-in, titip jual, marketplace supplier, integrasi WhatsApp, customer portal, public catalog, operasi multi-cabang, aplikasi native, dan integrasi akuntansi.

---

## Lampiran B — Glosarium

| Istilah | Definisi |
|---|---|
| **MVP** | Minimum Viable Product; versi minimum yang sudah memberikan nilai utama dan dapat diuji pengguna. |
| **PWA** | Progressive Web App; aplikasi web yang responsif dan dapat dipasang seperti aplikasi pada perangkat tertentu. |
| **Work Order (WO)** | Dokumen operasional satu kunjungan servis motor. |
| **Stock Movement** | Catatan ledger setiap penambahan atau pengurangan stok. |
| **Finalisasi** | Tindakan menjadikan dokumen sah dan memengaruhi laporan/status terkait; stok bengkel dapat lebih dahulu berubah saat pemakaian aktual dikonfirmasi. |
| **Reversal** | Pergerakan pembalik untuk mengoreksi dampak transaksi tanpa menghapus histori. |
| **UAT** | User Acceptance Test; pengujian oleh stakeholder untuk memutuskan apakah produk memenuhi kebutuhan. |
| **RBAC** | Role-Based Access Control; pembatasan akses berdasarkan role dan permission. |
| **Soft delete** | Menonaktifkan data tanpa menghapus histori fisik yang masih direferensikan transaksi. |
| **Idempotensi** | Sifat request yang tidak menghasilkan duplikasi ketika dikirim ulang. |
| **Profit estimasi** | Perkiraan margin operasional yang belum mencakup seluruh komponen akuntansi. |
| **Weighted average cost** | Harga modal rata-rata tertimbang yang diperbarui ketika penerimaan barang difinalisasi. |
| **Payment gateway** | Layanan eksternal untuk membuat dan mengonfirmasi pembayaran QRIS/e-wallet secara otomatis. |
| **Payment attempt** | Satu percobaan pembayaran gateway dengan referensi dan statusnya sendiri. |
| **Location** | Referensi lokasi operasional; MVP menggunakan satu lokasi default. |

---

## References

1. Ringkasan Planning Web/App Klien Garasi Hobby — file sumber belum tersedia di folder proyek.
2. [Project Charter Sistem Informasi Operasional Garasi Hobby](../Project_Charter_Professional_Garasi_Hobby.docx).
3. [BPMN Kolaborasi Showroom dan Bengkel Garasi Hobby](../garasi-hobby-showroom-bengkel.bpmn).
4. Rekaman Wawancara Klien Bagian Pertama — file sumber belum tersedia di folder proyek.
5. Rekaman Wawancara Klien Bagian Kedua — file sumber belum tersedia di folder proyek.

[1]: #references "Ringkasan Planning Web/App Klien Garasi Hobby"
[2]: ../Project_Charter_Professional_Garasi_Hobby.docx "Project Charter Sistem Informasi Operasional Garasi Hobby"
[3]: ../garasi-hobby-showroom-bengkel.bpmn "BPMN Kolaborasi Showroom dan Bengkel Garasi Hobby"
[4]: #references "Rekaman Wawancara Klien Bagian Pertama"
[5]: #references "Rekaman Wawancara Klien Bagian Kedua"
