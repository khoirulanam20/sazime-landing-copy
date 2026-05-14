import React, { useMemo } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nfcChips } from '../data/nfcChips';
import { findChipByVerificationId, formatVerificationIdDisplay, normalizeVerificationId } from '../lib/nfcVerification';

/**
 * Tautan lama /cek-nfc/pindah-pemilik dialihkan ke registrasi kepemilikan (email konfirmasi).
 */
const NfcTransferRequest = () => {
    const [searchParams] = useSearchParams();
    const verificationRaw =
        searchParams.get('verification_id')?.trim() ||
        searchParams.get('v')?.trim() ||
        searchParams.get('verivication_id')?.trim() ||
        '';
    const verificationParam = normalizeVerificationId(verificationRaw);
    const legacyIdNfc = searchParams.get('id_nfc')?.trim() || '';

    const chip = useMemo(() => {
        if (verificationParam.length === 10) return findChipByVerificationId(verificationParam);
        if (legacyIdNfc) return nfcChips.find((c) => c.id_nfc === legacyIdNfc) ?? null;
        return null;
    }, [verificationParam, legacyIdNfc]);

    if (!verificationParam && !legacyIdNfc) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-3xl font-black italic text-slate-900 mb-4">Parameter tidak lengkap</h1>
                    <p className="text-slate-600 font-medium mb-10">Buka dari halaman verifikasi NFC.</p>
                    <Link
                        to="/cek-nfc"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Ke Cek NFC
                    </Link>
                </div>
            </div>
        );
    }

    if (!chip) {
        return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-3xl font-black italic text-slate-900 mb-4">Chip tidak ditemukan</h1>
                    <p className="text-slate-600 font-medium mb-10">
                        {verificationParam ? (
                            <>
                                ID verifikasi{' '}
                                <span className="font-mono font-black text-red-600">
                                    {formatVerificationIdDisplay(verificationParam)}
                                </span>
                            </>
                        ) : (
                            <>Kode tidak valid.</>
                        )}
                    </p>
                    <Link
                        to="/cek-nfc"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Ke Cek NFC
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Navigate to={`/cek-nfc/registrasi?verification_id=${encodeURIComponent(chip.verification_id)}`} replace />
    );
};

export default NfcTransferRequest;
