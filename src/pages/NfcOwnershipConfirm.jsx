import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { confirmPendingByToken, findPendingByToken } from '../lib/nfcOwnershipRegistry';
import { formatVerificationIdDisplay } from '../lib/nfcVerification';

export default function NfcOwnershipConfirm() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')?.trim() || '';

    const pending = useMemo(() => (token ? findPendingByToken(token) : null), [token]);
    const [result, setResult] = useState(null);

    const confirm = () => {
        if (!token) return;
        const r = confirmPendingByToken(token);
        setResult(r);
    };

    if (!token) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-slate-900 mb-4">Tautan tidak lengkap</h1>
                    <Link to="/cek-nfc" className="text-red-600 font-black text-xs uppercase tracking-widest">
                        Ke verifikasi NFC
                    </Link>
                </div>
            </div>
        );
    }

    if (!pending && !result?.ok) {
        if (result && !result.ok) {
            return (
                <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-black text-slate-900 mb-4">Tautan tidak berlaku</h1>
                        <p className="text-slate-600 mb-8 font-medium">{result.error}</p>
                        <Link to="/cek-nfc" className="text-red-600 font-black text-xs uppercase tracking-widest">
                            Ke verifikasi NFC
                        </Link>
                    </div>
                </div>
            );
        }
        return (
            <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-slate-900 mb-4">Tautan kedaluwarsa</h1>
                    <p className="text-slate-600 mb-8 font-medium">Konfirmasi sudah dipakai atau tidak ditemukan.</p>
                    <Link to="/cek-nfc" className="text-red-600 font-black text-xs uppercase tracking-widest">
                        Ke verifikasi NFC
                    </Link>
                </div>
            </div>
        );
    }

    if (result?.ok) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50 pb-24 px-6">
                <div className="max-w-lg mx-auto py-16 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black italic text-slate-900 mb-4">Registrasi dikonfirmasi</h1>
                    <p className="text-slate-600 font-medium mb-2">
                        Pemilik konsumen: <span className="font-black text-slate-900">{result.owner.nama}</span>
                    </p>
                    <p className="text-sm font-mono text-slate-500 mb-10">
                        {formatVerificationIdDisplay(result.owner.verification_id)}
                    </p>
                    <Link
                        to={`/cek-nfc?v=${encodeURIComponent(result.owner.verification_id)}`}
                        className="inline-block px-10 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest"
                    >
                        Lihat produk
                    </Link>
                </div>
            </div>
        );
    }

    const isFirst = pending.kind === 'first_owner';

    return (
        <div className="pt-24 min-h-screen bg-slate-50 pb-24 px-6">
            <div className="max-w-xl mx-auto py-10">
                <Link to="/cek-nfc" className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-red-600 uppercase tracking-widest mb-10">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
                    <h1 className="text-2xl font-black italic text-slate-900">
                        {isFirst ? 'Konfirmasi pembeli pertama' : 'Konfirmasi pindah tangan'}
                    </h1>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {isFirst
                            ? 'Anda mendaftarkan diri sebagai pemilik konsumen pertama. Konfirmasi ini menyelesaikan registrasi setelah Sazime mengirim email ke Gmail Anda.'
                            : `Sebagai pemilik terdaftar (${pending.confirm_sent_to}), setujui pemohon berikut menjadi pemilik baru. Sazime tidak perlu menyetujui—hanya pemilik sebelumnya.`}
                    </p>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-2 text-sm">
                        <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Calon pemilik</p>
                        <p className="font-black text-slate-900">{pending.applicant.nama}</p>
                        <p className="text-slate-600 uppercase text-xs font-bold">{pending.applicant.alamat}</p>
                        <p className="font-mono text-slate-700 text-sm">{pending.applicant.gmail}</p>
                    </div>

                    <button
                        type="button"
                        onClick={confirm}
                        className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-black transition"
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
}
