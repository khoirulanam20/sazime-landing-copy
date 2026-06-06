import React, { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ScanLine, CheckCircle2, AlertCircle, ArrowRight, UserRound } from 'lucide-react';
import RegisterRulesDisclosure from '../components/RegisterRulesDisclosure';
import {
    findChipByVerificationId,
    formatVerificationIdDisplay,
    NFC_CHIP_SPEC,
    normalizeVerificationId,
    scanNfcForVerificationId,
} from '../lib/nfcVerification';
import { getConfirmedOwner, normalizeGmail } from '../lib/nfcOwnershipRegistry';
import { useAuth } from '../context/AuthContext';

function readVerificationIdFromSearch(searchParams) {
    return (
        searchParams.get('v')?.trim() ||
        searchParams.get('verification_id')?.trim() ||
        searchParams.get('verivication_id')?.trim() ||
        ''
    );
}

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

function VerifiedProductView({ result, onReset }) {
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500">
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Foto produk</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        {result.gambar.map((img, i) => (
                            <div
                                key={i}
                                className={`aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100 ${
                                    i === 0 ? 'col-span-2 sm:col-span-2 row-span-1' : ''
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${result.nama_produk} — foto ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6 md:p-10 space-y-8">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama produk</p>
                    <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 leading-tight">
                        {result.nama_produk}
                    </p>
                    {result.deskripsi_produk && (
                        <p className="mt-3 text-sm font-medium text-slate-600 leading-relaxed">{result.deskripsi_produk}</p>
                    )}
                </div>

                <div className="rounded-2xl md:rounded-[2rem] bg-slate-900 text-white p-6 md:p-8">
                    <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.25em] mb-5">Ringkasan verifikasi</p>
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">ID verifikasi</p>
                            <p className="font-mono font-black text-lg md:text-xl tracking-wide break-all">
                                {formatVerificationIdDisplay(result.verification_id)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Tgl. ID verifikasi</p>
                            <p className="font-bold text-base md:text-lg">{result.tanggal_verifikasi_id || '—'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi produk</p>
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Referensi produsen</p>
                            <p className="font-bold text-slate-800">{result.nama_pemilik}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">No. seri</p>
                            <p className="font-mono font-bold text-slate-900">{result.nomor_seri || '—'}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Jenis sangkar</p>
                            <p className="font-black text-base md:text-lg leading-snug">{result.jenis_sangkar || result.nama_produk}</p>
                        </div>
                    </div>
                </div>

                <PelangganSangkarPanel key={result.verification_id} verificationId={result.verification_id} />

                <RegisterRulesDisclosure />

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
                        {getConfirmedOwner(result.verification_id) ? 'Pindah kepemilikan' : 'Registrasi pembeli pertama'}
                    </Link>
                    {onReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="py-4 md:py-5 px-6 rounded-2xl md:rounded-3xl font-black text-xs uppercase tracking-widest border-2 border-slate-200 text-slate-700 hover:border-red-600 hover:text-red-600 transition"
                        >
                            Pindai lagi
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const GuestNfcCheck = () => {
    const [searchParams] = useSearchParams();
    const initialRaw = readVerificationIdFromSearch(searchParams);
    const initialId = initialRaw.replace(/\D/g, '').slice(0, 10);
    const initialResult = initialId.length === 10 ? findChipByVerificationId(initialId) : null;

    const [result, setResult] = useState(initialResult);
    const [checked, setChecked] = useState(initialId.length === 10);
    const [lastQueryId, setLastQueryId] = useState(initialId);
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

    const isDirectProductLink = initialId.length === 10;

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

    if (checked) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50 overflow-x-hidden">
                <div className="max-w-3xl mx-auto px-6 py-10 pb-24">
                    {result ? (
                        <VerifiedProductView result={result} onReset={isDirectProductLink ? undefined : reset} />
                    ) : (
                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border-2 border-amber-100 shadow-sm p-10 md:p-16 text-center space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-600">
                                <AlertCircle size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-4">Tidak ditemukan</h1>
                                <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                                    ID verifikasi{' '}
                                    <span className="font-mono font-black text-red-600">
                                        {lastQueryId ? formatVerificationIdDisplay(lastQueryId) : '—'}
                                    </span>{' '}
                                    tidak terdaftar. Periksa tag atau hubungi tim Sazime.
                                </p>
                            </div>
                            <Link
                                to="/cek-nfc"
                                className="inline-flex px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl"
                            >
                                Ke halaman pindai NFC
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-slate-50 overflow-x-hidden">
            <div className="max-w-xl mx-auto px-6 py-12 pb-24">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
                    <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 inline-block shadow-sm">
                        Autentikasi Produk
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 mb-6 leading-tight">
                        Verifikasi <span className="text-red-600">Sangkar</span>
                    </h1>
                    <p className="text-base text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                        Pindai tag NFC HF {NFC_CHIP_SPEC.frekuensi} atau masukkan ID verifikasi untuk melihat detail produk asli.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 shrink-0 rounded-[1.25rem] bg-red-50 text-red-600 flex items-center justify-center">
                                <ScanLine size={26} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-900 mb-1">Pindai NFC</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    Web NFC — Chrome Android. Tag berisi URL scan (NDEF URI).
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => void handleScan()}
                            disabled={scanning || !nfcSupported}
                            className="w-full bg-red-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:bg-black transition disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <ScanLine size={20} /> {scanning ? 'Menunggu tag…' : 'Pindai tag NFC'}
                        </button>

                        {!nfcSupported && (
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Tombol Web NFC aktif di <span className="font-bold text-slate-700">Chrome Android</span>. Di perangkat lain,
                                gunakan kolom <span className="font-bold text-slate-700">verification_id</span> di bawah.
                            </p>
                        )}

                        {scanError && <p className="text-sm font-bold text-red-600">{scanError}</p>}

                        <div className="rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/50 p-5 space-y-3 text-left">
                            <p className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em]">Atau masukkan ID</p>
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
                                Lihat produk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestNfcCheck;
