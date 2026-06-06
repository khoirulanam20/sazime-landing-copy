# Log & spesifikasi teknis — Scan NFC (Cek NFC) untuk sisi admin

Dokumen ini merangkum **perilaku fitur Scan NFC** pada landing Sazime (frontend), **apa yang sebaiknya direkam ke chip**, dan **log perubahan** yang relevan agar tim admin/backend dapat menyelaraskan panel admin, API, dan proses penerbitan/tagging produk.

---

## 1. Ringkasan singkat

- **Tujuan user:** memverifikasi keaslian produk (sangkar) dengan **ID verifikasi publik 10 digit** atau **tautan** yang mengarah ke halaman Cek NFC.
- **Yang dipindai di browser (Chrome Android):** isi **NDEF** pada tag **HF 13,56 MHz** (ISO 14443) — umumnya **satu URL scan** (`url_scan`) atau teks yang memuat `verification_id` / query `v`.
- **Frekuensi tag:** produk Sazime memakai **13,56 MHz (HF NFC)**, **bukan LF 125 kHz**. Tag LF tidak kompatibel dengan Web NFC di browser.
- **Yang tidak dipindai oleh web:** data produk lengkap **tidak wajib** berada di dalam chip; detail katalog (nama produk, gambar, produsen, **`url_scan`**, **`url_preview`**, dll.) di server/API admin berdasarkan **`verification_id`**.

---

## 2. Log pembaruan fitur Scan NFC (untuk referensi admin)

| Tanggal / catatan | Area | Perubahan |
|-------------------|------|-----------|
| Rilis awal alur | Cek NFC | Verifikasi memakai **`verification_id` 10 digit** (format YY + KKK kategori + NNNNN urut). |
| | Pindai Web NFC | Mendukung tag berisi **URL** (query `v`, `verification_id`, atau path berisi 10 digit) atau **NDEF text** berisi 10 digit. |
| | Privasi | **`id_nfc`** internal tidak ditampilkan ke pengguna; yang dipublikasikan hanya **`verification_id`**. |
| | Kepemilikan | Registrasi pemilik & pindah tangan memakai **`verification_id`** + registry kepemilikan (lokal / backend). |
| | Pelanggan sangkar | Data pemilik konsumen ditampilkan **tersensor** (contoh nama `P****L`) tanpa password; penuh jika sesi = pemilik. |
| | Perangkat | Web NFC aktif **Chrome Android**; iPhone mengandalkan **buka URL dari tag**; KTP / e-money **bukan** target tag. |
| **2026-06** | Spesifikasi hardware | Migrasi dokumentasi & data produk: **LF 125 kHz → HF 13,56 MHz** (ISO 14443, NDEF URI). |
| | Field admin | Setiap produk NFC wajib punya **`url_scan`** (ditulis ke chip) dan **`url_preview`** (ditampilkan di landing/admin). |
| | Helper | `buildVerificationScanUrl`, `resolveChipUrls` di `nfcVerification.js`; panel `NfcChipUrlPanel` di hasil scan & modal profil. |

*(Admin dapat menyalin baris di atas ke changelog produk internal dan menambahkan nomor versi/backend sesuai rilis Anda.)*

---

## 3. Penjelasan detail — perekaman NFC & isi chip

### 3.1 Prinsip pemisahan: chip vs server (admin)

**Chip NFC sebaiknya hanya membawa “kunci publik” verifikasi**, bukan seluruh database produk.

- **Di dalam chip (disarankan):** cukup **NDEF** berisi **URL** ke halaman Cek NFC resmi, dengan parameter **`verification_id`** (atau **`v`**) berisi **tepat 10 digit angka**, **atau** NDEF **text/plain** yang berisi **hanya** 10 digit tersebut (atau teks yang tetap memuat 10 digit berkesinambungan yang dapat diekstrak).
- **Di server / panel admin:** simpan **semua atribut katalog** yang relevan: `nama_produk`, `jenis_sangkar`, `nomor_seri`, `nama_pemilik` (produsen), `tanggal_verifikasi_id`, **`nfc_frekuensi`** (`13.56 MHz`), **`nfc_tipe`**, **`url_scan`**, **`url_preview`**, `gambar`, dll., semuanya diindeks oleh **`verification_id`**. Contoh struktur referensi di landing saat ini ada di `src/data/nfcChips.js` — di produksi ini diganti **API** yang dikelola admin.

**Field URL (wajib di admin):**

| Field | Fungsi |
|-------|--------|
| `url_scan` | URL penuh yang **ditulis ke chip** sebagai NDEF URI (contoh: `https://sazime.id/cek-nfc?v=2600100001`). |
| `url_preview` | URL yang **ditampilkan** di landing/modal sebagai preview verifikasi; biasanya sama dengan `url_scan`, bisa kustom jika ada CDN/preview terpisah. |

Jika `url_scan` / `url_preview` kosong di API, landing membangun otomatis: `{origin}/cek-nfc?v={verification_id}`.

Dengan pola ini, **update deskripsi atau foto** di admin **tidak perlu** menulis ulang chip; yang terbaru selalu diambil dari server berdasarkan ID yang sama. **Penerbitan chip ulang** hanya diperlukan jika **URL domain berubah** atau Anda **ingin mengganti format payload** (misalnya migrasi dari text ke URL).

### 3.2 Format `verification_id` (10 digit)

Berdasarkan konvensi di codebase:

