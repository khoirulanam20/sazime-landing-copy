/**
 * id_nfc: internal (tidak ditampilkan ke pengguna).
 * verification_id: 10 digit = YY (tahun) + KKK (kategori) + NNNNN (nomor urut per kategori).
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
        tanggal_pembuatan: '2026-01-15',
        nomor_seri: 'SER-001-2026',
        tanggal_registrasi: '2026-02-01',
        tanggal_verifikasi_id: '2026-01-20',
        gambar: [
            'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=960&h=720&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1444464666168-49d355b43a46?w=960&h=720&auto=format&fit=crop&q=80',
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
