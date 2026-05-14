import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, User, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { findChipByVerificationId, formatVerificationIdDisplay, normalizeVerificationId } from '../lib/nfcVerification';
import { useAuth } from '../context/AuthContext';
import {
    getConfirmedOwner,
    isValidGmail,
    normalizeGmail,
    normalizeOwnerNameAddress,
    submitFirstOwnerPending,
    submitTransferPending,
} from '../lib/nfcOwnershipRegistry';

const RULES_FIRST = [
    'Anda harus sudah punya akun dan masuk. Nama & alamat otomatis huruf besar; Gmail diambil dari akun (harus @gmail.com aktif).',
    'Sazime mengirim email konfirmasi ke Gmail akun Anda; setelah konfirmasi, kepemilikan terdaftar dan produk muncul di Profil → Produk saya.',
];

const RULES_TRANSFER = [
    'Masuk dengan akun Gmail calon pemilik baru (bukan akun pemilik lama). Form sama: nama & alamat CAPS; Gmail dari akun.',
    'Konfirmasi dikirim ke Gmail pemilik terdaftar saat ini. Sazime tidak menyetujui—hanya pemilik sebelumnya.',
];

function RegisterFormFields({
    chip,
    user,
    confirmed,
    isTransfer,
    initialNama,
    initialAlamat,
    onSuccess,
}) {
    const [nama, setNama] = useState(initialNama);
    const [alamat, setAlamat] = useState(initialAlamat);
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setError('');
        const n = normalizeOwnerNameAddress(nama).trim();
        const a = normalizeOwnerNameAddress(alamat).trim();
        const g = normalizeGmail(user?.email || '');

        if (!user) {
            setError('Sesi habis. Masuk lagi.');
            return;
        }
        if (isTransfer && g === normalizeGmail(confirmed?.gmail || '')) {
            setError('Gunakan akun Gmail calon pemilik baru (bukan akun pemilik yang terdaftar saat ini).');
            return;
        }

        if (n.length < 2) {
            setError('Nama wajib diisi.');
            return;
        }
        if (a.length < 8) {
            setError('Alamat wajib diisi dengan lengkap.');
            return;
        }
        if (!isValidGmail(g)) {
            setError('Masukkan Gmail aktif dari akun Anda.');
            return;
        }

        try {
            if (isTransfer) {
                const { confirmUrl } = submitTransferPending(chip.verification_id, { nama: n, alamat: a, gmail: g });
                const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${confirmUrl}` : confirmUrl;
                onSuccess({
                    title: 'Email konfirmasi ke pemilik sebelumnya',
                    body: `Pada produksi, Sazime mengirim permintaan konfirmasi ke ${confirmed.gmail}. Pemilik sebelumnya harus membuka tautan di email dan menyetujui.`,
                    demoLink: fullUrl,
                });
            } else {
                const { confirmUrl } = submitFirstOwnerPending(chip.verification_id, { nama: n, alamat: a, gmail: g });
                const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${confirmUrl}` : confirmUrl;
                onSuccess({
                    title: 'Email konfirmasi dari Sazime',
                    body: `Pada produksi, Sazime mengirim email ke ${g}. Buka email dan konfirmasi agar registrasi selesai.`,
                    demoLink: fullUrl,
                });
            }
            setNama('');
            setAlamat('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan.');
        }
    };

    return (
        <form onSubmit={submit} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Nama (otomatis huruf besar)
                </label>
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(normalizeOwnerNameAddress(e.target.value))}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 outline-none focus:border-red-600 font-bold uppercase"
                    placeholder="NAMA LENGKAP"
                    autoComplete="name"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Alamat (otomatis huruf besar)
                </label>
                <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(normalizeOwnerNameAddress(e.target.value))}
                    rows={3}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 outline-none focus:border-red-600 font-bold uppercase resize-none"
                    placeholder="ALAMAT LENGKAP"
                    autoComplete="street-address"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Gmail akun (mengikuti sesi, tidak dapat diubah di sini)
                </label>
                <input
                    type="email"
                    readOnly
                    aria-readonly="true"
                    value={user?.email || ''}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 font-mono lowercase text-sm text-slate-600 cursor-not-allowed"
                />
            </div>

            {error && (
                <div className="flex items-start gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

                <div className="rounded-[2rem] border border-amber-100 bg-amber-50/60 p-4 mb-6 text-xs font-medium text-amber-900 leading-relaxed">
                    Anda sedang masuk sebagai <span className="font-mono font-bold">{user?.email}</span>. Gmail ini dipakai untuk alur
                    konfirmasi email dan harus sama dengan yang terdaftar di akun.
                    {isTransfer ? (
                        <>
                            {' '}
                            Pada <span className="font-bold">pindah tangan</span>, nama dan alamat diisi otomatis dari profil akun (bisa
                            disesuaikan sebelum kirim). Lengkapi alamat di <span className="font-bold">Profil</span> jika masih kosong.
                        </>
                    ) : null}
                </div>

            <button
                type="submit"
                className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-black transition"
            >
                Kirim &amp; minta konfirmasi email
            </button>
        </form>
    );
}

