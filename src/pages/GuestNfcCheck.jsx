import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ScanLine, CheckCircle2, AlertCircle, ArrowRight, UserRound } from 'lucide-react';
import RegisterRulesDisclosure from '../components/RegisterRulesDisclosure';
import NfcChipUrlPanel from '../components/NfcChipUrlPanel';
import {
    findChipByVerificationId,
    formatVerificationIdDisplay,
    NFC_CHIP_SPEC,
    normalizeVerificationId,
    scanNfcForVerificationId,
} from '../lib/nfcVerification';
import { getConfirmedOwner, normalizeGmail } from '../lib/nfcOwnershipRegistry';
import { useAuth } from '../context/AuthContext';

/** Sensor teks: huruf pertama + **** + huruf terakhir (contoh: P****L). */
function maskEdges(s) {
    const t = String(s ?? '').trim();
    if (!t) return '—';
    if (t.length === 1) return `${t}****`;
    return `${t[0]}****${t[t.length - 1]}`;
}

function maskAddressRough(s) {
    const t = String(s ?? '').trim();
    if (!t) return '—';
    const compact = t.replace(/\s+/g, '');
    if (compact.length <= 4) return maskEdges(compact);
    return `${compact.slice(0, 2)}****${compact.slice(-2)}`;
}

function maskGmail(gmail) {
    const g = String(gmail || '');
    const at = g.indexOf('@');
    if (at < 1) return '***@gmail.com';
    const local = g.slice(0, at);
    const domain = g.slice(at + 1);
    const prefix = local.slice(0, Math.min(3, local.length));
    return `${prefix}***@${domain}`;
}

