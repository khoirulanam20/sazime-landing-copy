/**
 * id_nfc: internal (tidak ditampilkan ke pengguna).
 * verification_id: 10 digit = YY (tahun) + KKK (kategori) + NNNNN (nomor urut per kategori).
 * nfc_frekuensi: HF 13.56 MHz (ISO 14443 / NDEF) — bukan LF 125 kHz.
 * url_scan: URL NDEF yang ditulis ke chip (tempel tag → buka halaman ini).
 * url_preview: URL preview verifikasi (tampil di admin/landing; default = url_scan).
 * jenis_sangkar: tipe sangkar yang ditampilkan setelah scan.
 * tanggal_verifikasi_id: tanggal ID verifikasi diterbitkan.
 */
export const nfcChips = [
    {
        id: 1,
        id_nfc: '1234567890',
        verification_id: '2600100001',
        id_produk: 'SK-001',
        nama_produk: 'Sangkar Murai No 1 Original',
        jenis_sangkar: 'Sangkar Murai No. 1',
        deskripsi_produk: 'Sangkar murai kayu jati ukiran',
        nama_pemilik: 'Sazime Official',
        nfc_frekuensi: '13.56 MHz',
        nfc_tipe: 'HF NFC (ISO 14443, NDEF)',
        url_scan: 'https://sazime-landing-web.vercel.app/cek-nfc?v=2600100001',
        url_preview: 'https://sazime-landing-web.vercel.app/cek-nfc?v=2600100001',
        tanggal_pembuatan: '2026-01-15',
        nomor_seri: 'SER-001-2026',
        tanggal_registrasi: '2026-02-01',
        tanggal_verifikasi_id: '2026-01-20',
        gambar: [
            'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=960&h=720&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1444464666168-49d355b43a46?w=960&h=720&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1465146344425-f00d78f86744?w=960&h=720&auto=format&fit=crop&q=80',
        ],
    },
    {
        id: 2,
        id_nfc: '0987654321',
        verification_id: '2600200001',
        id_produk: 'SK-002',
        nama_produk: 'Sangkar Lovebird Elegan',
        jenis_sangkar: 'Sangkar Lovebird',
        deskripsi_produk: 'Sangkar lovebird bahan stainless',
        nama_pemilik: 'Sazime Woodwork',
        nfc_frekuensi: '13.56 MHz',
        nfc_tipe: 'HF NFC (ISO 14443, NDEF)',
        url_scan: 'https://sazime.id/cek-nfc?v=2600200001',
        url_preview: 'https://sazime.id/cek-nfc?v=2600200001',
        tanggal_pembuatan: '2026-02-10',
        nomor_seri: 'SER-002-2026',
        tanggal_registrasi: '2026-02-15',
        tanggal_verifikasi_id: '2026-02-11',
        gambar: [
            'https://images.unsplash.com/photo-1452579951922-ffba9d387650?w=960&h=720&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506439773649-4564547471de?w=960&h=720&auto=format&fit=crop&q=80',
        ],
    },
];
