import React, { useState, useRef } from 'react';
import { ScanLine, CheckCircle2, AlertCircle, Send, ArrowRight, Upload, Paperclip } from 'lucide-react';

const TEMPLATE_DOC_PATH = '/templates/surat-permohonan-pindah-pemilik-nfc.docx';
const MAX_DOKUMEN_BYTES = 1.5 * 1024 * 1024;
const ACCEPT_DOKUMEN = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsDataURL(file);
    });
}

const nfcChips = [
    {
        id: 1,
        id_nfc: '1234567890',
        id_produk: 'SK-001',
        nama_produk: 'Sangkar Murai No 1 Original',
        deskripsi_produk: 'Sangkar murai kayu jati ukiran',
        nama_pemilik: 'Sazime Official',
        tanggal_pembuatan: '2026-01-15',
        nomor_seri: 'SER-001-2026',
        tanggal_registrasi: '2026-02-01',
        gambar: [],
    },
    {
        id: 2,
        id_nfc: '0987654321',
        id_produk: 'SK-002',
        nama_produk: 'Sangkar Lovebird Elegan',
        deskripsi_produk: 'Sangkar lovebird bahan stainless',
        nama_pemilik: 'Sazime Woodwork',
        tanggal_pembuatan: '2026-02-10',
        nomor_seri: 'SER-002-2026',
        tanggal_registrasi: '2026-02-15',
        gambar: [],
    },
];