function PelangganSangkarPanel({ verificationId }) {
    const { user } = useAuth();
    const registered = getConfirmedOwner(verificationId);
    const ownerEmail = registered?.gmail || '';
    const isOwnerSession = Boolean(user && registered && normalizeGmail(user.email) === normalizeGmail(ownerEmail));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                    <UserRound size={22} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelanggan sangkar</p>
                    <p className="text-sm font-bold text-slate-700">Data pemilik terdaftar</p>
                </div>
            </div>

            {!registered ? (
                <p className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    Belum ada pemilik konsumen — pembeli pertama wajib registrasi &amp; konfirmasi email.
                </p>
            ) : (
                <div className="space-y-3 rounded-xl bg-slate-50 border border-slate-100 p-5">
                    {!isOwnerSession && (
                        <p className="text-xs font-medium text-slate-600 leading-relaxed pb-1 border-b border-slate-200/80">
                            Nama, alamat, dan Gmail ditampilkan dalam bentuk <span className="font-bold text-slate-800">tersensor</span> untuk
                            privasi (contoh nama: <span className="font-mono font-bold">P****L</span>).
                        </p>
                    )}
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama</p>
                        <p className="font-black text-slate-900 text-lg leading-tight tracking-wide">
                            {isOwnerSession ? registered.nama : maskEdges(registered.nama)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alamat</p>
                        <p className="text-sm font-bold text-slate-700 uppercase leading-relaxed font-mono">
                            {isOwnerSession ? registered.alamat : maskAddressRough(registered.alamat)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gmail</p>
                        <p className="font-mono text-sm font-bold text-slate-900 break-all">
                            {isOwnerSession ? registered.gmail : maskGmail(registered.gmail)}
                        </p>
                    </div>
                    {isOwnerSession && (
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider pt-2 border-t border-slate-200">
                            Data lengkap — Anda masuk sebagai pemilik terdaftar
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

const GuestNfcCheck = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [result, setResult] = useState(null);
    const [checked, setChecked] = useState(false);
    const [lastQueryId, setLastQueryId] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const [testVerificationId, setTestVerificationId] = useState('');
    const [testError, setTestError] = useState('');

    const resolveFromValue = useCallback((raw) => {
        const found = findChipByVerificationId(raw);
        setResult(found);
        setChecked(true);
        setLastQueryId(String(raw ?? '').replace(/\D/g, '').slice(0, 10));
    }, []);

    useEffect(() => {
        const fromUrl =
            searchParams.get('v')?.trim() ||
            searchParams.get('verification_id')?.trim() ||
            searchParams.get('verivication_id')?.trim();
        if (!fromUrl) return;
        resolveFromValue(fromUrl);
        const next = new URLSearchParams(searchParams);
        next.delete('v');
        next.delete('verification_id');
        next.delete('verivication_id');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams, resolveFromValue]);

    const handleScan = async () => {
        setScanError('');
        setScanning(true);
        try {
            const id = await scanNfcForVerificationId();
            resolveFromValue(id);
        } catch (e) {
            setScanError(e instanceof Error ? e.message : 'Pemindaian gagal.');
        } finally {
            setScanning(false);
        }
    };

    const submitTestVerification = () => {
        setTestError('');
        const id = normalizeVerificationId(testVerificationId);
        if (id.length !== 10) {
            setTestError('Masukkan tepat 10 digit verification_id (contoh: 2600100001).');
            return;
        }
        resolveFromValue(id);
    };

    const reset = () => {
        setResult(null);
        setChecked(false);
        setLastQueryId('');
        setScanError('');
        setTestError('');
        setTestVerificationId('');
    };

    const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

    return (
        <div className="pt-24 min-h-screen bg-slate-50 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
                <div className="text-center mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-sm">
                        Autentikasi Produk
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 mb-8 leading-tight">
                        Verifikasi <span className="text-red-600">Sangkar</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Verifikasi lewat <span className="text-slate-700 font-bold">NFC HF {NFC_CHIP_SPEC.frekuensi}</span> (ISO 14443 / NDEF): Android (Chrome) pakai tombol pindai; iPhone{' '}
                        <span className="text-slate-700 font-bold">tempel tag</span> berisi URL scan. Untuk uji cepat tanpa tag, gunakan kolom{' '}
                        <span className="text-slate-700 font-bold">verification_id</span> di panel kiri (sementara).
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
                                            Pindai NFC
                                        </h2>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                            Web NFC — Chrome Android. Tag HF {NFC_CHIP_SPEC.frekuensi} berisi URL scan (NDEF URI), bukan LF 125 kHz.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => void handleScan()}
                                    disabled={scanning || !nfcSupported}
                                    className="w-full bg-red-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-100 hover:bg-black transition-all transform hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                                >
                                    <ScanLine size={20} /> {scanning ? 'Menunggu tag…' : 'Pindai tag NFC'}
                                </button>

                                {!nfcSupported && (
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                        Tombol Web NFC aktif di <span className="font-bold text-slate-700">Chrome Android</span>. Di perangkat
                                        lain atau untuk uji cepat, isi kolom <span className="font-bold text-slate-700">verification_id</span>{' '}
                                        (testing) di bawah.
                                    </p>
                                )}

                                {nfcSupported && (
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                                        <span className="font-bold text-slate-800">Hanya tag produk Sazime (HF {NFC_CHIP_SPEC.frekuensi}).</span> Chip KTP, kartu e-money
                                        (Flazz, tap payment, dsb.), dan kartu bank memakai NFC lain — biasanya{' '}
                                        <span className="font-bold">tidak bisa</span> dibaca Chrome (bukan format NDEF untuk web). Gunakan tag
                                        sangkar Sazime atau uji dengan kolom <span className="font-bold">verification_id</span>.
                                    </p>
                                )}

                                {scanError && <p className="text-sm font-bold text-red-600">{scanError}</p>}

                                <div className="rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/50 p-5 space-y-3 text-left">
                                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em]">Testing sementara</p>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                        Masukkan <span className="font-bold">verification_id</span> 10 digit dari data dummy (mis.{' '}
                                        <span className="font-mono">2600100001</span>, <span className="font-mono">2600200001</span>).
                                    </p>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                                        verification_id
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        value={testVerificationId}
                                        onChange={(e) => {
                                            setTestVerificationId(e.target.value.replace(/\D/g, '').slice(0, 10));
                                            setTestError('');
                                        }}
                                        placeholder="0000000000"
                                        maxLength={10}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-amber-100 outline-none focus:border-red-600 font-mono font-black text-center tracking-widest text-lg"
                                        onKeyDown={(e) => e.key === 'Enter' && submitTestVerification()}
                                    />
                                    {testError && <p className="text-sm font-bold text-red-600">{testError}</p>}
                                    <button
                                        type="button"
                                        onClick={submitTestVerification}
                                        disabled={testVerificationId.length !== 10}
                                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-amber-700 text-white hover:bg-amber-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Cek (testing)
                                    </button>
                                </div>
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
                                    <span className="font-black text-slate-800">Pindai NFC</span>, buka dari tag/URL, atau{' '}
                                    <span className="font-black text-slate-800">isi verification_id</span> (testing) di panel kiri.
                                </p>
                            </div>
                        )}

                        {checked && (
                            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                                {result ? (
                                    <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                                        {/* Header sukses */}
                                        <div className="px-6 py-6 md:px-10 md:py-8 bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100/80">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-md border border-emerald-100">
                                                    <CheckCircle2 size={28} />
                                                </div>
                                                <div>
                                                    <span className="font-black text-emerald-700 text-[11px] uppercase tracking-[0.2em] block mb-0.5">
                                                        Berhasil diverifikasi
                                                    </span>
                                                    <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900">
                                                        Produk asli Sazime
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {result.gambar?.length > 0 && (
                                            <div className="px-6 pt-6 md:px-10 md:pt-10 pb-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    Foto produk
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                                    {result.gambar.map((img, i) => (
                                                        <div
                                                            key={i}
                                                            className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${result.nama_produk} — foto ${i + 1}`}
                                                                className="w-full h-full object-cover hover:scale-[1.02] transition duration-300"
                                                                loading="lazy"
                                                                decoding="async"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-6 md:p-10 space-y-8">
                                            {/* Ringkasan chip — gelap, grid rapat */}
                                            <div className="rounded-2xl md:rounded-[2rem] bg-slate-900 text-white p-6 md:p-8">
                                                <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.25em] mb-5">
                                                    Ringkasan verifikasi
                                                </p>
                                                <div className="grid sm:grid-cols-3 gap-6 sm:gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                                                            ID verifikasi
                                                        </p>
                                                        <p className="font-mono font-black text-lg md:text-xl tracking-wide break-all">
                                                            {formatVerificationIdDisplay(result.verification_id)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                                                            Tgl. ID verifikasi
                                                        </p>
                                                        <p className="font-bold text-base md:text-lg">{result.tanggal_verifikasi_id || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <NfcChipUrlPanel chip={result} />

                                            {/* Detail produk */}
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    Informasi produk
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                            Nama produk
                                                        </p>
                                                        <p className="font-black text-slate-900">{result.nama_produk}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                            Referensi produsen
                                                        </p>
                                                        <p className="font-bold text-slate-800">{result.nama_pemilik}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                            No. seri
                                                        </p>
                                                        <p className="font-mono font-bold text-slate-900">{result.nomor_seri || '—'}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                            Jenis sangkar
                                                        </p>
                                                        <p className="font-black text-base md:text-lg leading-snug">
                                                            {result.jenis_sangkar || result.nama_produk}
                                                        </p>
                                                    </div>
                                                    {result.deskripsi_produk && (
                                                        <div className="sm:col-span-2 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                                Deskripsi
                                                            </p>
                                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                                                {result.deskripsi_produk}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <RegisterRulesDisclosure />

                                            <PelangganSangkarPanel
                                                key={result.verification_id}
                                                verificationId={result.verification_id}
                                            />

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <Link
                                                    to={
                                                        user
                                                            ? `/cek-nfc/registrasi?verification_id=${encodeURIComponent(result.verification_id)}`
                                                            : `/masuk?next=${encodeURIComponent(
                                                                  `/cek-nfc/registrasi?verification_id=${result.verification_id}`,
                                                              )}`
                                                    }
                                                    className="flex-1 py-4 md:py-5 bg-red-600 text-white rounded-2xl md:rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                    {getConfirmedOwner(result.verification_id)
                                                        ? 'Pindah kepemilikan'
                                                        : 'Registrasi pembeli pertama'}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={reset}
                                                    className="py-4 md:py-5 px-6 rounded-2xl md:rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-slate-200 text-slate-700 hover:border-red-600 hover:text-red-600 transition"
                                                >
                                                    Pindai lagi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[4rem] border-2 border-amber-100 shadow-sm p-12 md:p-16 text-center space-y-8">
                                        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-600">
                                            <AlertCircle size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-4">
                                                Tidak ditemukan
                                            </h3>
                                            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                                                ID verifikasi{' '}
                                                <span className="font-mono font-black text-red-600">
                                                    {lastQueryId ? formatVerificationIdDisplay(lastQueryId) : '—'}
                                                </span>{' '}
                                                tidak terdaftar. Periksa tag atau hubungi tim Sazime.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={reset}
                                            className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl"
                                        >
                                            Coba lagi
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