export default function NfcOwnershipRegister() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const vRaw =
        searchParams.get('verification_id')?.trim() ||
        searchParams.get('v')?.trim() ||
        searchParams.get('verivication_id')?.trim() ||
        '';
    const verificationParam = normalizeVerificationId(vRaw);

    const chip = useMemo(() => {
        if (verificationParam.length !== 10) return null;
        return findChipByVerificationId(verificationParam);
    }, [verificationParam]);

    const confirmed = chip ? getConfirmedOwner(chip.verification_id) : null;
    const isTransfer = Boolean(confirmed);

    const registrasiPath = `/cek-nfc/registrasi?verification_id=${encodeURIComponent(chip?.verification_id || verificationParam)}`;
    const transferSameOwner =
        isTransfer &&
        Boolean(user?.email) &&
        normalizeGmail(user.email) === normalizeGmail(confirmed?.gmail || '');

    const [done, setDone] = useState(null);

    const goSwitchAccountForTransfer = () => {
        logout();
        navigate(`/masuk?next=${encodeURIComponent(registrasiPath)}`);
    };

    const initialNamaTransfer =
        isTransfer && user && !transferSameOwner ? normalizeOwnerNameAddress(user.name || '') : '';
    const initialAlamatTransfer =
        isTransfer && user && !transferSameOwner ? normalizeOwnerNameAddress(user.alamat || '') : '';

    const formKey = `${chip?.verification_id || ''}-${isTransfer ? 't' : 'f'}-${user?.id || 'x'}-${transferSameOwner ? 'same' : 'ok'}-a${(user?.alamat || '').length}`;

    if (!verificationParam) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="max-w-xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-2xl font-black italic text-slate-900 mb-4">Parameter tidak lengkap</h1>
                    <Link to="/cek-nfc" className="text-red-600 font-black text-sm uppercase tracking-widest">
                        Ke verifikasi NFC
                    </Link>
                </div>
            </div>
        );
    }

    if (!chip) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="max-w-xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-2xl font-black italic text-slate-900 mb-4">Produk tidak ditemukan</h1>
                    <p className="text-slate-600 mb-8 font-medium">{formatVerificationIdDisplay(verificationParam)}</p>
                    <Link to="/cek-nfc" className="text-red-600 font-black text-sm uppercase tracking-widest">
                        Ke verifikasi NFC
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-slate-50 pb-24">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <Link
                    to={`/cek-nfc?v=${encodeURIComponent(chip.verification_id)}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-red-600 uppercase tracking-widest mb-10"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke hasil cek
                </Link>

                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 mb-2">
                    Registrasi <span className="text-red-600">/ Pindah tangan</span>
                </h1>

                {isTransfer && confirmed && (
                    <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5 mb-8 text-sm text-slate-700">
                        <p className="font-black text-xs uppercase tracking-widest text-slate-500 mb-2">Pemilik terdaftar saat ini</p>
                        <p className="font-bold text-slate-900">{confirmed.nama}</p>
                        <p className="text-xs mt-1">Konfirmasi akan dikirim ke: {confirmed.gmail}</p>
                    </div>
                )}

                {done ? (
                    <div className="rounded-[2rem] bg-emerald-50 border border-emerald-100 p-8 md:p-10 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-800">
                            <CheckCircle2 className="w-8 h-8 shrink-0" />
                            <p className="font-black text-lg">{done.title}</p>
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">{done.body}</p>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Simulasi pengembangan (tanpa email sungguhan)</p>
                        <a
                            href={done.demoLink}
                            className="inline-flex break-all text-sm font-black text-red-600 underline underline-offset-4"
                        >
                            {done.demoLink}
                        </a>
                        <div>
                            <Link
                                to="/cek-nfc"
                                className="inline-block mt-4 px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest"
                            >
                                Selesai
                            </Link>
                        </div>
                    </div>
                ) : transferSameOwner ? (
                    <div className="rounded-[2rem] border-2 border-amber-200 bg-amber-50/90 shadow-sm p-8 md:p-10 space-y-6">
                        <div className="flex gap-4 text-amber-950">
                            <AlertCircle className="w-8 h-8 shrink-0 text-amber-600" />
                            <div className="space-y-3">
                                <h2 className="font-black text-lg md:text-xl text-slate-900 leading-tight">
                                    Pindah tangan: gunakan akun calon pemilik baru
                                </h2>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    Anda login sebagai <span className="font-mono font-bold">{user?.email}</span>, sama dengan pemilik NFC
                                    saat ini. Pengajuan pindah tangan harus dari Gmail pemilik baru (bukan pemilik lama).
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                    Keluar, lalu daftar atau masuk dengan akun calon pemilik, lalu buka halaman ini lagi.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={goSwitchAccountForTransfer}
                                className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black transition text-center"
                            >
                                Keluar &amp; masuk akun lain
                            </button>
                            <Link
                                to={`/daftar?next=${encodeURIComponent(registrasiPath)}`}
                                className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-300 bg-white font-black text-xs uppercase tracking-widest text-slate-800 hover:border-red-600 hover:text-red-600 transition text-center flex items-center justify-center"
                            >
                                Daftar Gmail baru
                            </Link>
                        </div>
                    </div>
                ) : (
                    <RegisterFormFields
                        key={formKey}
                        chip={chip}
                        user={user}
                        confirmed={confirmed}
                        isTransfer={isTransfer}
                        initialNama={isTransfer ? initialNamaTransfer : ''}
                        initialAlamat={isTransfer ? initialAlamatTransfer : ''}
                        onSuccess={setDone}
                    />
                )}
            </div>
        </div>
    );
}