- **2 digit pertama (YY):** tahun (contoh `26` = 2026).
- **3 digit berikutnya (KKK):** kode kategori produk (lihat `NFC_PRODUCT_CATEGORIES` di `src/lib/nfcVerification.js`).
- **5 digit terakhir (NNNNN):** nomor urut per kategori (reset per kategori sesuai kebijakan admin).

Contoh: `2600100001` → tahun 26, kategori `001` (Sangkar Murai), nomor `00001`.

Admin bertanggung jawab **menjamin unik** secara global (atah per aturan bisnis) agar satu ID hanya memetakan satu entitas produk.

### 3.3 Frekuensi & hardware tag

- **Standar produk Sazime:** **13,56 MHz**, HF NFC, kompatibel **ISO 14443 Type A/B**, payload **NDEF** (disarankan **URI record**).
- **Bukan LF 125 kHz:** tag LF (animal tag, beberapa access card lama) **tidak** terbaca Web NFC Chrome dan **tidak** memuat NDEF URL untuk alur Cek NFC ini.
- **Chip contoh:** NTAG213/215/216, MIFARE Ultralight (NDEF), atau setara HF yang bisa diprogram URL.

### 3.4 Apa yang “direkam” ke chip — secara teknis (NDEF)

Aplikasi landing saat pembacaan:

1. Memanggil **Web NFC** (`NDEFReader.scan()`).
2. Menerima **`NdefMessage`** berisi satu atau lebih **record**.
3. Untuk tiap record, mencoba menurunkan string **`verification_id` 10 digit**:
   - **Record tipe URL (well-known):** membongkar prefix standar NFC (`http://`, `https://`, `www.`, dll.) lalu mengurai string sebagai URL; dari URL mengambil query **`v`**, **`verification_id`**, atau typo **`verivication_id`**, atau **10 digit berturut-turut di path**.
   - **Record tipe text:** mendekode teks, lalu mengambil **10 digit** pertama yang valid dari string.

**Yang perlu admin tulis ke chip (rekomendasi operasional):**

1. **Opsi utama (disarankan):** satu record **URI** NDEF dengan nilai **`url_scan`** dari admin, contoh:  
   `https://sazime.id/cek-nfc?v=2600100001`  
   atau  
   `https://sazime.id/cek-nfc?verification_id=2600100001`  
   Pastikan domain dan path **sama** dengan environment produksi; **HTTPS** disarankan.
2. **Opsi minimal:** satu record **text** dengan isi persis `2600100001` (10 digit) atau teks yang masih mengandung 10 digit kontigu yang dapat diparsing (kurang disarankan jika ada spasi/pemisah yang memecah digit).

**Tidak disarankan menulis ke chip untuk keperluan landing ini:** data JSON panjang, nama pemilik konsumen, alamat, atau **id_nfc** internal mentah saja tanpa skema yang dikenali browser — reader web tidak memakai itu kecuali Anda memperluas parser (dan tetap dibatasi ke NDEF yang aman).

### 3.5 Yang tidak dimasukkan ke chip (untuk alur Scan NFC saat ini)

- **Profil pemilik konsumen** (nama, alamat, Gmail) — itu hasil **registrasi kepemilikan** di sistem setelah pembelian, bukan isi default chip pabrik.
- **Katalog lengkap** (deskripsi, banyak gambar) — **hanya di server**, keyed by `verification_id`.
- **Rahasia keamanan** — chip verifikasi produk umumnya **read-only NDEF publik**; tidak untuk PIN atau token sensitif.

---

## 4. Alur integrasi admin (checklist)

1. **Penerbitan ID:** admin membuat entri produk + **`verification_id`** unik + field katalog (sesuai skema DB).
2. **Penulisan tag:** tool/programmer NFC menulis **NDEF URI** (atau text) sesuai pasal 3.3.
3. **QC:** tes dengan **Chrome Android** di `/cek-nfc` — pindai atau buka URL dari tag; hasil harus cocok dengan entri di admin.
4. **Registry kepemilikan:** setelah pembeli pertama / pindah tangan, data pemilik dikaitkan dengan **`verification_id`** di backend (di landing demo: `localStorage`).

---

## 5. Batasan yang perlu dikomunikasikan ke CS / admin

- **KTP, e-money, kartu bank** memakai NFC selain NDEF “publik” untuk web — **bukan** target fitur ini; kegagalan scan adalah **ekspektasi normal** di browser.
- **iPhone:** tidak mengandalkan Web NFC dengan API yang sama; user harus **mengetuk tag** agar membuka **URL** (atau gunakan Shortcuts pihak ketiga — di luar cakupan landing default).
- **Timeout:** di kode, pemindaian web dibatalkan setelah **30 detik** jika tidak ada tag yang memberi `verification_id` valid.

---

## 6. Referensi file di repository (landing)

- `src/lib/nfcVerification.js` — normalisasi ID, parsing URL/NDEF, `scanNfcForVerificationId`.
- `src/data/nfcChips.js` — contoh katalog produk (ganti dengan API admin).
- `src/pages/GuestNfcCheck.jsx` — UI Cek NFC, pindai, testing input manual.
- `src/lib/nfcOwnershipRegistry.js` — kepemilikan terkonfirmasi / pending (untuk produksi pindah ke backend).

---

*Dokumen ini dapat disalin ke wiki internal atau WordPress admin tanpa mengubah isi teknis inti di atas.*