const RequestTransferForm = ({ idNfc, namaProduk, pemilikLama }) => {
    const [open, setOpen] = useState(false);
    const [namaBaru, setNamaBaru] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [dokumen, setDokumen] = useState(null);
    const [dokumenNama, setDokumenNama] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        const val = namaBaru.trim();
        if (!val) {
            setError('Nama pemilik baru wajib diisi');
            return;
        }
        if (val.toLowerCase() === pemilikLama.toLowerCase()) {
            setError('Nama pemilik baru tidak boleh sama dengan pemilik lama');
            return;
        }
        if (!dokumen) {
            setError('Unggah dokumen permohonan yang sudah diisi (PDF, gambar, atau Word).');
            return;
        }
        setError('');

        const requests = JSON.parse(localStorage.getItem('sazime_transfer_requests') || '[]');
        const alreadyPending = requests.some((r) => r.id_nfc === idNfc && r.status === 'pending');
        if (alreadyPending) {
            setError('Permintaan transfer untuk chip ini masih menunggu persetujuan admin.');
            return;
        }

        let dataUrl;
        try {
            dataUrl = await readFileAsDataURL(dokumen);
        } catch {
            setError('Dokumen tidak bisa dibaca. Coba file lain.');
            return;
        }

        const payload = {
            id: Date.now(),
            id_nfc: idNfc,
            nama_produk: namaProduk,
            pemilik_lama: pemilikLama,
            pemilik_baru: val,
            status: 'pending',
            tanggal_pengajuan: new Date().toISOString().slice(0, 10),
            tanggal_diproses: null,
            dokumen: {
                nama_file: dokumen.name,
                tipe: dokumen.type || 'application/octet-stream',
                ukuran_bytes: dokumen.size,
                data_url: dataUrl,
            },
        };

        try {
            requests.push(payload);
            localStorage.setItem('sazime_transfer_requests', JSON.stringify(requests));
        } catch {
            setError('Penyimpanan gagal (file terlalu besar untuk browser). Kurangi ukuran dokumen (maks. 1,5 MB).');
            return;
        }

        setSent(true);
    };

    const onPickFile = (e) => {
        const file = e.target.files?.[0];
        setError('');
        if (!file) {
            setDokumen(null);
            setDokumenNama('');
            return;
        }
        if (file.size > MAX_DOKUMEN_BYTES) {
            setError('Ukuran dokumen maksimal 1,5 MB.');
            e.target.value = '';
            setDokumen(null);
            setDokumenNama('');
            return;
        }
        setDokumen(file);
        setDokumenNama(file.name);
    };

    if (sent) {
        return (
            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-sm">
                    <Send className="w-7 h-7 text-blue-600" />
                </div>
                <p className="font-black text-blue-800 text-xs uppercase tracking-[0.2em]">Permintaan Dikirim</p>
                <p className="text-sm text-blue-600 font-medium">Menunggu persetujuan admin.</p>
            </div>
        );
    }

    return (
        <div className="border-t border-slate-100 pt-8 mt-2">
            {!open ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                >
                    <ArrowRight className="w-4 h-4" /> Request Pindah Pemilik
                </button>
            ) : (
                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-6 space-y-1 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemilik Saat Ini</p>
                        <p className="text-lg font-black text-slate-900">{pemilikLama}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Nama Pemilik Baru
                        </label>
                        <input
                            type="text"
                            value={namaBaru}
                            onChange={(e) => {
                                setNamaBaru(e.target.value);
                                setError('');
                            }}
                            placeholder="Masukkan nama pemilik baru"
                            className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-bold text-sm"
                        />
                    </div>

                    <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Template dokumen</p>
                                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                    Unduh formulir Word (.docx), isi dan tanda tangani, lalu unggah di bawah.
                                </p>
                            </div>
                            <a
                                href={TEMPLATE_DOC_PATH}
                                download="surat-permohonan-pindah-pemilik-nfc.docx"
                                className="text-sm font-black text-red-600 hover:text-red-700 underline underline-offset-4 decoration-2 shrink-0"
                            >
                                Download File
                            </a>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                                Unggah dokumen (wajib)
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPT_DOKUMEN}
                                className="hidden"
                                onChange={onPickFile}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-6 py-5 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-red-300 hover:bg-red-50/30 transition font-bold text-sm text-slate-700"
                            >
                                <Upload className="w-5 h-5 text-red-600 shrink-0" />
                                {dokumenNama ? 'Ganti file' : 'Pilih file (PDF, JPG, PNG, Word)'}
                            </button>
                            {dokumenNama && (
                                <p className="flex items-center gap-2 text-xs font-bold text-slate-600 ml-1">
                                    <Paperclip className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    <span className="truncate">{dokumenNama}</span>
                                </p>
                            )}
                            <p className="text-[10px] font-medium text-slate-400 ml-1">Maks. 1,5 MB.</p>
                        </div>
                    </div>

                    {error && <p className="text-xs font-bold text-red-600 ml-1">{error}</p>}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setNamaBaru('');
                                setError('');
                                setDokumen(null);
                                setDokumenNama('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="flex-1 py-5 bg-white text-slate-700 rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-slate-100 hover:border-slate-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleSubmit()}
                            className="flex-1 py-5 bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-100 hover:bg-black transition flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> Kirim Permintaan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const GuestNfcCheck = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        if (input.length !== 10) return;
        const found = nfcChips.find((c) => c.id_nfc === input);
        setResult(found || null);
        setChecked(true);
    };

    return (
        <div className="pt-24 min-h-screen bg-slate-50 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
                <div className="text-center mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
                        Autentikasi Produk
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 mb-8 leading-tight">
                        Cek Chip <span className="text-red-600">NFC</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Verifikasi keaslian sangkar dan riwayat kepemilikan dengan memasukkan 10 digit kode NFC pada produk Anda.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 shrink-0 rounded-[1.5rem] bg-red-50 text-red-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-500">
                                        <ScanLine size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 mb-2">
                                            Masukkan Kode
                                        </h2>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                            Hanya angka, tepat 10 digit sesuai label NFC
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                        Kode NFC (10 Digit)
                                    </label>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="0000000000"
                                        className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-slate-50 outline-none focus:border-red-600 focus:bg-white transition font-mono font-black text-center text-xl sm:text-2xl tracking-[0.35em]"
                                        maxLength={10}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheck}
                                    disabled={input.length !== 10}
                                    className="w-full bg-red-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-100 hover:bg-black transition-all transform hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                                >
                                    <ScanLine size={20} /> Cek Sekarang
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        {!checked && (
                            <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm min-h-[320px] flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-8">
                                    <ScanLine size={40} strokeWidth={1.25} />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-4">
                                    Siap Memverifikasi?
                                </h3>
                                <p className="text-slate-500 font-medium max-w-md leading-relaxed">
                                    Setelah kode lengkap, tap <span className="font-black text-slate-800">Cek Sekarang</span>. Detail produk dan
                                    status chip akan muncul di panel ini.
                                </p>
                            </div>
                        )}

                        {checked && (
                            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                                {result ? (
                                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-8 md:p-10 bg-emerald-50/80 border-b border-emerald-100 flex flex-wrap items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                                <CheckCircle2 size={28} />
                                            </div>
                                            <div>
                                                <span className="font-black text-emerald-800 text-xs uppercase tracking-[0.2em] block mb-1">
                                                    Berhasil
                                                </span>
                                                <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-emerald-950">
                                                    Chip Terverifikasi
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-8 md:p-12 space-y-8">
                                            {result.gambar?.length > 0 && (
                                                <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
                                                    {result.gambar.map((img, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-24 h-24 rounded-3xl overflow-hidden border border-slate-100 shrink-0 shadow-sm"
                                                        >
                                                            <img src={img} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ID NFC</p>
                                                    <p className="font-mono font-black text-slate-900 text-lg">{result.id_nfc}</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                        ID Produk
                                                    </p>
                                                    <p className="font-black text-slate-900 text-lg">{result.id_produk}</p>
                                                </div>
                                                <div className="sm:col-span-2 bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                        Nama Produk
                                                    </p>
                                                    <p className="font-black text-slate-900 text-lg">{result.nama_produk}</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pemilik</p>
                                                    <p className="font-black text-slate-900">{result.nama_pemilik}</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                        No. Seri
                                                    </p>
                                                    <p className="font-mono font-bold text-slate-900">{result.nomor_seri || '-'}</p>
                                                </div>
                                                {result.deskripsi_produk && (
                                                    <div className="sm:col-span-2 bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                            Deskripsi
                                                        </p>
                                                        <p className="font-medium text-slate-600 leading-relaxed">{result.deskripsi_produk}</p>
                                                    </div>
                                                )}
                                                {result.tanggal_pembuatan && (
                                                    <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                            Tgl. Pembuatan
                                                        </p>
                                                        <p className="font-bold text-slate-900">{result.tanggal_pembuatan}</p>
                                                    </div>
                                                )}
                                                {result.tanggal_registrasi && (
                                                    <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                            Tgl. Registrasi
                                                        </p>
                                                        <p className="font-bold text-slate-900">{result.tanggal_registrasi}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <RequestTransferForm
                                                idNfc={result.id_nfc}
                                                namaProduk={result.nama_produk}
                                                pemilikLama={result.nama_pemilik}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[4rem] border-2 border-amber-100 shadow-sm p-12 md:p-16 text-center space-y-8">
                                        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-600">
                                            <AlertCircle size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-4">
                                                Chip Tidak Ditemukan
                                            </h3>
                                            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                                                Kode NFC{' '}
                                                <span className="font-mono font-black text-red-600">{input}</span> tidak terdaftar di sistem
                                                kami. Periksa kembali angka pada label atau hubungi tim Sazime.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInput('');
                                                setChecked(false);
                                                setResult(null);
                                            }}
                                            className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestNfcCheck;
